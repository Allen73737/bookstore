import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";
import "./AdminDashboardpage.css";

const BACKEND_URL = "http://localhost:5000";

const AdminLogin = ({ onSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const firstInputRef = useRef(null);

  useEffect(() => {
    firstInputRef.current?.focus();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await axios.post(`${BACKEND_URL}/api/admin/login`, { email, password });
      if (res.data?.success && res.data?.token) {
        localStorage.setItem("adminToken", res.data.token);
        onSuccess();
      } else {
        setError(res.data?.message || "Invalid credentials");
      }
    } catch (err) {
      setError("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div className="login-overlay"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.form className="login-container" onSubmit={handleLogin}
        initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}>
        <h2 className="login-title">Admin Login</h2>
        {error && <div className="error-message">{error}</div>}
        <input
          ref={firstInputRef}
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          autoComplete="username"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          autoComplete="current-password"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </motion.form>
    </motion.div>
  );
};

const AdminDashboard = () => {
  const [books, setBooks] = useState([]);
  const [formState, setFormState] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 800, easing: "ease-out", once: true });
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await axios.get(`${BACKEND_URL}/api/admin/books`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const mappedBooks = (res.data || []).map(b => ({ ...b, id: b._id }));
      setBooks(mappedBooks);
    } catch {
      alert("Failed to fetch books");
    }
  };

  const startAdd = () => {
    setFormErrors({});
    setFormState({ title: "", author: "", price: "", description: "", coverImage: "", category: "" });
  };

  const startEdit = (book) => {
    setFormErrors({});
    setFormState({ ...book });
  };

  const cancelForm = () => setFormState(null);

  const validateForm = () => {
    const errors = {};
    if (!formState.title.trim()) errors.title = "Title is required";
    if (!formState.author.trim()) errors.author = "Author is required";
    if (!formState.price || isNaN(parseFloat(formState.price))) errors.price = "Valid price is required";
    if (!formState.description.trim()) errors.description = "Description is required";
    if (!formState.coverImage.trim()) errors.coverImage = "Cover image URL is required";
    if (!formState.category.trim()) errors.category = "Category is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormChange = (e) => {
    setFormState(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const submitForm = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    const token = localStorage.getItem("adminToken");
    try {
      if (formState.id) {
        // Edit book
        await axios.put(`${BACKEND_URL}/api/admin/books/${formState.id}`, formState, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Book Updated");
      } else {
        // Add book
        await axios.post(`${BACKEND_URL}/api/admin/books`, formState, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Book Added");
      }
      fetchBooks();
      cancelForm();
    } catch (err) {
      alert("Error saving");
      console.error("Save error:", err.response || err);
    } finally {
      setLoading(false);
    }
  };

  const deleteBook = async (id) => {
    if (!window.confirm("Are you sure to delete?")) return;
    const token = localStorage.getItem("adminToken");
    try {
      await axios.delete(`${BACKEND_URL}/api/admin/books/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Deleted");
      fetchBooks();
    } catch (err) {
      alert("Error deleting");
      console.error("Delete error:", err.response || err);
    }
  };

  return (
    <motion.div className="admin-dashboard" data-aos="fade-up"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}>
      <h2 className="dashboard-title">Admin Dashboard - Book Management</h2>
      {!formState && (
        <motion.button
          className="btn primary" onClick={startAdd}
          data-aos="fade-down"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}>
          Add New Book
        </motion.button>
      )}
      {formState && (
        <motion.form
          className="book-form" onSubmit={submitForm}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}>
          <h3>{formState.id ? "Edit Book" : "Add Book"}</h3>
          <label>
            Title
            <input name="title" value={formState.title} onChange={handleFormChange} />
            {formErrors.title && <span className="error">{formErrors.title}</span>}
          </label>
          <label>
            Author
            <input name="author" value={formState.author} onChange={handleFormChange} />
            {formErrors.author && <span className="error">{formErrors.author}</span>}
          </label>
          <label>
            Price
            <input name="price" value={formState.price} onChange={handleFormChange} />
            {formErrors.price && <span className="error">{formErrors.price}</span>}
          </label>
          <label>
            Category
            <input name="category" value={formState.category} onChange={handleFormChange} />
            {formErrors.category && <span className="error">{formErrors.category}</span>}
          </label>
          <label>
            Cover Image URL
            <input name="coverImage" value={formState.coverImage} onChange={handleFormChange} />
            {formErrors.coverImage && <span className="error">{formErrors.coverImage}</span>}
          </label>
          <label>
            Description
            <textarea name="description" value={formState.description} onChange={handleFormChange} />
            {formErrors.description && <span className="error">{formErrors.description}</span>}
          </label>
          <div className="form-actions">
            <motion.button type="submit" className="btn success" disabled={loading}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}>
              {loading ? "Saving..." : "Save"}
            </motion.button>
            <button type="button" onClick={cancelForm} className="btn cancel">
              Cancel
            </button>
          </div>
        </motion.form>
      )}
      <ul className="book-list">
        {books.map((book) => (
          <motion.li key={book.id} className="book-list-item"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}>
            <img src={book.coverImage} alt={book.title} className="book-thumb" />
            <div className="book-info">
              <h4>{book.title}</h4>
              <div>Author: {book.author}</div>
              <div>Category: {book.category}</div>
              <div>Price: {book.price}</div>
              <div>Description: {book.description}</div>
            </div>
            <div className="book-actions">
              <button onClick={() => startEdit(book)} className="btn edit">Edit</button>
              <button onClick={() => deleteBook(book.id)} className="btn delete">Delete</button>
            </div>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
};

const AdminDashboardpage = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <div className="admin-panel-container">
      {!loggedIn && <AdminLogin onSuccess={() => setLoggedIn(true)} />}
      <div className={`admin-dashboard-wrapper ${loggedIn ? "" : "blurred"}`}>
        {loggedIn && <AdminDashboard />}
      </div>
    </div>
  );
};

export default AdminDashboardpage;
