import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./context/ThemeContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Books from "./pages/BooksPage"; 
import Cart from "./pages/CartPage";
import Login from "./pages/LoginPage";
import Register from "./pages/RegisterPage";
import UserDashboard from "./pages/UserDashboardPage";
import AdminDashboard from "./pages/AdminDashboardpage";
import ReservationPage from "./pages/ReservationPage";
import BookDetailsPage from "./pages/BookDetailsPage";
import CheckoutPage from "./pages/CheckoutPage";

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    const storedName = localStorage.getItem("userName");
    const storedRole = localStorage.getItem("userRole");
    if (token) {
      setUser({ name: storedName || "User", role: storedRole || "user" });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    setUser(null);
  };

  return (
    <ThemeProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: 'var(--color-surface)',
              color: 'var(--color-text-main)',
              border: '1px solid var(--color-primary-glow)',
              borderRadius: '12px',
              padding: '16px 20px',
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.95rem',
              boxShadow: '0 12px 40px rgba(0,0,0,0.4)',
            },
            success: {
              iconTheme: { primary: 'var(--color-primary)', secondary: 'var(--color-bg)' },
            },
            error: {
              iconTheme: { primary: 'var(--color-danger)', secondary: 'var(--color-bg)' },
            },
          }}
        />
        <Navbar user={user} />
        <main style={{ minHeight: "80vh" }}>
          <Routes>
            <Route path="/" element={<Home user={user} />} />
            <Route path="/books" element={<Books />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/register" element={<Register setUser={setUser} />} />
            <Route path="/user-dashboard" element={<UserDashboard setUser={setUser} />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/reservations" element={<ReservationPage />} />
            <Route path="/book/:id" element={<BookDetailsPage />} />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
