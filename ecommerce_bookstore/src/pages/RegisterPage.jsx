import React, { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import styles from "./AuthPage.module.css";

const RegisterPage = () => {
  const [registerRef, registerInView] = useInView({ threshold: 0.25, triggerOnce: true });

  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPass, setRegisterPass] = useState("");
  const [registerConfirmPass, setRegisterConfirmPass] = useState("");
  const [registerMessage, setRegisterMessage] = useState(null);

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setRegisterMessage(null);
    if (registerPass !== registerConfirmPass) {
      alert("Passwords do not match.");
      return;
    }
    fetch("http://localhost:5000/api/users/register", {  // full backend URL
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: registerName, email: registerEmail, password: registerPass }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Registration failed.");
        setRegisterMessage("Registration successful! Please log in.");
        setRegisterName("");
        setRegisterEmail("");
        setRegisterPass("");
        setRegisterConfirmPass("");
      })
      .catch((err) => setRegisterMessage(err.message || "Registration failed. Please try again."));
  };

  return (
    <motion.div
      className={styles.pageRoot}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <motion.section
        ref={registerRef}
        className={styles.authSectionLandscape}
        initial={{ opacity: 0, y: 40 }}
        animate={registerInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1 }}
        whileHover={{ scale: 1.02, boxShadow: "0 20px 54px #a6a26bbb" }}
      >
        <motion.div
          className={styles.authIntro}
          initial={{ opacity: 0, x: -18 }}
          animate={registerInView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.15, duration: 0.9 }}
        >
          <motion.h1
            className={styles.welcomeCurvy}
            initial={{ y: 16, scale: 1 }}
            animate={registerInView ? { y: 0, scale: 1 } : {}}
            transition={{ delay: 0.25, duration: 1, type: "spring" }}
          >
            Welcome to ReadHaven
          </motion.h1>
          <motion.p
            className={styles.authOverview}
            initial={{ opacity: 0, y: 12 }}
            animate={registerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5, duration: 1 }}
          >
            Join our book community and embark on a journey of endless discovery.
          </motion.p>
          <motion.p
            className={styles.authCaption}
            initial={{ opacity: 0, y: 12 }}
            animate={registerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.65, duration: 1 }}
          >
            Sign up to participate in reading challenges, get exclusive perks, and connect with passionate readers.
          </motion.p>
        </motion.div>

        <motion.form
          className={styles.authForm}
          onSubmit={handleRegisterSubmit}
          initial={{ opacity: 0 }}
          animate={registerInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.9, duration: 1 }}
        >
          <motion.input
            type="text"
            placeholder="Name"
            className={styles.authInput}
            value={registerName}
            onChange={(e) => setRegisterName(e.target.value)}
            required
            initial={{ opacity: 0, scale: 0.92 }}
            animate={registerInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 1, duration: 0.7 }}
          />
          <motion.input
            type="email"
            placeholder="Email"
            className={styles.authInput}
            value={registerEmail}
            onChange={(e) => setRegisterEmail(e.target.value)}
            required
            initial={{ opacity: 0, scale: 0.92 }}
            animate={registerInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 1.15, duration: 0.7 }}
          />
          <motion.input
            type="password"
            placeholder="Password"
            className={styles.authInput}
            value={registerPass}
            onChange={(e) => setRegisterPass(e.target.value)}
            required
            initial={{ opacity: 0, scale: 0.92 }}
            animate={registerInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 1.3, duration: 0.7 }}
          />
          <motion.input
            type="password"
            placeholder="Confirm Password"
            className={styles.authInput}
            value={registerConfirmPass}
            onChange={(e) => setRegisterConfirmPass(e.target.value)}
            required
            initial={{ opacity: 0, scale: 0.92 }}
            animate={registerInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 1.45, duration: 0.7 }}
          />
          <motion.button
            type="submit"
            className={`${styles.authBtnAlt} ${styles.shimmerBtn}`}
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={registerInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 1.6, duration: 0.7 }}
          >
            Register
          </motion.button>
          {registerMessage && (
            <motion.div
              className={styles.loginMessage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.8 }}
            >
              {registerMessage}
            </motion.div>
          )}
        </motion.form>
      </motion.section>
    </motion.div>
  );
};

export default RegisterPage;
