import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import axios from "axios";
import HomePage from "./HomePage";
import api from "../axios";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    api
      .get("/products")
      .then((res) => setProducts(res.data))
      .catch((err) => {
        console.log(err);
        setError("Products load nahi ho paaye!");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const searchhandler = () => {
    setSearch(searchInput);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;

    setSearchInput(value);

    if (value.trim() === "") {
      setSearch("");
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12">
        {/* Automatic Image Slider */}
        <HomePage />
        {/* Heading */}
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-fuchsia-400">
            Mini Marketplace
          </p>

          <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">
            Discover Products
          </h1>

          <p className="mt-3 text-slate-300">
            Find something you love at a price you like.
          </p>
        </div>

        {/* Search Bar */}
        <form
          className="mb-8 flex max-w-2xl gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            searchhandler();
          }}
        >
          <input
            value={searchInput}
            onChange={handleSearchChange}
            type="search"
            placeholder="Search products..."
            className="min-w-0 flex-1 rounded-xl border border-white/20 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-400/30"
          />

          <button
            type="submit"
            className="rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-3 font-semibold text-white transition hover:opacity-90"
          >
            Search
          </button>
        </form>

        {/* Product Count */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-bold text-white">All Products</h2>

          <p className="text-sm text-slate-300">
            {filteredProducts.length} products found
          </p>
        </div>

        {/* Loading and Error */}
        {loading && (
          <p className="py-10 text-center text-gray-500">Loading products...</p>
        )}

        {error && (
          <p className="rounded-xl bg-red-50 p-4 text-red-600">{error}</p>
        )}

        {/* Product Grid */}
        {!loading && !error && filteredProducts.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product._id}
                id={product._id}
                name={product.name}
                price={product.price}
                image={product.image}
              />
            ))}
          </div>
        )}

        {/* No Products Found */}
        {!loading && !error && filteredProducts.length === 0 && (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
            <h3 className="text-xl font-semibold text-gray-800">
              No products found
            </h3>

            <p className="mt-2 text-gray-500">Try another product name.</p>

            <button
              type="button"
              onClick={() => {
                setSearchInput("");
                setSearch("");
              }}
              className="mt-5 rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700"
            >
              Show All Products
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
