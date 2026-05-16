import React from 'react';
import Modal from 'react-modal';
import { motion, AnimatePresence } from 'framer-motion';

const customStyles = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    position: 'relative',
    top: 'auto',
    left: 'auto',
    right: 'auto',
    bottom: 'auto',
    border: 'none',
    background: 'transparent',
    padding: 0,
    overflow: 'visible',
    maxWidth: '500px',
    width: '90%',
  },
};

const ReservationDialog = ({ isOpen, onRequestClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customStyles}
      ariaHideApp={false}
      closeTimeoutMS={300}
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            style={{
              background: 'linear-gradient(145deg, #1f1f1f, #2c2c2c)',
              borderRadius: '24px',
              padding: '40px',
              color: '#ffffff',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              textAlign: 'center',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              style={{
                width: '80px',
                height: '80px',
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
              }}
            >
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </motion.div>
            
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '16px', fontFamily: 'Inter, sans-serif' }}>
              Reservation Confirmed!
            </h2>
            
            <p style={{ color: '#a0a0a0', fontSize: '16px', lineHeight: '1.6', marginBottom: '32px', fontFamily: 'Inter, sans-serif' }}>
              Your book has been successfully reserved. We will notify you when it's ready for pickup or delivery.
            </p>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onRequestClose}
              style={{
                background: 'linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)',
                border: 'none',
                borderRadius: '12px',
                padding: '14px 32px',
                color: '#fff',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                width: '100%',
                boxShadow: '0 10px 20px rgba(0, 242, 254, 0.3)',
                fontFamily: 'Inter, sans-serif'
              }}
            >
              Awesome, thanks!
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </Modal>
  );
};

export default ReservationDialog;
