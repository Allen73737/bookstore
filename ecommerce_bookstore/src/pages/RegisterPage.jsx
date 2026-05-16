import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import styles from "./AuthPage.module.css";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Account created! Please sign in.");
        navigate("/login");
      } else {
        setError(data.message || "Registration failed. Please try again.");
        toast.error(data.message || "Registration failed.");
      }
    } catch (err) {
      setError("An error occurred during registration. Please try again.");
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
        <div className={styles.authFormSection}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <h2 className={styles.authTitle}>Create Account</h2>
            <p className={styles.authSubtitle}>Join our community of passionate readers.</p>
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

            <form className={styles.authForm} onSubmit={handleRegister}>
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Username</label>
                <input
                  type="text"
                  className="premium-input"
                  placeholder="Choose a username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

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
                  placeholder="Create a strong password"
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
                {loading ? "Creating..." : "Register"}
              </button>
            </form>

            <div className={styles.switchAuth}>
              Already have an account? 
              <Link to="/login">Sign in here</Link>
            </div>
          </motion.div>
        </div>

        <div className={styles.authImageSection}>
          <img 
            src="https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1000&q=80" 
            alt="Reading Nook" 
            className={styles.authImage} 
          />
          <div className={styles.authImageOverlay} style={{ background: 'linear-gradient(to left, transparent, var(--color-surface))' }}></div>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
