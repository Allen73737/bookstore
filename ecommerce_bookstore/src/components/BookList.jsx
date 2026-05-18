import React from "react";
import BookCard from "./BookCard";
import styles from "./BookList.module.css";

const BookList = ({ books }) => {
  return (
    <div className={styles.grid}>
      {books.map((book) => (
        <BookCard key={book._id} book={book} />
      ))}
    </div>
  );
};

export default BookList;
