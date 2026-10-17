import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import api from "../axios";
import { toast } from "react-toastify";

export default function CreateProduct() {
  const [formData, setFormData] = useState({
    product: "",
    price: "",
    description: "",
    image: "",
  });
  const [imageFile, setImageFile] = useState([]);
  const navigate = useNavigate();

  // styling ke liya ha yea ab
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("idle");

  const inputformhandler = (e) => {
    let fieldname = e.target.name;
    let fieldvalue = e.target.value;
    setFormData((prev) => {
      return { ...prev, [fieldname]: fieldvalue };
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    // agr image select nahi kiya toh message
    if (imageFile.length === 0) {
      alert("Please select at least one product image");
      return;
    }
    console.log(formData);
    console.log("Selected Image:", imageFile);

    setProgress(0);
    setStatus("uploading");

    try {
      // await axios.post("http://localhost:3000/products", {
      //   name: formData.product,
      //   price: Number(formData.price),
      //   description: formData.description,
      //   image: formData.image,
      // });

      // after file upload ho raha ab json me data nahi jayga uper wala formData me jayga☝️

      const data = new FormData();

      data.append("name", formData.product);
      data.append("price", Number(formData.price));
      data.append("description", formData.description);

      imageFile.forEach((file) => {
        data.append("image", file);
      });

      await api.post("/products", data, {
        onUploadProgress: (event) => {
          if (event.total) {
            const percent = Math.round((event.loaded / event.total) * 100);

            setProgress(percent);
          }
        },
      });

      toast.success("Product created successfully!");
      // alert("Product added successfully!");
      // navigate("/");
      setTimeout(() => {
        navigate("/",{ replace: true });
      }, 1500);

      setFormData({
        product: "",
        price: "",
        description: "",
        image: "",
      });

      setProgress(100);
      setStatus("success");
    } catch (error) {
      alert(error.response?.data?.message || "Server se connect nahi ho paya");
      setStatus("error");
    }
  };
  return (
    <form className="max-w-md mx-auto pt-24" onSubmit={handleSubmit}>
      <div className="relative z-0 w-full mb-5 group">
        <input
          value={formData.product}
          name="product"
          id="floating_Product"
          className="block py-2.5 px-0 w-full text-sm text-heading bg-transparent border-0 border-b-2 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer"
          placeholder=" "
          required
          onChange={inputformhandler}
        />
        <label
          htmlFor="floating_Product"
          className="absolute text-sm text-body duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
        >
          Product Name
        </label>
      </div>
      <div className="relative z-0 w-full mb-5 group">
        <input
          name="price"
          value={formData.price}
          type="number"
          id="floating_Price"
          className="block py-2.5 px-0 w-full text-sm text-heading bg-transparent border-0 border-b-2 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer"
          placeholder=" "
          required
          onChange={inputformhandler}
        />
        <label
          htmlFor="floating_Price"
          className="absolute text-sm text-body duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
        >
          Price
        </label>
      </div>
      <div className="relative z-0 w-75 mb-5 group">
        <label
          className="block mb-2.5 text-sm font-medium text-heading"
          htmlFor="file_image"
        >
          Upload Product
        </label>
        <input
          accept="image/*"
          multiple
          id="file_image"
          type="file"
          className="cursor-pointer bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm file:bg-blue-600 file:text-white file:border-0 file:rounded-l-lg file:px-4 file:py-2 file:mr-4 file:font-semibold hover:file:bg-blue-700"
          onChange={(e) => setImageFile(Array.from(e.target.files))}
        />
      </div>

      {/* Uploading ke waqt */}
      {status === "uploading" && (
        <div className="mt-4">
          <p>Uploading... {progress}%</p>

          <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Upload successful */}
      {status === "success" && (
        <p className="mt-4 text-green-600">Upload Done! 100%</p>
      )}

      {/* Upload failed */}
      {status === "error" && (
        <p className="mt-4 text-red-600">Upload Failed! Please try again.</p>
      )}

      {/* <div className="relative z-0 w-full mb-5 group">
        <input
          accept="image/*"
          type="file"
          id="floating_image"
          className="block py-2.5 px-0 w-full text-sm text-heading bg-transparent border-0 border-b-2 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer"
          placeholder=" "
          required
          onChange={(e) => setImageFile(e.target.files[0])}
        />
        <label
          htmlFor="floating_image"
          className="absolute text-sm text-body duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
        >
          Image Link
        </label>
      </div> */}
      <div className="relative z-0 w-full mb-5 mt-8 group">
        <input
          name="description"
          value={formData.description}
          id="floating_repeat_Description"
          className="block py-2.5 px-0 w-full text-sm text-heading bg-transparent border-0 border-b-2 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer"
          placeholder=" "
          onChange={inputformhandler}
        />
        <label
          htmlFor="floating_repeat_Description"
          className="absolute text-sm text-body duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
        >
          Description
        </label>
      </div>

      {status === "success" && (
        <p className="mt-4 text-green-600">Product updated successfully!</p>
      )}

      <button
        className="border rounded p-2 bg-blue-300 hover:bg-blue-500"
        type="submit"
        disabled={status === "uploading"}
      >
        {status === "uploading" ? "Adding..." : "Add Product"}
      </button>
    </form>
  );
}
