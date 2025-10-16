import React, { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Link, useLocation } from "react-router-dom";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const navLinks = [
    { name: "Home", to: "/" },
    { name: "Books", to: "/books" },
    { name: "Admin Panel", to: "/admin-dashboard" },
    { name: "User Panel", to: "/user-dashboard" },
  ];

  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0 });
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const itemVariants = {
    hidden: { opacity: 0, y: -25 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.nav
      className={`${styles.navbar} ${scrolled ? styles.navbarScrolled : ""}`}
      ref={ref}
      variants={{
        hidden: { y: -80, opacity: 0 },
        visible: {
          y: 0,
          opacity: 1,
          transition: { staggerChildren: 0.12, delayChildren: 0.3 },
        },
      }}
      initial="hidden"
      animate={controls}
      exit={{ y: -80, opacity: 0, transition: { duration: 0.5 } }}
      whileHover={{ scale: 1.03, boxShadow: "0 0 20px 4px #d6c161aa" }}
    >
      <motion.div
        className={styles.logo}
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.85, type: "spring", stiffness: 260 }}
        whileTap={{ scale: 1.15 }}
      >
        ReadHaven
      </motion.div>
      <ul className={styles.navLinks}>
        {navLinks.map(({ name, to }) => (
          <motion.li
            key={name}
            className={`${styles.navItem} ${
              location.pathname === to ? styles.activeLink : ""
            }`}
            variants={itemVariants}
            whileHover={{
              scale: 1.16,
              color: "#d7bf68",
              textShadow: "0 0 22px #f7e68a",
            }}
            whileTap={{ scale: 1.25 }}
            tabIndex={0}
            role="link"
          >
            <Link to={to} className={styles.navLink}>
              {name}
            </Link>
          </motion.li>
        ))}
      </ul>
    </motion.nav>
  );
};

export default Navbar;
