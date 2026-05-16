import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import styles from "./ReservationPage.module.css";

const ReservationPage = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      navigate("/login");
      return;
    }

    // Usually we would fetch reservations from an API, e.g.:
    // fetch("/api/user/reservations", { headers: { Authorization: `Bearer ${token}` }})
    // For now, let's assume we fetch them and set them. If the backend doesn't have 
    // a reservation endpoint yet, we will show the empty state or mock data.
    
    // Simulating API call for demonstration of the premium UI
    setTimeout(() => {
      setReservations([
        // Mock data to demonstrate the UI. Replace with actual fetch when API is ready.
        // { id: 1, bookTitle: "The Great Gatsby", bookAuthor: "F. Scott Fitzgerald", status: "Active", date: "Oct 24, 2026" }
      ]);
      setLoading(false);
    }, 800);
  }, [navigate]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  if (loading) {
    return (
      <div className={styles.pageContainer}>
        <motion.div 
          className={styles.loadingWrapper}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
        >
          Loading your reservations...
        </motion.div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <motion.div 
        className={styles.headerSection}
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h1 className={styles.title}>Your Reservations</h1>
        <p className={styles.subtitle}>
          Track all your reserved and pre-ordered books in one place. We'll notify you as soon as they are ready.
        </p>
      </motion.div>

      {reservations.length === 0 ? (
        <motion.div 
          className={styles.emptyState}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className={styles.emptyIcon}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
            </svg>
          </div>
          <h2 className={styles.emptyTitle}>No Active Reservations</h2>
          <p className={styles.emptyDesc}>
            You haven't reserved any books yet. Discover our collection of upcoming releases and exclusive titles available for pre-order.
          </p>
          <button className={styles.browseBtn} onClick={() => navigate("/books")}>
            Explore Collection
          </button>
        </motion.div>
      ) : (
        <motion.div 
          className={styles.reservationsGrid}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {reservations.map((res) => (
            <motion.div key={res.id} className={styles.reservationCard} variants={itemVariants}>
              <div className={styles.cardHeader}>
                <span className={`${styles.statusBadge} ${res.status === 'Active' ? styles.statusActive : styles.statusPending}`}>
                  {res.status}
                </span>
                <span className={styles.dateInfo}>{res.date}</span>
              </div>
              <h3 className={styles.bookTitle}>{res.bookTitle}</h3>
              <p className={styles.bookAuthor}>by {res.bookAuthor}</p>
              <button className={styles.actionBtn}>
                View Details
              </button>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default ReservationPage;
