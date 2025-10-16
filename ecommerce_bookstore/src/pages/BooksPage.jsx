import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import styles from "./BooksPage.module.css";

const BookCard = ({
  book,
  isExpanded,
  onExpand,
  toggleFavorite,
  isFavorited,
  closeExpanded,
  addToCart,
  reserveBook
}) => {
  const [ref, inView] = useInView({ threshold: 0.12, triggerOnce: true });

  return (
    <motion.div
      ref={ref}
      className={styles.bookCard}
      initial={{ opacity: 0, scale: 0.9, y: 32 }}
      animate={inView ? { opacity: 1, scale: 1.02, y: 0 } : {}}
      exit={{ opacity: 0, scale: 0.75, y: 32 }}
      whileHover={{ scale: 1.05 }}
      onClick={() => onExpand(book.id)}
      tabIndex={0}
    >
      <img src={book.cover} alt={book.title} className={styles.coverImg} />
      <h2 className={styles.title}>{book.title}</h2>
      <p className={styles.author}>{book.author}</p>
      <button
        className={`${styles.heartBtn} ${isFavorited ? styles.favorited : ""}`}
        onClick={e => { e.stopPropagation(); toggleFavorite(book, e); }}
        title="Add to Favorites"
      >
        {isFavorited ? "♥" : "♡"}
      </button>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className={styles.detailsDropdown}
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ type: "spring", duration: 0.75 }}
            onClick={e => e.stopPropagation()}
          >
            <h3>{book.title}</h3>
            <p style={{ color: "#14532d" }}><b>By:</b> {book.author}</p>
<p style={{ color: "#14532d" }}><b>Category:</b> {book.category}</p>
<p style={{ color: "#14532d" }}><b>Price:</b> ₹{book.price}</p>

            {/* <p><b>By:</b> {book.author}</p>
            {book.category && <p><b>Category:</b> {book.category}</p>}
            {typeof book.price !== "undefined" && (
              <p><b>Price:</b> ₹{book.price}</p>
            )}
            {book.genre && <p><b>Genre:</b> {book.genre}</p>} */}
            {book.published && <p><b>Published:</b> {book.published}</p>}
            <p className={styles.bookOverview}>{book.description}</p>
            <div className={styles.dropdownActions}>
              <button
                className={styles.buyBtn}
                onClick={() => addToCart && addToCart(book)}
              >Add to Cart</button>
              <button
                className={styles.reserveBtn}
                onClick={() => reserveBook && reserveBook(book)}
              >Reserve Now</button>
              <button
                className={styles.closeBtn}
                onClick={closeExpanded}
              >Close</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const BooksPage = ({ updateFavorites, updateRecentlyWatched, addToCart, reserveBook }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [welcomeRef, welcomeInView] = useInView({ threshold: 0.1, triggerOnce: true });

  useEffect(() => {
    fetch("http://localhost:5000/api/admin/books")
      .then(res => res.json())
      .then(data => {
        const formattedBooks = data.map(book => ({
          ...book,
          id: book._id,
          cover: book.coverImage
        }));
        setBooks(formattedBooks);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const searchedBooks = search
    ? books.filter(
        (b) =>
          b.title.toLowerCase().includes(search.toLowerCase()) ||
          b.author.toLowerCase().includes(search.toLowerCase())
      )
    : books;

  const expandBook = id => {
    setExpandedId(id);
    const clickedBook = books.find(b => b.id === id);
    if (updateRecentlyWatched) updateRecentlyWatched(clickedBook);
  };

  const closeExpanded = () => setExpandedId(null);

  const toggleFavorite = (book, e) => {
    e.stopPropagation();
    setFavoriteIds(prev =>
      prev.includes(book.id) ? prev.filter(id => id !== book.id) : [...prev, book.id]
    );
    if (updateFavorites) updateFavorites(book);
  };

  return (
    <motion.div
      className={styles.pageRoot}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2 }}
    >
      <motion.header
        ref={welcomeRef}
        className={styles.header}
        initial={{ opacity: 0, y: -20 }}
        animate={welcomeInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.85 }}
      >
        <motion.h1
          className={styles.welcomeTitle}
          initial={{ scale: 0.95, y: -18 }}
          animate={welcomeInView ? { scale: 1.06, y: 0 } : {}}
          transition={{ duration: 1.2, type: "spring", bounce: 0.4, delay: 0.1 }}
        >
          Welcome to the World of Books!
        </motion.h1>
        <motion.p
          className={styles.overview}
          initial={{ opacity: 0, y: 10 }}
          animate={welcomeInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.1, delay: 0.25 }}
        >
          Discover, explore, and buy your favorite reads.<br />
          Every book is a new journey—find your next adventure at ReadHaven.
        </motion.p>
        <motion.form
          className={styles.searchBar}
          initial={{ opacity: 0, y: 10 }}
          animate={welcomeInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85, delay: 0.45 }}
          onSubmit={e => e.preventDefault()}
        >
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search by title or author..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <motion.button
            className={styles.searchBtn}
            type="submit"
            whileHover={{ scale: 1.07, background: "#bce1b5", color: "#054a51" }}
            whileTap={{ scale: 1.13 }}
            transition={{ type: "spring", stiffness: 250, damping: 16 }}
          >
            🔍
          </motion.button>
        </motion.form>
      </motion.header>
      <div className={styles.booksGrid}>
        <AnimatePresence>
          {loading ? (
            <motion.p
              key="loading"
              className={styles.loadingMsg}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7 }}
            >
              Loading books...
            </motion.p>
          ) : (
            searchedBooks.map(book => (
              <BookCard
                key={book.id}
                book={book}
                isExpanded={expandedId === book.id}
                onExpand={expandBook}
                toggleFavorite={toggleFavorite}
                isFavorited={favoriteIds.includes(book.id)}
                closeExpanded={closeExpanded}
                addToCart={addToCart}
                reserveBook={reserveBook}
              />
            ))
          )}
        </AnimatePresence>
      </div>
      <AnimatePresence>
        {expandedId && (
          <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.55 }}
            exit={{ opacity: 0 }}
            onClick={closeExpanded}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default BooksPage;
