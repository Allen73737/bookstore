import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import styles from "./AuthPage.module.css";

const LoginPage = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("jwtToken", data.token);
        if (setUser) setUser({ name: data.name || "User" });
        toast.success("Welcome back! Signed in successfully.");
        if (data.role === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/user-dashboard");
        }
      } else {
        setError(data.message || "Invalid credentials. Please try again.");
        toast.error(data.message || "Invalid credentials.");
      }
    } catch (err) {
      setError("An error occurred during login. Please try again.");
      toast.error("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authPageContainer}>
      <motion.div 
        className={styles.authCard}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: "spring" }}
      >
        <div className={styles.authImageSection}>
          <img 
            src="https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=1000&q=80" 
            alt="Library" 
            className={styles.authImage} 
          />
          <div className={styles.authImageOverlay}></div>
        </div>

        <div className={styles.authFormSection}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <h2 className={styles.authTitle}>Welcome Back</h2>
            <p className={styles.authSubtitle}>Sign in to continue your literary journey.</p>
            <div className="shimmer-line" style={{margin: '0 0 30px'}}></div>

            {error && (
              <motion.div 
                className={styles.errorMsg}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
              >
                {error}
              </motion.div>
            )}

            <form className={styles.authForm} onSubmit={handleLogin}>
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Email Address</label>
                <input
                  type="email"
                  className="premium-input"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Password</label>
                <input
                  type="password"
                  className="premium-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button 
                type="submit" 
                className={`premium-btn ${styles.submitBtn}`}
                disabled={loading}
              >
                {loading ? "Authenticating..." : "Sign In"}
              </button>
            </form>

            <div className={styles.switchAuth}>
              Don't have an account? 
              <Link to="/register">Create one here</Link>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
