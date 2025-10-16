import React from "react";
import { Link } from "react-router-dom";
import styles from "./BookCard.module.css";

const BookCard = ({ book }) => (
  <div className={styles.card}>
    <img src={book.imageUrl} alt={book.title} className={styles.image} />
    <h4 className={styles.title}>{book.title}</h4>
    <p className={styles.author}>by {book.author}</p>
    <p className={styles.price}>${book.price}</p>
    <Link to={`/book/${book._id}`} className={styles.detailsLink}>Details</Link>
  </div>
);

export default BookCard;
