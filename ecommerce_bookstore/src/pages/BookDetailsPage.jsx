import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import styles from "./BookDetailsPage.module.css";
import ReservationDialog from "../components/ReservationDialog";

const BookDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    // In our new setup, this will hit the proxy
    fetch(`/api/admin/books`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch books");
        return res.json();
      })
      .then((data) => {
        const foundBook = data.find((b) => b._id === id);
        if (foundBook) {
          setBook(foundBook);
        } else {
          setError(true);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(true);
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = () => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      toast.error("Please log in to add to cart.");
      navigate("/login");
      return;
    }
    fetch(`/api/user/cart/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ qty: 1 })
    })
      .then(res => {
        if(res.ok) {
          toast.success(`"${book?.title}" added to cart!`);
        } else {
          toast.error("Failed to add to cart.");
        }
      })
      .catch(() => toast.error("Connection error."));
  };

  const handleReserve = () => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      toast.error("Please log in to reserve.");
      navigate("/login");
      return;
    }
    fetch(`/api/user/cart/${id}/reserve`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        if (res.ok) {
          setDialogOpen(true);
          toast.success("Book reserved!");
        } else {
          toast.error("Reservation failed or book out of stock.");
        }
      })
      .catch(() => toast.error("Connection error."));
  };

  if (loading) {
    return (
      <div className={styles.pageContainer}>
        <motion.div 
          className={styles.loading}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          Loading Masterpiece...
        </motion.div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.error}>
          <h2>We couldn't find this book.</h2>
          <button className={styles.primaryBtn} onClick={() => navigate("/books")} style={{marginTop: "20px"}}>
            Browse Collection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <motion.div 
        className={styles.contentWrapper}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.div 
          className={styles.imageSection}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <img src={book.coverImage} alt={book.title} className={styles.bookCover} />
        </motion.div>

        <motion.div 
          className={styles.detailsSection}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className={styles.badgeContainer}>
            <span className={styles.badge}>{book.category}</span>
            {book.inStock > 0 && <span className={styles.badge} style={{background: '#a4ceb3', color: '#054a51'}}>In Stock</span>}
          </div>
          
          <h1 className={styles.title}>{book.title}</h1>
          <h2 className={styles.author}>by {book.author}</h2>
          
          <div className={styles.price}>
            ₹{book.price}
          </div>
          
          <p className={styles.description}>
            {book.description || "Immerse yourself in this captivating story that will take you on an unforgettable journey. Experience the rich world-building and complex characters that have made this book a must-read for enthusiasts everywhere."}
          </p>

          <div className={styles.actionButtons}>
            <motion.button 
              className={styles.primaryBtn}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddToCart}
            >
              Add to Cart
            </motion.button>
            <motion.button 
              className={styles.secondaryBtn}
              whileTap={{ scale: 0.95 }}
              onClick={handleReserve}
              title="Reserve this book"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                <polyline points="17 21 17 13 7 13 7 21"></polyline>
                <polyline points="7 3 7 8 15 8"></polyline>
              </svg>
            </motion.button>
          </div>
        </motion.div>
      </motion.div>

      <ReservationDialog 
        isOpen={dialogOpen} 
        onRequestClose={() => setDialogOpen(false)} 
      />
    </div>
  );
};

export default BookDetailsPage;
