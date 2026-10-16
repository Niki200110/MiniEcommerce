require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Product = require("./models/Product");
const wrapAsync = require("./utils/wrapAsync");
const ExpressError = require("./utils/ExpressError");
const { productSchema } = require("./schema");
const upload = require("./multer");
// passport start yeaha sa authentication/authorization wala part
const passport = require("passport");
const User = require("./models/User");
//jwt(jsowebtoken)
const jwt = require("jsonwebtoken");
const authenticateToken = require("./middleware/auth");

const app = express();

let port = 3000;

mongoose
  // .connect("mongodb://127.0.0.1:27017/ecommerce")
  .connect(process.env.ATLASDB_URL)
  .then(() => console.log("MongoDB connected ✅"))
  .catch((err) => console.log(err));

// app.listen(port,()=>{
//     console.log(`app is listing on port ${port}🚀`)
// })

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
  }),
);
app.use(express.json());
// passport
app.use(passport.initialize());

passport.use(User.createStrategy());

const uploadImageUrl = (req, res, next) => {
  if (req.file) req.body.image = req.file.path;
  next();
};

const validateProductImages = (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return next(
      new ExpressError(400, "At least one product image is required"),
    );
  }
  next();
};

// validation middleware
const validateProduct = (req, res, next) => {
  const result = productSchema.validate(req.body);
  // console.log(result);

  if (result.error) {
    // console.log(result.error);
    const message = result.error.details[0].message;
    return next(new ExpressError(400, message));
  }
  next();
};

// routes start

app.get("/", (req, res) => {
  res.send("Mini Marketplace Backend Running!");
});

// index route main page (All products)

app.get(
  "/products",
  wrapAsync(async (req, res) => {
    const products = await Product.find({});
    res.json(products);
  }),
);

// create ha necha
// post (naya product save karna),(yaa phir ye bol sakta ha- naya product save karna.)
app.post(
  "/products",
  authenticateToken, // 🆕 token check
  upload.array("image", 4),
  // uploadImageUrl, // yeahi chej bus uper middleware me likh diya (req, res, next) => {
  //   if (req.file) {
  //     req.body.image = req.file.path;
  //   }
  //   next();
  // },
  validateProductImages,
  validateProduct,
  wrapAsync(async (req, res) => {
    // console.log(req)
    const product = new Product({
      ...req.body,
      image: req.files.map((file) => file.path),
      owner: req.user.id, //req.user.id JWT middleware se aata hai. Yaad hai humne middleware mein req.user = decoded likha tha?(authenticatetoken se)
    });
    // console.log("new product:",product)
    await product.save();

    res.status(201).json(product);
  }),
);

// new form data lena(by id)
app.get(
  "/products/:id",
  wrapAsync(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
      throw new ExpressError(404, "Product not found");
    }

    res.json(product);
  }),
);

//edit karna
app.put(
  "/products/:id",
  authenticateToken, // 🆕 token check
  upload.array("image", 4),
  validateProduct,
  wrapAsync(async (req, res) => {
    // const updatedProduct = await Product.findByIdAndUpdate(
    //   req.params.id,
    //   req.body,
    //   { new: true, runValidators: true },
    // );
    // if (!updatedProduct) {
    //   throw new ExpressError(404, "Product not found for edit");
    // }

    const updatedProduct = await Product.findById(req.params.id);

    if (!updatedProduct) {
      throw new ExpressError(404, "Product not found");
    }

    // authorization check
    if (updatedProduct.owner.toString() !== req.user.id) {
      throw new ExpressError(403, "You cannot edit this product");
    }

    updatedProduct.name = req.body.name;
    updatedProduct.price = Number(req.body.price);
    updatedProduct.description = req.body.description;

    // Nayi images select ki hain toh purani replace hongi
    if (req.files && req.files.length > 0) {
      updatedProduct.image = req.files.map((file) => file.path);
    }

    await updatedProduct.save();

    res.json(updatedProduct);
  }),
);

// delete product
app.delete(
  "/products/:id",
  authenticateToken, // 🆕 token check
  wrapAsync(async (req, res) => {
    const deleteProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deleteProduct) {
      throw new ExpressError(404, "Product not found for delete");
    }

    // authorization check
    if (deleteProduct.owner.toString() !== req.user.id) {
      throw new ExpressError(403, "You cannot delete this product");
    }

    res.json({ message: "Product deleted successfully" });
  }),
);

// signup api yaha se authentication/authoriztion start(new user register karna)
app.post(
  "/signup",
  wrapAsync(async (req, res) => {
    const { username, email, password } = req.body;

    const user = new User({ username, email });

    const registeredUser = await User.register(user, password);

    res.status(201).json({
      message: "Signup successful",
      user: {
        id: registeredUser._id,
        username: registeredUser.username,
        email: registeredUser.email,
      },
    });
  }),
);

//Login API + JWT token (user ke credentials verify karna)
app.post(
  "/login",
  wrapAsync(async (req, res) => {
    const { username, password } = req.body;

    const authenticate = User.authenticate();
    const [err, user, info] = await new Promise((resolve) => {
      authenticate(username, password, (err, user, info) => {
        resolve([err, user, info]);
      });
    });

    if (err) throw err;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password",
      });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    res.json({
      message: "Login successful",
      token,
    });
  }),
);

// Sabhi valid routes ke BAAD
app.use((req, res) => {
  res.status(404).json({
    message: "API route not found",
  });
});

// error handling middleware
app.use((err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // React se /products/abc request aayi, to Mongoose abc ko MongoDB ObjectId mein convert nahi kar payega. Isse CastError aayega.
  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid product ID";
  }
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
});

app.listen(port, () => {
  console.log(`app is listing on port ${port}🚀`);
});
