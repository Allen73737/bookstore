import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import "./AdminDashboardpage.css";

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
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem("adminToken", data.token);
        toast.success("Admin access granted.");
        onSuccess();
      } else {
        setError(data.message || "Invalid credentials");
        toast.error(data.message || "Invalid credentials.");
      }
    } catch (err) {
      toast.error("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div className="loginOverlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.form 
        className="loginContainer" 
        onSubmit={handleLogin}
        initial={{ scale: 0.9, opacity: 0, y: 20 }} 
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.5, type: "spring" }}
      >
        <h2 className="loginTitle">Admin Portal</h2>
        {error && <div className="errorMessage">{error}</div>}
        
        <div className="formGroup">
          <label>Admin Email</label>
          <input
            ref={firstInputRef}
            type="email"
            className="premium-input"
            placeholder="Enter admin email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
          />
        </div>

        <div className="formGroup">
          <label>Password</label>
          <input
            type="password"
            className="premium-input"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
          />
        </div>

        <button type="submit" className="premium-btn" disabled={loading} style={{marginTop: "10px"}}>
          {loading ? "Authenticating..." : "Access Dashboard"}
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
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch("/api/admin/books", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setBooks((data || []).map(b => ({ ...b, id: b._id })));
      }
    } catch (err) {
      console.error("Failed to fetch books", err);
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
      const url = formState.id ? `/api/admin/books/${formState.id}` : "/api/admin/books";
      const method = formState.id ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(formState)
      });
      
      if (res.ok) {
        toast.success(formState.id ? "Book updated successfully!" : "Book added successfully!");
        fetchBooks();
        cancelForm();
      } else {
        toast.error("Operation failed. Check your inputs.");
      }
    } catch (err) {
      toast.error("An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const deleteBook = async (id) => {
    if (!window.confirm("Are you sure you want to delete this book? This action cannot be undone.")) return;
    const token = localStorage.getItem("adminToken");
    try {
      const res = await fetch(`/api/admin/books/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        toast.success("Book deleted.");
        fetchBooks();
      }
    } catch (err) {
      toast.error("Error deleting book.");
    }
  };

  return (
    <motion.div 
      className="adminDashboard"
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="dashboardHeader">
        <h2 className="dashboardTitle">Inventory Management</h2>
        {!formState && (
          <button className="premium-btn" onClick={startAdd}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px'}}>
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Add New Book
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {formState && (
          <motion.form
            className="bookForm" 
            onSubmit={submitForm}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h3>{formState.id ? "Edit Book Details" : "Add New Book"}</h3>
            
            <div className="formGrid">
              <div className="formGroup">
                <label>Title</label>
                <input className="premium-input" name="title" value={formState.title} onChange={handleFormChange} placeholder="Book Title" />
                {formErrors.title && <span className="error">{formErrors.title}</span>}
              </div>
              
              <div className="formGroup">
                <label>Author</label>
                <input className="premium-input" name="author" value={formState.author} onChange={handleFormChange} placeholder="Author Name" />
                {formErrors.author && <span className="error">{formErrors.author}</span>}
              </div>
              
              <div className="formGroup">
                <label>Price (₹)</label>
                <input className="premium-input" name="price" value={formState.price} onChange={handleFormChange} placeholder="e.g. 499" />
                {formErrors.price && <span className="error">{formErrors.price}</span>}
              </div>
              
              <div className="formGroup">
                <label>Category</label>
                <input className="premium-input" name="category" value={formState.category} onChange={handleFormChange} placeholder="e.g. Fiction" />
                {formErrors.category && <span className="error">{formErrors.category}</span>}
              </div>
              
              <div className="formGroup fullWidth">
                <label>Cover Image URL</label>
                <input className="premium-input" name="coverImage" value={formState.coverImage} onChange={handleFormChange} placeholder="https://..." />
                {formErrors.coverImage && <span className="error">{formErrors.coverImage}</span>}
              </div>
              
              <div className="formGroup fullWidth">
                <label>Description</label>
                <textarea className="premium-input" style={{resize: 'vertical', minHeight: '100px'}} name="description" value={formState.description} onChange={handleFormChange} placeholder="Write a compelling description..." />
                {formErrors.description && <span className="error">{formErrors.description}</span>}
              </div>
            </div>

            <div className="formActions">
              <button type="submit" className="premium-btn" disabled={loading}>
                {loading ? "Saving..." : "Save Book"}
              </button>
              <button type="button" onClick={cancelForm} className="premium-btn-outline">
                Cancel
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <ul className="bookList">
        <AnimatePresence>
          {books.map((book) => (
            <motion.li 
              key={book.id} 
              className="bookListItem"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              layout
            >
              <img src={book.coverImage} alt={book.title} className="bookThumb" />
              <div className="bookInfo">
                <h4>{book.title}</h4>
                <p><strong>Author:</strong> {book.author}</p>
                <p><strong>Category:</strong> {book.category}</p>
                <p><strong>Price:</strong> ₹{book.price}</p>
              </div>
              <div className="bookActions">
                <button onClick={() => startEdit(book)} className="btnEdit">Edit</button>
                <button onClick={() => deleteBook(book.id)} className="btnDelete">Delete</button>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </motion.div>
  );
};

const AdminDashboardpage = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) setLoggedIn(true);
  }, []);

  return (
    <div className="adminPanelContainer">
      <AnimatePresence>
        {!loggedIn && <AdminLogin onSuccess={() => setLoggedIn(true)} />}
      </AnimatePresence>
      {loggedIn && <AdminDashboard />}
    </div>
  );
};

export default AdminDashboardpage;
