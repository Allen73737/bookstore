import React from "react";
import BookCard from "./BookCard";

const BookList = ({ books }) => {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
      {books.map((book) => (
        <BookCard key={book._id} book={book} />
      ))}
    </div>
  );
};

export default BookList;
