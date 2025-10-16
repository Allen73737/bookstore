import React from "react";
import { motion } from "framer-motion";
import styles from "./Footer.module.css";

const socialLinks = [
  { name: "Twitter", url: "https://twitter.com", icon: "🐦" },
  { name: "Facebook", url: "https://facebook.com", icon: "📘" },
  { name: "Instagram", url: "https://instagram.com", icon: "📸" },
];

const Footer = () => {
  return (
    <motion.footer
      className={styles.footerRoot}
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 80, opacity: 0 }}
      transition={{ duration: 1, type: "spring", bounce: 0.25 }}
      whileHover={{ scale: 1.02, boxShadow: "0 20px 54px #a6a26bbb" }}
      whileTap={{ scale: 1.06 }}
    >
      <div className={styles.contentContainer}>
        <div className={styles.aboutSection}>
          <h3 className={styles.aboutTitle}>ReadHaven</h3>
          <p className={styles.aboutDesc}>
            A sanctuary for book lovers — discover, read, and connect with stories that inspire.
          </p>
          <p className={styles.copyRight}>&copy; 2025 ReadHaven. All rights reserved.</p>
        </div>
        <ul className={styles.socialLinks}>
          {socialLinks.map(({ name, url, icon }) => (
            <motion.li
              key={name}
              className={styles.socialIcon}
              whileHover={{ scale: 1.35, color: "#d7bf68", textShadow: "0 0 16px #f7e68a" }}
              whileTap={{ scale: 1.2 }}
            >
              <a href={url} target="_blank" rel="noopener noreferrer" aria-label={name}>
                {icon}
              </a>
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.footer>
  );
};

export default Footer;
