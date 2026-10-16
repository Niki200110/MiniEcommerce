import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#0a0512]/50 text-gray-300">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-12 sm:grid-cols-2 md:grid-cols-4">
        {/* Brand */}
        <div>
          <Link to="/" className="text-2xl font-bold text-white">
            MiniMarket<span className="text-purple-400">.</span>
          </Link>

          <p className="mt-4 text-sm leading-6 text-gray-400">
            Buy and sell products easily. Discover great deals and find your
            next favourite item.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="mb-4 font-semibold text-white">Quick Links</h3>

          <div className="flex flex-col gap-3 text-sm">
            <Link to="/" className="hover:text-purple-400">
              Home
            </Link>

            <Link to="/" className="hover:text-purple-400">
              Browse Products
            </Link>

            <Link to="/products/new" className="hover:text-purple-400">
              Sell a Product
            </Link>
          </div>
        </div>

        {/* Account */}
        <div>
          <h3 className="mb-4 font-semibold text-white">Your Account</h3>

          <div className="flex flex-col gap-3 text-sm">
            <Link to="/login" className="hover:text-purple-400">
              Login
            </Link>

            <Link to="/signup" className="hover:text-purple-400">
              Signup
            </Link>
          </div>
        </div>

        {/* Contact */}
        <div>
          <h3 className="mb-4 font-semibold text-white">Get in Touch</h3>

          <p className="text-sm leading-6 text-gray-400">
            Have questions about a product? Get in touch with us.
          </p>

          <a
            href="mailto:support@minimarket.com"
            className="mt-3 inline-block text-sm text-purple-400 hover:text-purple-300"
          >
            Contact Support
          </a>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 px-6 py-5 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} MiniMarket. All rights reserved.
      </div>
    </footer>
  );
}
