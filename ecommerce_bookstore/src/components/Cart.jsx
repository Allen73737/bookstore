import React, { useState } from "react";
import ReservationDialog from "../Modal/ReservationDialog";
import axios from "axios";

const CartItem = ({ book, token }) => {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [reserving, setReserving] = useState(false);

  const handleReserveClick = async () => {
    if (reserving) return;
    setReserving(true);
    try {
      // Replace with your backend API URL and reservation logic
      await axios.post(
        `/api/cart/${book._id}/reserve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setDialogOpen(true);
    } catch (err) {
      alert("Failed to reserve the book. Please try again.");
    } finally {
      setReserving(false);
    }
  };

  return (
    <>
      <div className="cart-item">
        <h4>{book.title}</h4>
        <button disabled={reserving} onClick={handleReserveClick} className="reserve-btn">
          {reserving ? "Reserving..." : "Reserve / Preorder"}
        </button>
      </div>

      <ReservationDialog
        isOpen={isDialogOpen}
        onRequestClose={() => setDialogOpen(false)}
      />
    </>
  );
};

export default CartItem;
