import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, useViewportScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import axios from "axios";
import "./UserDashboard.css";

const AnimatedWelcome = ({ userName }) => {
  const welcomeText = `Welcome to ReadHaven, ${userName}!`;
  const [displayText, setDisplayText] = useState("");
  const [zoomInComplete, setZoomInComplete] = useState(false);

  useEffect(() => {
    let index = 0;
    const typingInterval = setInterval(() => {
      setDisplayText(welcomeText.slice(0, index + 1));
      index++;
      if (index === welcomeText.length) clearInterval(typingInterval);
    }, 80);

    const zoomTimeout = setTimeout(() => {
      setZoomInComplete(true);
    }, 2000);

    return () => {
      clearInterval(typingInterval);
      clearTimeout(zoomTimeout);
    };
  }, [welcomeText]);

  return (
    <AnimatePresence>
      <motion.h2
        key="welcome-text"
        className="text-gradient splash-font"
        style={{ whiteSpace: "nowrap", overflow: "hidden", marginBottom: "2.5rem" }}
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: zoomInComplete ? 1 : 1.2 }}
        transition={{ duration: 2, ease: "easeOut" }}
      >
        {displayText}
        <motion.span
          animate={{ opacity: zoomInComplete ? [0, 1, 0] : 0 }}
          transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
          style={{ display: "inline-block" }}
        >
          |
        </motion.span>
      </motion.h2>
    </AnimatePresence>
  );
};

const containerVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
  hover: {
    scale: 1.05,
    boxShadow: "0 8px 15px rgba(0,0,0,0.2)",
    transition: { duration: 0.3 },
  },
};

const bookCardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" },
  }),
  hover: {
    scale: 1.07,
    boxShadow: "0 12px 25px rgba(0,0,0,0.2)",
  },
};

