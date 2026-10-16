import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../axios";
import { toast } from "react-toastify";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    image: [],
  });

  const [imageFile, setImageFile] = useState([]);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  // Existing product data fetch
  useEffect(() => {
    api
      .get(`/products/${id}`)
      .then((res) => {
        setFormData({
          name: res.data.name,
          price: res.data.price,
          description: res.data.description || "",
          image: res.data.image || [],
        });
      })
      .catch((err) => {
        console.log(err);
        setError("Product not found.");
      });
  }, [id]);

  // Text inputs handle
  const inputformhandler = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // New images select
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 4) {
      setError("Maximum 4 images select kar sakte ho.");
      setImageFile([]);
      e.target.value = "";
      return;
    }

    setImageFile(files);
    setError("");
    setStatus("idle");
  };

  // Update product
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setProgress(0);
    setStatus("uploading");

    try {
      const data = new FormData();

      data.append("name", formData.name);
      data.append("price", Number(formData.price));
      data.append("description", formData.description);

      imageFile.forEach((file) => {
        data.append("image", file);
      });

      await api.put(`/products/${id}`, data, {
        onUploadProgress: (event) => {
          if (event.total) {
            const percent = Math.round((event.loaded / event.total) * 100);

            setProgress(percent);
          }
        },
      });

      setProgress(100);
      setStatus("success");

      toast.success("Product updated successfully!");
      setTimeout(() => {
        navigate(`/product/${id}`);
      }, 1500);
    } catch (err) {
      setStatus("error");
      setError(err.response?.data?.message || "Product update nahi ho paya.");
    }
  };

  return (
    <form className="max-w-md mx-auto pt-14 pb-5" onSubmit={handleSubmit}>
      <h2 className="text-xl font-semibold mb-6">Edit Product</h2>

      <div className="mb-5">
        <label className="block mb-2 text-sm font-medium text-gray-200">Product Name</label>
        <input
          name="name"
          value={formData.name}
          onChange={inputformhandler}
          placeholder="Product Name"
          className="border border-gray-300 p-3 w-full rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
        />
      </div>

      <div className="mb-5">
        <label className="block mb-2 text-sm font-medium">Price</label>
        <input
          name="price"
          type="number"
          min="0"
          value={formData.price}
          onChange={inputformhandler}
          placeholder="Price"
          className="border border-gray-300 p-3 w-full rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
        />
      </div>

      <div className="mb-5">
        <label className="block mb-2 text-sm font-medium">Description</label>
        <input
          name="description"
          value={formData.description}
          onChange={inputformhandler}
          placeholder="Description"
          className="border border-gray-300 p-3 w-full rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* Existing images preview */}
      <div className="mb-5">
        <p className="mb-2 text-sm font-medium text-gray-200">Current Product Images</p>

        {formData.image.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {formData.image.map((url, index) => (
              <img
                key={url}
                src={url}
                alt={`Product image ${index + 1}`}
                className="w-full h-36 object-cover rounded"
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No existing images.</p>
        )}
      </div>

      {/* Select replacement images */}
      <div className="mb-5">
        <label htmlFor="file_image" className="block mb-2 text-sm font-medium">
          Upload New Images (optional, max 4)
        </label>

        <input
          id="file_image"
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          className="cursor-pointer bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full shadow-sm file:bg-purple-600 file:text-white file:border-0 file:rounded-l-lg file:px-4 file:py-2 file:mr-4 file:font-semibold hover:file:bg-purple-700"
        />

        <p className="text-sm text-gray-400 mt-2">
          Nayi images select karoge toh purani images replace hongi. Select nahi
          karoge toh purani images rahengi.
        </p>

        {imageFile.length > 0 && (
          <p className="text-sm mt-2">
            {imageFile.length} new image(s) selected.
          </p>
        )}
      </div>

      {/* Upload progress */}
      {status === "uploading" && (
        <div className="mt-4">
          <p>Updating... {progress}%</p>
          <div className="w-full bg-white/10 rounded-full h-3 mt-2">
            <div
              className="bg-purple-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {status === "success" && (
        <p className="mt-4 text-green-600">Product updated successfully!</p>
      )}

      {status === "error" && (
        <p className="mt-4 text-red-600">
          {error || "Update failed. Please try again."}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "uploading"}
        className="w-full rounded-lg mt-4 p-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold shadow-lg shadow-purple-500/20 transition hover:opacity-90 disabled:opacity-50"
      >
        {status === "uploading" ? "Updating..." : "Update Product"}
      </button>
    </form>
  );
}
