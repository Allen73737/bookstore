import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import styles from "./CartPage.module.css";

import axios from "axios";

const pageVariants = {
  initial: { opacity: 0 },
  in: { opacity: 1 },
  out: { opacity: 0 },
};

const cardVariants = {
  hidden: { opacity: 0, y: 60, scale: 0.96 },
  visible: { opacity: 1, y: 0, scale: 1 },
};

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reservedIds, setReservedIds] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [reservingId, setReservingId] = useState(null);

  const API_BASE = "/api/user";

  useEffect(() => {
    fetch(`${API_BASE}/cart`)
      .then((res) => res.json())
      .then((data) => {
        setCartItems(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleQtyChange = (id, newQty) => {
    setCartItems((items) =>
      items.map((item) => (item.id === id ? { ...item, qty: newQty } : item))
    );
    setReservedIds((ids) => ids.filter((rid) => rid !== id));

    fetch(`${API_BASE}/cart/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ qty: newQty }),
    }).catch(console.error);
  };

  const handleRemove = (id) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
    setReservedIds((ids) => ids.filter((rid) => rid !== id));

    fetch(`${API_BASE}/cart/${id}`, {
      method: "DELETE",
    }).catch(console.error);
  };

  // Enhanced Reserve Button handler with dialog and button disable
  const handleReserve = (id) => {
    if (reservingId) return; // Prevent multiple clicks
    const book = cartItems.find((item) => item.id === id);
    if (!book) return;

    if (book.qty <= book.inStock) {
      setReservingId(id);
      fetch(`${API_BASE}/cart/${id}/reserve`, {
        method: "POST",
      })
        .then((res) => {
          if (!res.ok) throw new Error("Reservation failed");
          setReservedIds((ids) => [...ids, id]);
          setDialogOpen(true);
        })
        .catch(() => alert("Failed to reserve book, please try again."))
        .finally(() => setReservingId(null));
    } else {
      alert(`Only ${book.inStock} copies are available for reservation.`);
    }
  };

  return (
    <>
      <motion.div
        className={styles.pageRoot}
        variants={pageVariants}
        initial="initial"
        animate="in"
        exit="out"
        transition={{ duration: 1 }}
      >
        <h1 className={styles.pageTitle}>Your Cart</h1>
        {loading && <p className={styles.emptyMsg}>Loading...</p>}
        {!loading && cartItems.length === 0 && (
          <p className={styles.emptyMsg}>Your cart is empty.</p>
        )}

        <div className={styles.cartItemsContainer}>
          {cartItems.map(
            (
              { id, title, author, cover, qty, availableForReservation, inStock },
              idx
            ) => {
              const [ref, inView] = useInView({ threshold: 0.18, triggerOnce: true });
              const isReserving = reservingId === id;
              const isReserved = reservedIds.includes(id);

              return (
                <motion.div
                  ref={ref}
                  key={id}
                  className={styles.cartItemCard}
                  variants={cardVariants}
                  initial="hidden"
                  animate={inView ? "visible" : "hidden"}
                  transition={{ duration: 0.6 + idx * 0.08, type: "spring" }}
                  whileHover={{ scale: 1.05, boxShadow: "0 18px 46px rgba(31,144,200,.2)" }}
                >
                  <img src={cover} alt={title} className={styles.bookCover} />
                  <div className={styles.bookInfo}>
                    <h2 className={styles.bookTitle}>{title}</h2>
                    <p className={styles.bookAuthor}>by {author}</p>
                    <div className={styles.controls}>
                      <label>
                        Quantity:
                        <input
                          type="number"
                          min="1"
                          value={qty}
                          onChange={(e) =>
                            handleQtyChange(id, Math.max(1, parseInt(e.target.value) || 1))
                          }
                          className={styles.qtyInput}
                        />
                      </label>
                      <button
                        className={styles.removeBtn}
                        onClick={() => handleRemove(id)}
                      >
                        Remove
                      </button>
                    </div>
                    <div className={styles.stockDisplay}>Available: {inStock}</div>
                    {availableForReservation ? (
                      isReserved ? (
                        <span className={styles.reservedMsg}>Book is reserved!</span>
                      ) : (
                        <button
                          className={styles.reserveBtn}
                          onClick={() => handleReserve(id)}
                          disabled={isReserving}
                        >
                          {isReserving ? "Reserving..." : "Reserve / Preorder"}
                        </button>
                      )
                    ) : (
                      <span className={styles.unavailableTag}>Unavailable for reservation</span>
                    )}
                  </div>
                </motion.div>
              );
            }
          )}
        </div>
      </motion.div>

      <ReservationDialog
        isOpen={dialogOpen}
        onRequestClose={() => setDialogOpen(false)}
      />
    </>
  );
};

export default CartPage;