const UserDashboard = ({ setUser }) => {
  const [cartItems, setCartItems] = useState([]);
  const [favoriteBooks, setFavoriteBooks] = useState([]);
  const [recentBooks, setRecentBooks] = useState([]);
  const [userName, setUserName] = useState("User");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const token = localStorage.getItem("jwtToken");

  const { scrollY } = useViewportScroll();
  const logoutOpacity = useTransform(scrollY, [0, 100], [0, 1]);
  const logoutScale = useTransform(scrollY, [0, 100], [0.7, 1]);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    AOS.init({ duration: 900, easing: "ease-out-cubic", once: true });

    const axiosInstance = axios.create({
      headers: { Authorization: `Bearer ${token}` },
    });

    Promise.all([
      axiosInstance.get("/api/user/profile"),
      axiosInstance.get("/api/cart"),
      axiosInstance.get("/api/favorites"),
      axiosInstance.get("/api/recent-books"),
    ])
      .then(([profileRes, cartRes, favRes, recentRes]) => {
        setUserName(profileRes.data.name || "User");
        setCartItems(Array.isArray(cartRes.data) ? cartRes.data : []);
        setFavoriteBooks(Array.isArray(favRes.data) ? favRes.data : []);
        setRecentBooks(Array.isArray(recentRes.data) ? recentRes.data : []);
      })
      .catch(() => {
        setUser(null);
        navigate("/login");
      })
      .finally(() => setLoading(false));
  }, [token, navigate, setUser]);

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    setUser(null);
    navigate("/");
  };

  const axiosInstance = axios.create({
    headers: { Authorization: token ? `Bearer ${token}` : "" },
  });

  const addToFavorites = (bookId) => {
    axiosInstance
      .post(`/api/favorites/${bookId}`)
      .then((res) => {
        setFavoriteBooks(res.data);
      })
      .catch(console.error);
  };

  const addToRecent = (bookId) => {
    axiosInstance
      .post(`/api/recent-books/${bookId}`)
      .then((res) => {
        setRecentBooks(res.data);
      })
      .catch(console.error);
  };

  const handleBookClick = (book) => {
    addToRecent(book._id);
    navigate(`/book/${book._id}`);
  };

  const renderBookCards = (books) =>
    books.map((book, index) => {
      const isFavorite = favoriteBooks.some((fb) => fb._id === book._id);

      return (
        <motion.div
          key={book._id}
          className="book-card p-4 rounded-lg cursor-pointer relative"
          variants={bookCardVariants}
          initial="hidden"
          animate="visible"
          custom={index}
          whileHover="hover"
          data-aos="fade-up"
        >
          <img
            src={book.coverImage}
            alt={book.title}
            className="book-image"
            onClick={() => handleBookClick(book)}
          />
          <button
            onClick={() => addToFavorites(book._id)}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            className={`favorite-button ${isFavorite ? "fav-active" : ""}`}
          >
            ❤
          </button>
          <h4 className="book-title">{book.title}</h4>
          <p className="book-author">{book.author}</p>
        </motion.div>
      );
    });

  if (loading) return <div>Loading...</div>;

  return (
    <div className="dashboard-container px-4 py-8 max-w-7xl mx-auto">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "1.5rem",
          flexWrap: "wrap",
        }}
      >
        <AnimatedWelcome userName={userName} />
        <motion.button
          className="logout-button"
          onClick={handleLogout}
          style={{ opacity: logoutOpacity, scale: logoutScale }}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 300, damping: 22 }}
          whileHover={{ scale: 1.1, boxShadow: "0 8px 16px rgba(0,0,0,0.3)" }}
        >
          Logout
        </motion.button>
      </div>

      <motion.section
        className="cart-section mb-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        data-aos="fade-right"
      >
        <h3 className="text-2xl font-semibold mb-6 border-b border-green-500 pb-3">
          Your Cart ({cartItems.length})
        </h3>
        {!Array.isArray(cartItems) || cartItems.length === 0 ? (
          <>
            <p className="text-gray-500 mb-4">Your cart is empty.</p>
            <div className="button-group">
  <button className="action-btn" onClick={() => navigate("/books")}>Browse Books</button>
  <button className="action-btn go-to-cart-btn" onClick={() => navigate("/cart")}>Go to Cart</button>
</div>

          </>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-4">{renderBookCards(cartItems)}</div>
            <button onClick={() => navigate("/cart")} className="go-to-cart-btn" type="button">
              Go to Cart
            </button>
           
  <button className="action-btn" onClick={() => navigate("/books")}>Browse Books</button>
          </>
        )}
      </motion.section>

      <motion.section
        className="favorites-section mb-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        data-aos="fade-left"
      >
        <h3 className="text-2xl font-semibold mb-6 border-b border-blue-500 pb-3">
          Favorite Books ({favoriteBooks.length})
        </h3>
        {!Array.isArray(favoriteBooks) || favoriteBooks.length === 0 ? (
          <>
            <p className="text-gray-500">You have no favorite books saved.</p>
           
  <button className="action-btn" onClick={() => navigate("/books")}>Browse Books</button>
          </>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-4">{renderBookCards(favoriteBooks)}</div>
            
    <button className="action-btn" onClick={() => navigate("/books")}>Browse Books</button>
          </>
        )}
      </motion.section>

      <motion.section
        className="recent-section"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        data-aos="fade-up"
      >
        <h3 className="text-2xl font-semibold mb-6 border-b border-purple-600 pb-3">
          Recently Visited Books ({recentBooks.length})
        </h3>
        {!Array.isArray(recentBooks) || recentBooks.length === 0 ? (
          <>
            <p className="text-gray-500">You haven't visited any books recently.</p>
           
  <button className="action-btn" onClick={() => navigate("/books")}>Browse Books</button>
          </>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-4">{renderBookCards(recentBooks)}</div>
            <button onClick={() => navigate("/books")} className="browse-books-btn">
              Browse Books
            </button>
          </>
        )}
      </motion.section>
    </div>
  );
};

export default UserDashboard;
