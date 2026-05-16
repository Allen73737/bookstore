import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
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
  const navigate = useNavigate();

  return (
    <motion.div
      ref={ref}
      className={styles.bookCard}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      exit={{ opacity: 0, y: 40 }}
      transition={{ duration: 0.6, type: "spring" }}
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
        <svg width="20" height="20" viewBox="0 0 24 24" fill={isFavorited ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        </svg>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className={styles.detailsDropdown}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", duration: 0.5 }}
            onClick={e => e.stopPropagation()}
          >
            <h3 style={{color: "var(--color-primary)", fontFamily: "var(--font-heading)"}}>{book.title}</h3>
            <p><b>By:</b> <span style={{color: "var(--color-secondary)"}}>{book.author}</span></p>
            <p><b>Category:</b> {book.category}</p>
            <p><b>Price:</b> ₹{book.price}</p>
            
            <p className={styles.bookOverview}>{book.description}</p>
            
            <div className={styles.dropdownActions}>
              <button
                className={styles.buyBtn}
                onClick={() => navigate(`/book/${book.id}`)}
              >
                View Full Details
              </button>
              <button
                className={styles.closeBtn}
                onClick={closeExpanded}
              >
                Close
              </button>
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
    fetch("/api/admin/books")
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
    const wasFavorited = favoriteIds.includes(book.id);
    setFavoriteIds(prev =>
      wasFavorited ? prev.filter(id => id !== book.id) : [...prev, book.id]
    );
    if (updateFavorites) updateFavorites(book);
    if (wasFavorited) {
      toast("Removed from favorites", { icon: "💔" });
    } else {
      toast.success(`"${book.title}" added to favorites!`);
    }
  };

  return (
    <motion.div
      className={styles.pageRoot}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <motion.header
        ref={welcomeRef}
        className={styles.header}
        initial={{ opacity: 0, y: -20 }}
        animate={welcomeInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        <motion.h1
          className={styles.welcomeTitle}
          initial={{ scale: 0.95 }}
          animate={welcomeInView ? { scale: 1 } : {}}
          transition={{ duration: 1, type: "spring" }}
        >
          The Curated Collection
        </motion.h1>
        <motion.p
          className={styles.overview}
          initial={{ opacity: 0 }}
          animate={welcomeInView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.2 }}
        >
          Discover our hand-picked selection of literary masterpieces, spanning across timeless classics to modern bestsellers.
        </motion.p>
        <motion.div
          className={styles.searchBar}
          initial={{ opacity: 0, y: 20 }}
          animate={welcomeInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search by title or author..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button className={styles.searchBtn}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
        </motion.div>
      </motion.header>

      <div className={styles.booksGrid}>
        <AnimatePresence>
          {loading ? (
            <motion.p
              key="loading"
              className={styles.loadingMsg}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
            >
              Curating books...
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
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeExpanded}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default BooksPage;
