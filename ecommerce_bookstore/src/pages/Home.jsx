import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import styles from "./HomeGlass.module.css";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const WELCOME_TEXT = "Welcome to ReadHaven";

const famousAuthorsBooks = [
  {
    author: "J.K. Rowling",
    authorImg: "https://upload.wikimedia.org/wikipedia/commons/5/5d/J._K._Rowling_2010.jpg",
    bookTitle: "Harry Potter and the Sorcerer's Stone",
    bookCover: "https://covers.openlibrary.org/b/id/7984916-L.jpg",
    overview: "The first book in the Harry Potter series, introducing the magical world of Hogwarts and the young wizard Harry Potter.",
  },
  {
    author: "Jane Austen",
    authorImg: "https://upload.wikimedia.org/wikipedia/commons/c/cc/CassandraAusten-JaneAusten%28c.1810%29_hires.jpg",
    bookTitle: "Pride and Prejudice",
    bookCover: "https://covers.openlibrary.org/b/id/8228691-L.jpg",
    overview: "A romantic novel following Elizabeth Bennet as she navigates issues of manners, upbringing, and marriage.",
  },
  {
    author: "George Orwell",
    authorImg: "https://upload.wikimedia.org/wikipedia/commons/7/7e/George_Orwell_press_photo.jpg",
    bookTitle: "1984",
    bookCover: "https://covers.openlibrary.org/b/id/7222246-L.jpg",
    overview: "Dystopian novel about government surveillance and totalitarianism.",
  },
];

const loginImages = [
  { id: "login1", src: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=800&q=80", alt: "Bookshelf in bookstore" },
  { id: "login2", src: "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=800&q=80", alt: "Open book and glasses" },
];

const registerImages = [
  { id: "register1", src: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80", alt: "Cozy reading corner" },
  { id: "register2", src: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=800&q=80", alt: "Person writing notes" },
];

const categoryData = [
  { name: "Fiction", color: "linear-gradient(135deg, #c9a84c, #a68a3a)" },
  { name: "Mystery", color: "linear-gradient(135deg, #7fb89e, #5a9a7d)" },
  { name: "Fantasy", color: "linear-gradient(135deg, #4ecdc4, #3aa89f)" },
  { name: "Non-fiction", color: "linear-gradient(135deg, #a68a3a, #8a7030)" },
  { name: "Science", color: "linear-gradient(135deg, #5a9a7d, #3d7a5f)" },
  { name: "History", color: "linear-gradient(135deg, #9b8d6e, #7a6f55)" },
  { name: "Children", color: "linear-gradient(135deg, #ddb95d, #c9a84c)" },
  { name: "Art", color: "linear-gradient(135deg, #8a9b93, #6b7d75)" },
];

const funFacts = [
  { id: 1, icon: "📚", title: "Did You Know?", fact: "Reading 6 minutes a day reduces stress by 68%." },
  { id: 2, icon: "🌍", title: "Global Readers", fact: "Iceland publishes more books per capita than any other country." },
  { id: 3, icon: "🧠", title: "Brain Health", fact: "Reading regularly can slow cognitive decline in aging." },
  { id: 4, icon: "🏺", title: "History", fact: "The oldest known story is the Epic of Gilgamesh from Mesopotamia." },
];

const statsGoal = { books: 15000, categories: 45, members: 12000, reviews: 8500 };

function useAnimatedStats(goals, inView, resetDependency, duration = 2000) {
  const [stats, setStats] = React.useState({ books: 0, categories: 0, members: 0, reviews: 0 });
  React.useEffect(() => {
    if (!inView) {
      setStats({ books: 0, categories: 0, members: 0, reviews: 0 });
      return;
    }
    let start = performance.now();
    function animate(ts) {
      let progress = Math.min((ts - start) / duration, 1);
      let easeProgress = 1 - Math.pow(1 - progress, 3); 
      setStats({
        books: Math.floor(easeProgress * goals.books),
        categories: Math.floor(easeProgress * goals.categories),
        members: Math.floor(easeProgress * goals.members),
        reviews: Math.floor(easeProgress * goals.reviews),
      });
      if (progress < 1) requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
  }, [inView, resetDependency, goals, duration]);
  return stats;
}

const Carousel = ({ items, renderItem, interval = 4500, className }) => {
  const [i, setI] = React.useState(0);
  React.useEffect(() => {
    const t = setTimeout(() => setI((p) => (p + 1) % items.length), interval);
    return () => clearTimeout(t);
  }, [i, items.length, interval]);
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={items[i].id || i}
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.97 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className={className}
      >
        {renderItem(items[i])}
      </motion.div>
    </AnimatePresence>
  );
};

const FunFactCarousel = ({ facts }) => {
  const [idx, setIdx] = React.useState(0);
  React.useEffect(() => {
    const t = setTimeout(() => setIdx((p) => (p + 1) % facts.length), 6000);
    return () => clearTimeout(t);
  }, [idx, facts.length]);
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={facts[idx].id}
        className={styles.funFactCard}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className={styles.funFactIcon}>{facts[idx].icon}</div>
        <div className={styles.funFactHead}>{facts[idx].title}</div>
        <div className={styles.funFactBody}>"{facts[idx].fact}"</div>
      </motion.div>
    </AnimatePresence>
  );
};

const bookCoverCarouselData = [
  { id: "book1", title: "The Great Gatsby", cover: "https://covers.openlibrary.org/b/id/5894856-L.jpg", link: "/books" },
  { id: "book2", title: "To Kill a Mockingbird", cover: "https://covers.openlibrary.org/b/id/8225231-L.jpg", link: "/books" },
  { id: "book3", title: "1984", cover: "https://covers.openlibrary.org/b/id/7222246-L.jpg", link: "/books" },
];

const BookCoverCarousel = ({ books }) => {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => setIndex((prev) => (prev + 1) % books.length), 4000);
    return () => clearTimeout(timer);
  }, [index, books.length]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={books[index].id}
        className={styles.bookCarouselCard}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Link to={books[index].link} className={styles.bookLink}>
          <img src={books[index].cover} alt={books[index].title} className={styles.bookCoverImg} />
          <div className={styles.bookCoverTitle}>{books[index].title}</div>
        </Link>
      </motion.div>
    </AnimatePresence>
  );
};

