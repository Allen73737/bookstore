import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import styles from "./CheckoutPage.module.css";

const CheckoutPage = () => {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // In a real app, calculate total from cart items fetched from API
    setTotal(499); // Mock total
  }, []);

  const handleCheckout = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate payment processing
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      toast.success("Payment processed successfully!");
      
      // Redirect after success
      setTimeout(() => {
        navigate("/user-dashboard");
      }, 3000);
    }, 2000);
  };

  return (
    <div className={styles.checkoutRoot}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className={styles.checkoutTitle}>Secure Checkout</h1>
      </motion.div>

      <div className={styles.checkoutContainer}>
        <motion.div 
          className={styles.checkoutSection}
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2 className={styles.sectionHeader}>Billing Details</h2>
          <form id="checkout-form" onSubmit={handleCheckout} style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%' }}>
            <div className={styles.formGroup}>
              <label>Full Name</label>
              <input type="text" className="premium-input" placeholder="Enter your full name" required />
            </div>
            <div className={styles.formGroup}>
              <label>Email Address</label>
              <input type="email" className="premium-input" placeholder="Enter your email" required />
            </div>
            <div className={styles.formGroup}>
              <label>Shipping Address</label>
              <textarea className="premium-input" placeholder="Enter full address" required style={{ minHeight: '80px', resize: 'vertical' }}></textarea>
            </div>

            <h2 className={styles.sectionHeader} style={{ marginTop: '20px' }}>Payment Method</h2>
            <div className={styles.paymentMethods}>
              <label className={`${styles.paymentOption} ${paymentMethod === 'card' ? styles.selected : ''}`}>
                <input 
                  type="radio" 
                  name="payment" 
                  value="card" 
                  checked={paymentMethod === 'card'} 
                  onChange={() => setPaymentMethod('card')} 
                />
                Credit / Debit Card
              </label>
              <label className={`${styles.paymentOption} ${paymentMethod === 'upi' ? styles.selected : ''}`}>
                <input 
                  type="radio" 
                  name="payment" 
                  value="upi" 
                  checked={paymentMethod === 'upi'} 
                  onChange={() => setPaymentMethod('upi')} 
                />
                UPI (GPay, PhonePe)
              </label>
            </div>
          </form>
        </motion.div>

        <motion.div 
          className={styles.checkoutSection}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <h2 className={styles.sectionHeader}>Order Summary</h2>
          
          <div style={{ flex: 1 }}>
             {/* In a real app, map over cart items here */}
             <div className={styles.orderSummaryItem}>
                <span>Items Total</span>
                <span>₹{total}</span>
             </div>
             <div className={styles.orderSummaryItem}>
                <span>Shipping</span>
                <span>Free</span>
             </div>
             <div className={styles.orderSummaryItem}>
                <span>Taxes</span>
                <span>₹0</span>
             </div>
          </div>

          <div className={styles.orderTotal}>
            <span>Total</span>
            <span>₹{total}</span>
          </div>

          <button 
            type="submit" 
            form="checkout-form" 
            className={`premium-btn ${styles.confirmBtn}`}
            disabled={loading}
          >
            {loading ? "Processing..." : `Pay ₹${total}`}
          </button>
        </motion.div>
      </div>

      <AnimatePresence>
        {success && (
          <motion.div 
            className={styles.successOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className={styles.successCard}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring" }}
            >
              <div className={styles.successIcon}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <h2 className={styles.successTitle}>Payment Successful!</h2>
              <p style={{ color: 'var(--color-text-muted)' }}>Thank you for your purchase. Redirecting to your dashboard...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CheckoutPage;
