# 📚 Glassmorphic E-Commerce Bookstore Platform

An premium, state-of-the-art, and interactive E-Commerce Bookstore Web Application built with a modern full-stack architecture (**React 19**, **Vite**, **Express**, and **MongoDB**). Featuring an ultra-premium **glassmorphic design system**, immersive micro-animations, context-driven fluid theme transitioning, and **real-time bidirectional state synchronization** via WebSockets.

---

## 🎨 Premium UI/UX & Design Philosophy
This platform was built to wow users at first glance with key design features:
*   **Vibrant Glassmorphic Aesthetics:** Frosted surfaces, blurred boundaries, soft glowing drop shadows, and subtle translucent styling.
*   **Dynamic Theme Toggle:** Fluid transitioning between Dark and Light mode powered by React Context APIs.
*   **Immersive Micro-Animations:** Responsive hover effects, smooth transitions, and viewport scroll-triggered entry animations (using `framer-motion` and `AOS`).
*   **Zero-Jitter Component Updates:** Responsive layouts utilizing pure CSS modules to avoid structural shifting or page layout stuttering.

---

## ⚡ Key Product Features

### 👤 User-Facing Experience
*   **Dynamic Homepage:** Fully-immersive landing page with curated sections, modern category slides, and live recommendations.
*   **Smart Catalog & Browsing:** Search, categorize, filter, and drill down on book inventories with ease.
*   **Interactive Book Details:** Deep views displaying details, author listings, pricing, and live availability indicators.
*   **Slide-In E-Commerce Cart:** Add books to the cart with seamless real-time quantity controls, subtotalling, and interactive updates.
*   **Pre-order / Reservations:** Reserve books directly through the interface with support for pre-ordering titles.
*   **Personalization Dashboard:** Track recent books viewed, favorites/wishlist items, and active reservations.

### 🛡️ Admin Dashboard & Inventory Controls
*   **JWT Protected Portal:** Authenticated login gateway for administrators to access operational panels.
*   **CRUD Inventory Operations:** Direct controls to add new books, update cover images/metadata/pricing, and delete obsolete entries from MongoDB.
*   **Real-time Admin Analytics:** High-level overview of available books, categories, and inventory metrics.

### 🔄 Real-Time WebSockets Engine
*   **Dynamic Synchronization:** Employs **Socket.io** to synchronize updates globally. Addition to carts, changes to favorites, or administrative catalog modifications trigger automatic state updates across active user dashboards without requiring manual page reloads.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | React 19, Vite, React Router DOM v7, CSS Modules, Framer Motion, AOS (Animate on Scroll), Socket.io Client, Axios, React Hot Toast, React Modal |
| **Backend** | Node.js, Express, Socket.io, JWT (JSON Web Token), bcrypt |
| **Database** | MongoDB, Mongoose ODM |
| **Styling** | Vanilla CSS (CSS Variables, Flexbox/Grid, Glassmorphic effects) |

---

## 📁 Project Directory Structure

```text
ecommerce_bookstore/
├── Backend/                      # Node.js + Express API Backend
│   ├── middlewares/              # Express authentication & route protection middlewares
│   ├── models/                   # Mongoose (MongoDB) database schemas
│   │   ├── Admin.js              # Admin schema
│   │   ├── Book.js               # Book catalog schema
│   │   ├── Cart.js               # Unified User details + Cart + Wishlist schema
│   │   └── User.js               # User authentication model
│   ├── routes/                   # API endpoint controllers
│   │   ├── adminAuth.js          # Admin login and auth routes
│   │   ├── books.js              # CRUD routes for books (Admin protected)
│   │   ├── cart.js               # Cart modifications & reservation routes
│   │   ├── logout.js             # Client session cleanup
│   │   ├── userAuth.js           # User registration and login routes
│   │   └── userDashboard.js      # User specific dashboard metadata fetch
│   ├── utils/                    # Shared backend utilities
│   ├── .env                      # Database credentials and configuration
│   ├── index.js                  # Main server entrypoint (Socket.io configuration)
│   └── package.json              # Backend packages
│
├── ecommerce_bookstore/          # React 19 Frontend (Vite)
│   ├── public/                   # Static public assets
│   ├── src/                      # Frontend Application Source Code
│   │   ├── assets/               # Local icons, vectors, and visuals
│   │   ├── components/           # Reusable layout and interactive elements
│   │   │   ├── Navbar.jsx        # Glassmorphic navigation header
│   │   │   ├── BookCard.jsx      # Animated product representation
│   │   │   ├── ThemeToggle.jsx   # Context-driven dark/light switch
│   │   │   └── Footer.jsx        # Site informational footer
│   │   ├── context/              # Application global state provider
│   │   │   └── ThemeContext.jsx  # Global theme registry
│   │   ├── pages/                # High-level route pages (CSS Modularized)
│   │   │   ├── Home.jsx          # Landing Page
│   │   │   ├── BooksPage.jsx     # Book Catalog Browser
│   │   │   ├── BookDetailsPage.jsx# Full details display
│   │   │   ├── CartPage.jsx      # Shopping Cart panel
│   │   │   ├── CheckoutPage.jsx  # Payment & Checkout wizard
│   │   │   ├── UserDashboardPage.jsx # Account overview
│   │   │   ├── AdminDashboardpage.jsx# Inventory Control Center
│   │   │   ├── LoginPage.jsx     # User/Admin entry page
│   │   │   └── RegisterPage.jsx  # User signup screen
│   │   ├── API.jsx               # Centralized Axios handler
│   │   ├── App.jsx               # Routes setup & root component
│   │   └── main.jsx              # React app mounting script
│   ├── package.json              # Frontend package manifest
│   ├── vite.config.js            # Bundler & dev-server setups
│   └── vercel.json               # Deployment routing configs
│
└── package.json                  # Root runner configurations
```

