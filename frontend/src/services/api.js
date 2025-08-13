import axios from "axios";
import { getToken } from "../utils/auth";

// Create an axios instance with default config
const api = axios.create({
  // Base URL for all API requests (use env variable or fallback to localhost)
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  // Whether to send cookies with requests; set to true if using cookie-based auth
  withCredentials: false,
});

// Add a request interceptor to include auth token in headers if available
api.interceptors.request.use((config) => {
  const token = getToken(); // Retrieve JWT token from storage/util
  if (token) {
    // Add Authorization header with Bearer token
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
