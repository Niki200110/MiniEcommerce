import axios from "axios";
import { toast } from "react-toastify";


const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
});

// Har protected request mein token attach hoga.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Common friendly error messages.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url || "";
    const status = error.response?.status;

    // Login/signup ke errors unke components handle karenge.
    const isAuthPage = url.includes("/login") || url.includes("/signup");

    if (!error.response) {
      toast.error("Unable to connect. Please try again.");
    } else if (status === 401 && !isAuthPage) {
      toast.info("Please login to continue.");
    } else if (status === 403) {
      toast.error("You can only edit or delete your own products.");
    }

    return Promise.reject(error); //Ye original error ko reject karta hai, taaki jis component ne API call ki hai, woh bhi error handle kar sake.
  },
);

export default api;
