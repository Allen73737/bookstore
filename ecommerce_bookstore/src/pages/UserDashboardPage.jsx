import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import "./UserDashboard.css";

const UserDashboard = ({ setUser }) => {
  const [cartItems, setCartItems] = useState([]);
  const [favoriteBooks, setFavoriteBooks] = useState([]);
  const [recentBooks, setRecentBooks] = useState([]);
  const [userName, setUserName] = useState("User");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const token = localStorage.getItem("jwtToken");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchDashboardData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const [profileRes, cartRes, favRes, recentRes] = await Promise.all([
          fetch("/api/user/profile", { headers }),
          fetch("/api/cart", { headers }),
          fetch("/api/favorites", { headers }),
          fetch("/api/recent-books", { headers }),
        ]);

        if (profileRes.ok) {
          const profile = await profileRes.json();
          setUserName(profile.name || "User");
        }
        if (cartRes.ok) {
          const cart = await cartRes.json();
          setCartItems(Array.isArray(cart) ? cart : []);
        }
        if (favRes.ok) {
          const favs = await favRes.json();
          setFavoriteBooks(Array.isArray(favs) ? favs : []);
        }
        if (recentRes.ok) {
          const recents = await recentRes.json();
          setRecentBooks(Array.isArray(recents) ? recents : []);
        }
      } catch (err) {
        console.error("Dashboard fetch error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [token, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    if (setUser) setUser(null);
    toast.success("Logged out successfully.");
    navigate("/");
  };

  const renderBookCards = (books) =>
    books.map((book) => (
      <motion.div
        key={book._id || book.id}
        className="dashboardBookCard"
        whileHover={{ scale: 1.05 }}
        onClick={() => navigate(`/book/${book._id || book.id}`)}
      >
        <img src={book.coverImage || book.cover} alt={book.title} className="dashboardBookImg" />
        <h4 className="dashboardBookTitle">{book.title}</h4>
        <p className="dashboardBookAuthor">{book.author}</p>
      </motion.div>
    ));

  if (loading) {
    return (
      <div className="dashboardContainer" style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <h2 style={{color: 'var(--color-primary)', fontFamily: 'var(--font-heading)'}}>Loading Dashboard...</h2>
      </div>
    );
  }

  return (
    <div className="dashboardContainer">
      <motion.div 
        className="dashboardHeader"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="welcomeText">Welcome, {userName}.</h2>
        <button className="logoutBtn" onClick={handleLogout}>Logout</button>
      </motion.div>

      <motion.section 
        className="dashboardSection"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="sectionHeader">
          <h3 className="sectionTitle">
            <svg className="sectionIcon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            Your Cart ({cartItems.length})
          </h3>
          {cartItems.length > 0 && <Link to="/cart" className="premium-btn">Checkout</Link>}
        </div>
        
        {cartItems.length === 0 ? (
          <div className="emptyState">
            <p>Your cart is empty.</p>
            <Link to="/books" className="premium-btn-outline">Browse Collection</Link>
          </div>
        ) : (
          <div className="booksGrid">{renderBookCards(cartItems)}</div>
        )}
      </motion.section>

      <motion.section 
        className="dashboardSection"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <div className="sectionHeader">
          <h3 className="sectionTitle">
            <svg className="sectionIcon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            Favorites ({favoriteBooks.length})
          </h3>
        </div>
        
        {favoriteBooks.length === 0 ? (
          <div className="emptyState">
            <p>You haven't saved any favorites yet.</p>
            <Link to="/books" className="premium-btn-outline">Discover Books</Link>
          </div>
        ) : (
          <div className="booksGrid">{renderBookCards(favoriteBooks)}</div>
        )}
      </motion.section>

      <motion.section 
        className="dashboardSection"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <div className="sectionHeader">
          <h3 className="sectionTitle">
            <svg className="sectionIcon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            Recently Viewed
          </h3>
        </div>
        
        {recentBooks.length === 0 ? (
          <div className="emptyState">
            <p>You haven't viewed any books recently.</p>
            <Link to="/books" className="premium-btn-outline">Start Browsing</Link>
          </div>
        ) : (
          <div className="booksGrid">{renderBookCards(recentBooks)}</div>
        )}
      </motion.section>
    </div>
  );
};

export default UserDashboard;
