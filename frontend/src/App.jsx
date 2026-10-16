import "./App.css";
import CreateProduct from "./components/CreateProduct";
import EditProduct from "./components/EditProduct";
import Navbar from "./components/Navbar";
import ProductDetails from "./components/ProductDetails";
import ProductList from "./components/ProductList";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Footer from "./components/Footer";
import { useAuth } from "./AuthContext";

function ProtectedRoute({ children }) {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function AppContent() {
  const location = useLocation();

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#0a0512] text-white">
      {/* Purple Glow */}
      <div className="pointer-events-none fixed -top-24 right-0 h-[600px] w-[600px] rounded-full bg-[#5b138a]/40 blur-[130px]" />

      <div className="pointer-events-none fixed top-1/3 left-1/2 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-[#3d0b5e]/30 blur-[150px]" />

      {/* Grid Pattern */}
      <div
        className="pointer-events-none fixed inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.15) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
          maskImage:
            "radial-gradient(ellipse at center, black 40%, transparent 80%)",
        }}
      />

      {/* Navbar, Pages & Footer */}
      <div className="relative z-10 flex flex-1 flex-col">
        {location.pathname !== "/signup" && <Navbar />}

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route
              path="/products/new"
              element={
                <ProtectedRoute>
                  <CreateProduct />
                </ProtectedRoute>
              }
            />
            <Route
              path="/product/:id/edit"
              element={
                <ProtectedRoute>
                  <EditProduct />
                </ProtectedRoute>
              }
            />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="*"
              element={
                <div className="flex flex-1 items-center justify-center">
                  <h1 className="text-3xl font-bold text-white">
                    404 - Page Not Found
                  </h1>
                </div>
              }
            />
          </Routes>
        </main>

        <Footer />
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