const Home = () => {
  const [welcomeText, setWelcomeText] = useState("");

  useEffect(() => {
    let index = 0;
    setWelcomeText("");
    const interval = setInterval(() => {
      setWelcomeText(WELCOME_TEXT.substring(0, index));
      index++;
      if (index > WELCOME_TEXT.length) {
        clearInterval(interval);
      }
    }, 55);
    return () => clearInterval(interval);
  }, []);

  const [statsRef, statsInView] = useInView({ threshold: 0.2, triggerOnce: true });
  const [authorsRef, authorsInView] = useInView({ threshold: 0.15, triggerOnce: true });
  const [loginRef, loginInView] = useInView({ threshold: 0.15, triggerOnce: true });
  const [registerRef, registerInView] = useInView({ threshold: 0.15, triggerOnce: true });
  const [categoryRef, categoryInView] = useInView({ threshold: 0.15, triggerOnce: true });
  const [funFactRef, funFactInView] = useInView({ threshold: 0.15, triggerOnce: true });

  const stats = useAnimatedStats(statsGoal, statsInView, 0);

  return (
    <div className={styles.pageRoot}>
      {/* ═══════ HERO ═══════ */}
      <motion.header
        className={styles.headerJustified}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
      >
        <motion.h1 
          className={styles.titleTypewriter}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          {welcomeText}
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
            style={{ display: "inline-block", marginLeft: "2px", color: "var(--color-primary)" }}
          >|</motion.span>
        </motion.h1>
        
        <motion.p
          className={styles.subtitleFaded}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.8 }}
        >
          Step into a world of knowledge — browse, read, and belong.
        </motion.p>

        <motion.div 
          className={styles.heroDecoLine}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 2.2, duration: 0.8 }}
        />

        <motion.div 
          className={styles.heroCtaGroup}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.5, duration: 0.6 }}
        >
          <Link to="/books" className="premium-btn">Explore Collection</Link>
          <Link to="/register" className="premium-btn-outline">Join ReadHaven</Link>
        </motion.div>

        <motion.div 
          className={styles.scrollIndicator}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3, duration: 1 }}
        >
          <span>Scroll</span>
          <div className={styles.scrollLine}></div>
        </motion.div>
      </motion.header>

      {/* ═══════ STATS ═══════ */}
      <motion.section
        ref={statsRef}
        className={styles.statsSectionChart}
        initial={{ opacity: 0, y: 50 }}
        animate={statsInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        <div className={styles.statsBlocks}>
          {Object.entries(statsGoal).map(([key]) => (
            <div key={key} className={styles.statBlockWhite}>
              <span className={styles.statValueWhite}>{stats[key].toLocaleString()}+</span>
              <span className={styles.statLabelWhite}>{key}</span>
            </div>
          ))}
        </div>
      </motion.section>

      {/* ═══════ AUTHORS ═══════ */}
      <motion.section
        ref={authorsRef}
        className={styles.authorsSectionGlass}
        initial={{ opacity: 0, y: 50 }}
        animate={authorsInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        <h2 className={styles.sectionTitle}>Featured Authors & Classics</h2>
        <p className={styles.sectionSubtitle}>Timeless voices that shaped the literary world.</p>
        <Carousel
          items={famousAuthorsBooks}
          interval={6000}
          renderItem={({ author, authorImg, bookTitle, bookCover, overview }) => (
            <div className={styles.authorBookCardGlass}>
              <img src={authorImg} alt={author} className={styles.authorImg} />
              <div className={styles.bookContent}>
                <h3 className={styles.bookTitle}>{bookTitle}</h3>
                <p className={styles.bookOverview}>{overview}</p>
              </div>
              <img src={bookCover} alt={bookTitle} className={styles.bookCover} />
            </div>
          )}
        />
      </motion.section>

      {/* ═══════ LOGIN & REGISTER ═══════ */}
      <section className={styles.loginRegisterSection}>
        <motion.div
          ref={loginRef}
          className={styles.loginGlass}
          initial={{ opacity: 0, x: -40 }}
          animate={loginInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h3 className={styles.authSectionTitle}>Sign In</h3>
          <p className={styles.authSectionDesc}>Access your personalized bookshelf, sync reading progress, and get curated recommendations.</p>
          <Carousel items={loginImages} className={styles.authImageCarousel} renderItem={({ src, alt }) => <img key={alt} src={src} alt={alt} className={styles.authImageGlass} />} />
          <Link to="/login" className={styles.authBtn}>Sign In Now</Link>
        </motion.div>
        
        <motion.div
          ref={registerRef}
          className={styles.registerGlass}
          initial={{ opacity: 0, x: 40 }}
          animate={registerInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h3 className={styles.authSectionTitle}>Create Account</h3>
          <p className={styles.authSectionDesc}>Join reading challenges, unlock community features, and access exclusive perks.</p>
          <Carousel items={registerImages} className={styles.authImageCarousel} renderItem={({ src, alt }) => <img key={alt} src={src} alt={alt} className={styles.authImageGlass} />} />
          <Link to="/register" className={styles.authBtnAlt}>Get Started</Link>
        </motion.div>
      </section>

      {/* ═══════ BOOK CAROUSEL ═══════ */}
      <motion.section
        className={styles.bookCarouselSection}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h3 className={styles.bookCarouselTitle}>Curated Collections</h3>
        <BookCoverCarousel books={bookCoverCarouselData} />
      </motion.section>

      {/* ═══════ CATEGORIES ═══════ */}
      <motion.section
        ref={categoryRef}
        className={styles.categorySection}
        initial={{ opacity: 0, y: 40 }}
        animate={categoryInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        <h3 className={styles.categoryTitle}>Explore Categories</h3>
        <div className={styles.categoryGrid}>
          {categoryData.map(({ name, color }) => (
            <Link to="/books" key={name} style={{ textDecoration: 'none' }}>
              <motion.div
                className={styles.categoryCardGlass}
                style={{ background: color }}
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {name}
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.section>

      {/* ═══════ FUN FACTS ═══════ */}
      <motion.section
        ref={funFactRef}
        className={styles.funFactSection}
        initial={{ opacity: 0, y: 40 }}
        animate={funFactInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        <FunFactCarousel facts={funFacts} />
      </motion.section>
    </div>
  );
};

export default Home;
