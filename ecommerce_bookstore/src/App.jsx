import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Books from "./pages/BooksPage"; 

import Cart from "./pages/CartPage";
import Login from "./pages/LoginPage";
import Register from "./pages/RegisterPage";
import UserDashboard from "./pages/UserDashboardPage";
import AdminDashboard from "./pages/AdminDashboardpage";
import Reservation from "./components/Reservation";

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // On app load, check if user is logged in via token or user info in localStorage
    const token = localStorage.getItem("jwtToken");
    if (token) {
      // Here set user state. Could also verify token or fetch user info from backend
      setUser({ name: "User" }); // Replace with actual user data or fetch call
    }
  }, []);
  const handleLogout = () => {
  localStorage.removeItem("jwtToken"); // Clear stored token
  setUser(null); // Clear user state so UI updates accordingly
};


  return (
    <BrowserRouter>
      <Navbar />
      <div style={{ padding: "20px", minHeight: "80vh" }}>
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/books" element={<Books />} />
         
          <Route path="/cart" element={<Cart />} />
          
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register setUser={setUser} />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/reservations" element={<Reservation />} />
        </Routes>
      </div>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
