import axios from "axios";

const API = axios.create({
  baseURL: "/api", // Adjust base URL to your backend server URL if needed
  headers: {
    "Content-Type": "application/json",
  },
});

// Example: Add interceptor for auth token here if you use authentication

export default API;