---

## 🚀 Installation & Local Setup

### 1. Prerequisites
Ensure you have the following installed on your machine:
*   [Node.js](https://nodejs.org/) (v18.x or higher recommended)
*   [MongoDB](https://www.mongodb.com/) (either running locally or a MongoDB Atlas cloud URI)
*   [Git](https://git-scm.com/)

### 2. Clone the Repository
```bash
git clone https://github.com/Allen73737/bookstore.git
cd bookstore
```

### 3. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd Backend
   ```
2. Install the backend dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file inside the `Backend` folder and define your configuration:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_uri
   JWT_SECRET=your_jwt_signing_key
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The server should connect successfully to MongoDB and run on `http://localhost:5000`.*

### 4. Frontend Setup
1. Open a new terminal session and navigate to the frontend directory:
   ```bash
   cd ecommerce_bookstore
   ```
2. Install the frontend dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to the local URL (usually `http://localhost:5173` or `http://localhost:3000`).

---

## 📡 Core API Reference

### 🔐 Authentication Endpoints

#### User Signup
*   **URL:** `/api/users/register`
*   **Method:** `POST`
*   **Body:** `{ name, email, password }`
*   **Response:** `{ token, user }`

#### User Login
*   **URL:** `/api/users/login`
*   **Method:** `POST`
*   **Body:** `{ email, password }`
*   **Response:** `{ token, user }`

#### Admin Login
*   **URL:** `/api/admin/login`
*   **Method:** `POST`
*   **Body:** `{ username, password }`
*   **Response:** `{ token }`

---

### 📚 Catalog & Book Management

#### Fetch All Books
*   **URL:** `/api/admin/books`
*   **Method:** `GET`
*   **Response:** `Array of Book objects`

#### Add New Book (Admin Only)
*   **URL:** `/api/admin/books`
*   **Method:** `POST`
*   **Headers:** `Authorization: Bearer <JWT_TOKEN>`
*   **Body:** `{ title, author, price, description, coverImage, category }`

#### Update Book details (Admin Only)
*   **URL:** `/api/admin/books/:id`
*   **Method:** `PUT`
*   **Headers:** `Authorization: Bearer <JWT_TOKEN>`
*   **Body:** `{ title, author, price, description, coverImage, category }`

#### Remove Book (Admin Only)
*   **URL:** `/api/admin/books/:id`
*   **Method:** `DELETE`
*   **Headers:** `Authorization: Bearer <JWT_TOKEN>`

---

### 🛒 Shopping Cart & Pre-orders (Token Protected)

All requests require user authorization headers: `Authorization: Bearer <JWT_TOKEN>`.

#### Get User's Cart
*   **URL:** `/api/user/cart`
*   **Method:** `GET`

#### Add Book to Cart
*   **URL:** `/api/user/cart`
*   **Method:** `POST`
*   **Body:** `{ bookId, quantity }`

#### Modify Cart Quantity
*   **URL:** `/api/user/cart/:bookId`
*   **Method:** `PATCH`
*   **Body:** `{ quantity }`

#### Remove Cart Item
*   **URL:** `/api/user/cart/:bookId`
*   **Method:** `DELETE`

#### Reserve Book (Pre-order)
*   **URL:** `/api/user/cart/:bookId/reserve`
*   **Method:** `POST`
*   **Response:** `{ message: "Reserved successfully" }`

---

## 🎨 Visual Preview & Interactivity
The layout utilizes modern animations and styles to deliver a stellar, responsive application.

```
       [ Client Browser ]
        /              \
  HTTP Requests      WebSockets (Socket.io)
      /                  \
[ Express API ] <---> [ Socket Server ]
      |
[ MongoDB Atlas ]
```

*   **Slide-ins:** Visual feedback notifications via `react-hot-toast` accompany every cart adjustment or favorite add event.
*   **Grid layout:** Auto-responsive CSS grids automatically scale books cards seamlessly from desktop setups to mobile screens.
*   **Glassmorphic backgrounds:** Backdrop blur effects (`backdrop-filter: blur(10px)`) coupled with multi-layered radial gradients provide an incredibly high-end visual tone.

---

## 📜 License
This project is licensed under the MIT License. Feel free to clone, modify, and build upon this platform for educational or commercial purposes.
