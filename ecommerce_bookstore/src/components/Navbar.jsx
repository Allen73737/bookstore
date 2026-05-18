import React, { useState, useEffect } from "react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Link, useLocation } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const navLinks = [
    { name: "Home", to: "/" },
    { name: "Collection", to: "/books" },
    { name: "Reservations", to: "/reservations" },
    { name: "Dashboard", to: "/user-dashboard" },
    { name: "Admin", to: "/admin-dashboard" },
  ];

  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0 });
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const itemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
  };

  const mobileMenuVariants = {
    hidden: { opacity: 0, height: 0, transition: { duration: 0.3, ease: "easeInOut" } },
    visible: { 
      opacity: 1, 
      height: "auto", 
      transition: { 
        duration: 0.4, 
        ease: "easeOut",
        staggerChildren: 0.08,
        delayChildren: 0.1
      } 
    }
  };

  const mobileItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 25 } }
  };

  return (
    <motion.nav
      className={`${styles.navbar} ${scrolled ? styles.navbarScrolled : ""} ${isMobileMenuOpen ? styles.navbarExpanded : ""}`}
      ref={ref}
      variants={{
        hidden: { y: -80, opacity: 0 },
        visible: {
          y: 0,
          opacity: 1,
          transition: { staggerChildren: 0.1, delayChildren: 0.1 },
        },
      }}
      initial="hidden"
      animate={controls}
    >
      <div className={styles.navbarInner}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
        >
          <Link to="/" className={styles.logo} onClick={() => setIsMobileMenuOpen(false)}>
            <svg className={styles.logoIcon} width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
            </svg>
            ReadHaven
          </Link>
        </motion.div>

        {/* Desktop Menu */}
        <ul className={styles.navLinks}>
          {navLinks.map(({ name, to }) => (
            <motion.li
              key={name}
              className={`${styles.navItem} ${
                location.pathname === to ? styles.activeLink : ""
              }`}
              variants={itemVariants}
            >
              <Link to={to} className={styles.navLink}>
                {name}
              </Link>
            </motion.li>
          ))}
          
          <motion.li variants={itemVariants}>
            <Link to="/cart" className={styles.navLink}>
              <div className={styles.cartIconContainer}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                <span>Cart</span>
              </div>
            </Link>
          </motion.li>

          <motion.li variants={itemVariants}>
            <ThemeToggle />
          </motion.li>
        </ul>

        {/* Mobile Hamburger Button */}
        <button 
          className={styles.hamburger}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle Navigation Menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            {isMobileMenuOpen ? (
              <path d="M18 6L6 18M6 6l12 12" />
            ) : (
              <path d="M3 12h18M3 6h18M3 18h18" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Glassmorphic Dropdown Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            className={styles.mobileMenu}
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <ul className={styles.mobileNavLinks}>
              {navLinks.map(({ name, to }) => (
                <motion.li 
                  key={name}
                  variants={mobileItemVariants}
                  className={`${styles.mobileNavItem} ${location.pathname === to ? styles.mobileActiveLink : ""}`}
                >
                  <Link to={to} className={styles.mobileNavLink}>
                    {name}
                  </Link>
                </motion.li>
              ))}

              <motion.li variants={mobileItemVariants} className={styles.mobileNavItem}>
                <Link to="/cart" className={styles.mobileNavLink}>
                  <div className={styles.mobileCartContainer}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="9" cy="21" r="1"></circle>
                      <circle cx="20" cy="21" r="1"></circle>
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                    <span>Cart</span>
                  </div>
                </Link>
              </motion.li>

              <motion.li variants={mobileItemVariants} className={styles.mobileNavItem}>
                <div className={styles.mobileToggleContainer}>
                  <span className={styles.toggleLabel}>Theme</span>
                  <ThemeToggle />
                </div>
              </motion.li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
