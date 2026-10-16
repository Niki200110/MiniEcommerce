import { Link } from "react-router-dom";

export default function ProductCard({ id, name, price, image }) {
  return (
    <>
      <div className="w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
        {/* Product Image */}
        <div className="overflow-hidden bg-gray-100">
          <img
            src={image?.[0] || "https://placehold.co/300x200"}
            alt={name || "Product image"}
            className="h-52 w-full object-cover transition duration-300 hover:scale-105"
          />
        </div>

        {/* Product Details */}
        <div className="p-4">
          <h2 className="truncate text-lg font-semibold text-gray-800">
            {name}
          </h2>

          <p className="mt-2 text-xl font-bold text-green-600">₹{price}</p>

          <Link
            to={`/product/${id}`}
            className="mt-4 block rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2.5 text-center font-medium text-white transition hover:opacity-90"
          >
            View Details
          </Link>
        </div>
      </div>
    </>
  );
}
