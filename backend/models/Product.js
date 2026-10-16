const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    min: 0,
    required: true,
  },
  description: String,
  image: [
    {
      type: String,
      default: "https://placehold.co/400x250",
    },
  ],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", //model ka name User file me hai na
  },
});

module.exports = mongoose.model("Product", productSchema);
