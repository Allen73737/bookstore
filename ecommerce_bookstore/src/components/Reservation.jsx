import React from "react";

const Reservation = ({ reservations }) => {
  if (!reservations || reservations.length === 0)
    return <p>No reservations found</p>;

  return (
    <div>
      <h3>Your Reservations</h3>
      {reservations.map((res) => (
        <div key={res._id}>
          <p>
            Book: {res.bookTitle}, Status: {res.status}
          </p>
        </div>
      ))}
    </div>
  );
};

export default Reservation;
