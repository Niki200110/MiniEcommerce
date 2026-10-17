import axios from "axios";
import { toast } from "react-toastify";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
});

// Har protected request mein token attach hoga.
// Request interceptor server ko request bhejne se PEHLE kaam karta hai.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");    //leraha 

  if (token) {                                    //laga rha
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Common friendly error messages.
// Response interceptor server se response aane ke BAAD kaam karta hai.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url || "";
    const status = error.response?.status;

    // Login/signup ke errors unke components handle karenge.
    const isAuthPage = url.includes("/login") || url.includes("/signup");

    // Internet ya connection error
    if (!error.response) {
      toast.error("Unable to connect. Please try again.");
    } //401 — Authentication problem necha hai
    else if (status === 401 && !isAuthPage) {
      localStorage.removeItem("token");

      toast.info("Session expired. Please login again.");

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } //403 — Permission nahi hai
    else if (status === 403) {
      toast.error("You can only edit or delete your own products.");
    }

    return Promise.reject(error); //Ye original error ko reject karta hai, taaki jis component ne API call ki hai, woh bhi error handle kar sake.(Error ko error ki tarah aage bhejo)
  },
);

export default api;
