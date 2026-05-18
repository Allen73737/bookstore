import axios from "axios";

const API = axios.create({
  baseURL: "/api", // Adjust base URL to your backend server URL if needed
  headers: {
    "Content-Type": "application/json",
  },
});

// Add interceptor for auth token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwtToken") || localStorage.getItem("adminToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;
