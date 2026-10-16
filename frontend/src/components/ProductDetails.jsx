import { useNavigate, useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import api from "../axios";
import { useAuth } from "../AuthContext";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { token } = useAuth();

  let currentUserId = null;

  if (token) {
    try {
      currentUserId = jwtDecode(token).id;
    } catch {
      currentUserId = null;
    }
  }

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(`/products/${id}`)
      .then((res) => {
        console.log("Produt Detail:", res.data);
        setProduct(res.data);
        setSelectedImage(0);
      })
      .catch((err) => {
        console.log(err);
        setError("Product not Found.");
      });
  }, [id]);

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Kya tum sach mein ye product delete karna chahte ho?",
    );

    if (!confirmDelete) return;

    try {
      setDeleting(true);
      await api.delete(`/products/${id}`);

      toast.success("Product deleted successfully!");
      navigate("/");
    } catch (err) {
      console.log(err);
      setError("Product delete nahi ho paya.");
      setDeleting(false);
    }
  };

  if (error && !product) {
    return <p className="pt-28 text-center text-red-600">{error}</p>;
  }

  if (!product) {
    return <p className="pt-28 text-center">Loading product...</p>;
  }

  const images = product.image || [];

  const isOwner =
    currentUserId &&
    product.owner &&
    product.owner.toString() === currentUserId;

  return (
    <div className="min-h-screen px-4 py-10 pt-12 sm:px-8 lg:px-16">
      <div className="mx-auto max-w-6xl">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm text-slate-300">
          <Link to="/" className="hover:text-blue-600">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-white">Product Details</span>
        </div>

        {/* Product layout */}
        <div className="grid grid-cols-1 gap-10 rounded-2xl bg-white p-5 shadow-sm md:p-8 lg:grid-cols-2">
          {/* Images section */}
          <div>
            <div className="flex h-80 items-center justify-center overflow-hidden rounded-xl bg-slate-100 sm:h-[450px]">
              {images.length > 0 ? (
                <img
                  src={images[selectedImage]}
                  alt={product.name}
                  className="h-full w-full object-contain"
                />
              ) : (
                <p className="text-gray-500">No image available</p>
              )}
            </div>

            {/* All image thumbnails */}
            {images.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-3">
                {images.map((url, index) => (
                  <button
                    type="button"
                    key={url}
                    onClick={() => setSelectedImage(index)}
                    className={`h-20 overflow-hidden rounded-lg border-2 ${
                      selectedImage === index
                        ? "border-blue-600"
                        : "border-transparent"
                    }`}
                  >
                    <img
                      src={url}
                      alt={`${product.name} ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product information */}
          <div className="flex flex-col">
            <p className="text-sm font-medium uppercase tracking-wider text-fuchsia-400">
              Marketplace Product
            </p>

            <h1 className="mt-3 break-words text-3xl font-bold text-slate-900 sm:text-4xl">
              {product.name}
            </h1>

            <p className="mt-5 text-3xl font-bold text-emerald-600">
              ₹{Number(product.price).toLocaleString("en-IN")}
            </p>

            <div className="my-6 border-t border-slate-200" />

            <h2 className="text-lg font-semibold text-slate-900">
              Product Description
            </h2>

            <p className="mt-3 whitespace-pre-wrap break-words leading-7 text-slate-600">
              {product.description || "No description provided."}
            </p>

            {/* <div className="mt-6 text-sm text-gray-500">
              Product ID: {product._id}
            </div> */}

            {/* Actions */}
            {isOwner && (
              <div className="mt-auto flex flex-wrap gap-3 pt-8">
                <Link
                  to={`/product/${id}/edit`}
                  className="rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-3 font-medium text-white transition hover:opacity-90"
                >
                  Edit Product
                </Link>

                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="rounded-lg bg-red-100 px-6 py-3 font-medium text-red-700 transition hover:bg-red-200 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {deleting ? "Deleting..." : "Delete Product"}
                </button>
              </div>
            )}

            {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
