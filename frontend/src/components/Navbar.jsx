import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { toast } from "react-toastify";

export default function Navbar() {
  const navigate = useNavigate();
  const { token, setToken } = useAuth();

  const handleLogout = () => {
    setToken(null);
    toast.success("Logout successfully!");
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#0a0512]/80 text-white backdrop-blur-xl">
      <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold tracking-wide text-white">
          <i className="fa-brands fa-sitrox mr-2 text-purple-400"></i>
          E-commerce<span className="text-purple-400">.</span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-5 font-medium">
          <Link
            to="/"
            className="text-gray-300 transition hover:text-purple-400"
          >
            Home
          </Link>

          {token ? (
            <>
              <Link
                to="/products/new"
                className="text-gray-300 transition hover:text-purple-400"
              >
                New Product
              </Link>

              <button
                onClick={handleLogout}
                className="rounded-lg bg-purple-600 px-4 py-2 text-white transition hover:bg-purple-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/signup"
                className="text-gray-300 transition hover:text-purple-400"
              >
                Signup
              </Link>

              <Link
                to="/login"
                className="rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2 text-white transition hover:opacity-90"
              >
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
