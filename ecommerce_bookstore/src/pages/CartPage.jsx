import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import styles from "./CartPage.module.css";
import ReservationDialog from "../components/ReservationDialog";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reservedIds, setReservedIds] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [reservingId, setReservingId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    fetch("/api/user/cart", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const mapped = data
            .filter(item => item && item.bookId) // safe guard in case a book was deleted
            .map(item => ({
              id: item.bookId._id,
              title: item.bookId.title,
              author: item.bookId.author,
              cover: item.bookId.coverImage || item.bookId.cover || "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=500&q=80",
              price: item.bookId.price,
              inStock: item.bookId.inStock || 10,
              qty: item.quantity,
            }));
          setCartItems(mapped);
        } else {
          setCartItems([]);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleQtyChange = (id, newQty) => {
    setCartItems((items) =>
      items.map((item) => (item.id === id ? { ...item, qty: newQty } : item))
    );
    setReservedIds((ids) => ids.filter((rid) => rid !== id));

    const token = localStorage.getItem("jwtToken");
    // Optimistic UI, suppress error if backend is down
    fetch(`/api/user/cart/${id}`, {
      method: "PATCH",
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ qty: newQty }),
    }).catch(() => {});
  };

  const handleRemove = (id) => {
    const item = cartItems.find(i => i.id === id);
    setCartItems((items) => items.filter((item) => item.id !== id));
    setReservedIds((ids) => ids.filter((rid) => rid !== id));
    toast(item ? `"${item.title}" removed from cart` : "Item removed", { icon: "🗑️" });

    const token = localStorage.getItem("jwtToken");
    fetch(`/api/user/cart/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    }).catch(() => {});
  };

  const handleReserve = (id) => {
    if (reservingId) return;
    const book = cartItems.find((item) => item.id === id);
    if (!book) return;

    if (book.qty <= book.inStock) {
      setReservingId(id);
      const token = localStorage.getItem("jwtToken");
      fetch(`/api/user/cart/${id}/reserve`, { 
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((res) => {
          if (!res.ok) throw new Error("Reservation failed");
          setReservedIds((ids) => [...ids, id]);
          setDialogOpen(true);
          toast.success("Book reserved successfully!");
        })
        .catch(() => {
          toast.error("Failed to reserve book. Please try again.");
        })
        .finally(() => setReservingId(null));
    } else {
      alert(`Only ${book.inStock} copies are available for reservation.`);
    }
  };

  return (
    <>
      <motion.div
        className={styles.pageRoot}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className={styles.pageTitle}>Your Cart</h1>
        
        {loading && <p className={styles.emptyMsg}>Loading cart items...</p>}
        
        {!loading && cartItems.length === 0 && (
          <div className={styles.emptyMsg}>
            <p style={{marginBottom: "20px"}}>Your cart is empty.</p>
            <Link to="/books" className="premium-btn-outline">Browse Collection</Link>
          </div>
        )}

        {cartItems.length > 0 && (
          <>
            <div className={styles.cartItemsContainer}>
              <AnimatePresence>
                {cartItems.map((item, idx) => {
                  const isReserving = reservingId === item.id;
                  const isReserved = reservedIds.includes(item.id);

                  return (
                    <motion.div
                      key={item.id}
                      className={styles.cartItemCard}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.5, delay: idx * 0.1 }}
                      layout
                    >
                      <img src={item.cover} alt={item.title} className={styles.bookCover} />
                      <div className={styles.bookInfo}>
                        <h2 className={styles.bookTitle}>{item.title}</h2>
                        <p className={styles.bookAuthor}>by {item.author}</p>
                        
                        <div className={styles.controls}>
                          <label>
                            Qty:
                            <input
                              type="number"
                              min="1"
                              value={item.qty}
                              onChange={(e) => handleQtyChange(item.id, Math.max(1, parseInt(e.target.value) || 1))}
                              className={styles.qtyInput}
                            />
                          </label>
                          <button className={styles.removeBtn} onClick={() => handleRemove(item.id)}>
                            Remove
                          </button>
                        </div>
                        
                        <div className={styles.stockDisplay}>Available: {item.inStock}</div>
                        
                        {item.availableForReservation ? (
                          isReserved ? (
                            <span className={styles.reservedMsg}>
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"></polyline>
                              </svg>
                              Book is reserved!
                            </span>
                          ) : (
                            <button
                              className={styles.reserveBtn}
                              onClick={() => handleReserve(item.id)}
                              disabled={isReserving}
                            >
                              {isReserving ? "Processing..." : "Reserve / Preorder"}
                            </button>
                          )
                        ) : (
                          <span className={styles.unavailableTag}>Unavailable for reservation</span>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
            
            <div className={styles.cartActions}>
              <Link to="/checkout" className={styles.checkoutBtn}>
                Proceed to Checkout
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </Link>
            </div>
          </>
        )}
      </motion.div>

      <ReservationDialog
        isOpen={dialogOpen}
        onRequestClose={() => setDialogOpen(false)}
      />
    </>
  );
};

export default CartPage;
