import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import styles from "./HomeGlass.module.css";
import { Link } from "react-router-dom";

const WELCOME_TEXT = "Welcome to ReadHaven Bookstore";

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
    authorImg: "data:image/jpeg;base64,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",
    bookTitle: "Pride and Prejudice",
    bookCover: "https://covers.openlibrary.org/b/id/8228691-L.jpg",
    overview: "A romantic novel following Elizabeth Bennet as she navigates issues of manners, upbringing, and marriage.",
  },
  {
    author: "Mark Twain",
    authorImg: "https://upload.wikimedia.org/wikipedia/commons/0/0c/Mark_Twain_by_AF_Bradley.jpg",
    bookTitle: "Adventures of Huckleberry Finn",
    bookCover: "https://covers.openlibrary.org/b/id/8225633-L.jpg",
    overview: "Youthful adventures along the Mississippi River and a critique of entrenched American attitudes.",
  },
  {
    author: "George Orwell",
    authorImg: "https://hips.hearstapps.com/hmg-prod/images/schriftsteller-grossbritannienportr-c3-a4t-vor-einem-mikrofon-news-photo-1754343875.pjpeg?crop=0.624xw:0.808xh;0.0612xw,0&resize=640:*",
    bookTitle: "1984",
    bookCover: "https://covers.openlibrary.org/b/id/7222246-L.jpg",
    overview: "Dystopian novel about government surveillance and totalitarianism.",
  },
];

const loginImages = [
  { id: "login1", src: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=800&q=80", alt: "Bookshelf in bookstore" },
  { id: "login2", src: "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=800&q=80", alt: "Open book and glasses" },
  // { id: "login3", src: "https://images.unsplash.com/photo-1526318472351-c75fcf070b98?auto=format&fit=crop&w=800&q=80", alt: "Person reading a book" },
];

const registerImages = [
  { id: "register1", src: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80", alt: "Cozy reading corner" },
  { id: "register2", src: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=800&q=80", alt: "Person writing notes" },
  // { id: "register3", src: "https://images.unsplash.com/photo-1496104679561-38d51c508b25?auto=format&fit=crop&w=800&q=80", alt: "Books with cup of coffee" },
];

const categoryData = [
  { name: "Fiction", color: "linear-gradient(135deg,#d1cdb3,#b6b493)" },
  { name: "Mystery", color: "linear-gradient(135deg,#b5b193,#a59f80)" },
  { name: "Fantasy", color: "linear-gradient(135deg,#c0bda4,#b0ac8a)" },
  { name: "Non-fiction", color: "linear-gradient(135deg,#cac897,#bab170)" },
  { name: "Science", color: "linear-gradient(135deg,#adaa7b,#999564)" },
  { name: "History", color: "linear-gradient(135deg,#d4cc9a,#c3b267)" },
  { name: "Children", color: "linear-gradient(135deg,#ede7b4,#d7c66e)" },
  { name: "Art", color: "linear-gradient(135deg,#d1d1bd,#bdbd82)" },
];

const funFacts = [
  { id: 1, icon: "📚", title: "Did You Know?", fact: "Reading 6 minutes a day reduces stress by 68%." },
  { id: 2, icon: "🕮", title: "Bookish", fact: "Iceland publishes more books per capita than any other country." },
  { id: 3, icon: "📖", title: "Power of Reading", fact: "Reading fiction improves empathy and social perception." },
  { id: 4, icon: "🌎", title: "Global Books", fact: "Over 2.2 million books are published globally every year." },
  { id: 5, icon: "🧠", title: "Brain Health", fact: "Reading regularly can slow cognitive decline in aging." },
  { id: 6, icon: "✍️", title: "Writing Skills", fact: "Reading improves vocabulary and writing skills greatly." },
  { id: 7, icon: "📅", title: "History", fact: "The oldest known story is the Epic of Gilgamesh from Mesopotamia." },
  { id: 8, icon: "🌟", title: "Famous Readers", fact: "Barack Obama reads about 100 books per year." },
  { id: 9, icon: "🎨", title: "Art & Books", fact: "Book illustrations date back to the Middle Ages." },
  { id: 10, icon: "🔍", title: "Mystery", fact: "Mystery novels became popular in the 19th century." },
  { id: 11, icon: "🏛️", title: "Libraries", fact: "The Library of Alexandria was among the largest in the ancient world." },
  { id: 12, icon: "📦", title: "Book Covers", fact: "Book covers strongly affect buying decisions." },
];

const statsGoal = { books: 10000, categories: 25, members: 5000, reviews: 1500 };

function useAnimatedStats(goals, inView, resetDependency, duration = 1600) {
  const [stats, setStats] = React.useState({ books: 0, categories: 0, members: 0, reviews: 0 });
  React.useEffect(() => {
    if (!inView) {
      setStats({ books: 0, categories: 0, members: 0, reviews: 0 });
      return;
    }
    let start = performance.now();
    function animate(ts) {
      let progress = Math.min((ts - start) / duration, 1);
      setStats({
        books: Math.floor(progress * goals.books),
        categories: Math.floor(progress * goals.categories),
        members: Math.floor(progress * goals.members),
        reviews: Math.floor(progress * goals.reviews),
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
        initial={{ opacity: 0, scale: 0.98, y: 25 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: -25 }}
        transition={{ duration: 0.8, type: "spring" }}
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
        initial={{ opacity: 0, scale: 0.96, x: 25 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        exit={{ opacity: 0, scale: 0.96, x: -25 }}
        transition={{ duration: 0.6, type: "spring" }}
      >
        <div className={styles.funFactIcon}>{facts[idx].icon}</div>
        <div className={styles.funFactHead}>{facts[idx].title}</div>
        <div className={styles.funFactBody}>{facts[idx].fact}</div>
      </motion.div>
    </AnimatePresence>
  );
};

const SplashWelcome = ({ show }) => {
  const [text, setText] = useState("");
  React.useEffect(() => {
    if (!show) return;
    let index = 0;
    setText("");
    const interval = setInterval(() => {
      setText(WELCOME_TEXT.substring(0, index));
      index++;
      if (index > WELCOME_TEXT.length) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, [show]);
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className={styles.splashOverlay}
          initial={{
            opacity: 1,
            scale: 0.3,
            clipPath: "circle(0% at 50% 50%)"
          }}
          animate={{
            opacity: 1,
            scale: 1,
            clipPath: "circle(75% at 50% 50%)",
            transition: { duration: 2 }
          }}
          exit={{
            opacity: 0,
            scale: 0.3,
            clipPath: "circle(0% at 50% 50%)",
            transition: { duration: 1 }
          }}
        >
          <motion.h1
            className={styles.splashText}
            animate={{ color: "#ddcf9a" }}
          >
            {text}
          </motion.h1>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// New book cover carousel data and component

const bookCoverCarouselData = [
  { id: "book1", title: "The Great Gatsby", cover: "https://covers.openlibrary.org/b/id/5894856-L.jpg", link: "/books" },
  { id: "book2", title: "To Kill a Mockingbird", cover: "https://covers.openlibrary.org/b/id/8225231-L.jpg", link: "/books" },
  { id: "book3", title: "1984", cover: "https://covers.openlibrary.org/b/id/7222246-L.jpg", link: "/books" },
  { id: "book4", title: "Pride and Prejudice", cover: "https://covers.openlibrary.org/b/id/8228691-L.jpg", link: "/books" },
  { id: "book5", title: "Moby-Dick", cover: "https://covers.openlibrary.org/b/id/5559393-L.jpg", link: "/books" },
];

const BookCoverCarousel = ({ books }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setIndex((prev) => (prev + 1) % books.length), 3500);
    return () => clearTimeout(timer);
  }, [index, books.length]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={books[index].id}
        className={styles.bookCarouselCard}
        initial={{ opacity: 0, y: 40, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -40, scale: 0.9 }}
        transition={{ duration: 0.8, type: "spring" }}
      >
        <a href={books[index].link} className={styles.bookLink}>
          <img src={books[index].cover} alt={books[index].title} className={styles.bookCoverImg} />
          <div className={styles.bookCoverTitle}>{books[index].title}</div>
        </a>
      </motion.div>
    </AnimatePresence>
  );
};

const Home = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [welcomeText, setWelcomeText] = useState("");
  const [scrollCount, setScrollCount] = useState(0);
  const [showSubtitle, setShowSubtitle] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (showSplash) return;
    let index = 0;
    let playCount = 0;
    setWelcomeText("");
    setShowSubtitle(false);

    const interval = setInterval(() => {
      setWelcomeText(WELCOME_TEXT.substring(0, index));
      index++;
      if (index > WELCOME_TEXT.length) {
        index = 0;
        playCount++;
        if (playCount === 2) {
          clearInterval(interval);
          setShowSubtitle(true);
        }
      }
    }, 60);

    return () => clearInterval(interval);
  }, [scrollCount, showSplash]);

  useEffect(() => {
    const onScroll = () => {
      if (!showSplash) {
        setScrollCount(c => c + 1);
        setShowSubtitle(false);
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [showSplash]);

  const [statsRef, statsInView] = useInView({ threshold: 0.2 });
  const [authorsRef, authorsInView] = useInView({ threshold: 0.15, triggerOnce: true });
  const [loginRef, loginInView] = useInView({ threshold: 0.15, triggerOnce: true });
  const [registerRef, registerInView] = useInView({ threshold: 0.15, triggerOnce: true });
  const [categoryRef, categoryInView] = useInView({ threshold: 0.15, triggerOnce: true });
  const [funFactRef, funFactInView] = useInView({ threshold: 0.15, triggerOnce: true });

  const stats = useAnimatedStats(statsGoal, statsInView, scrollCount);

  return (
    <div className={styles.pageRoot}>
      <SplashWelcome show={showSplash} />
      {!showSplash && (
        <>
          <motion.header
            className={styles.headerJustified}
            initial={{ opacity: 0, y: -60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, type: "spring" }}
          >
            <h1 className={styles.titleTypewriter}>{welcomeText}</h1>
            <AnimatePresence>
              {showSubtitle && (
                <motion.p
                  className={styles.subtitleFaded}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  Step into a world of knowledge — browse, read, and belong.
                </motion.p>
              )}
            </AnimatePresence>
          </motion.header>

          <motion.section
            ref={statsRef}
            className={styles.statsSectionChart}
            whileHover={{
              scale: 1.02,
              boxShadow: "0 22px 62px #e4eafc",
              filter: "brightness(1.08)"
            }}
          >
            <div className={styles.statsLeft}>
              <div className={styles.statsBlocks}>
                {stats &&
                  Object.entries(statsGoal).map(([key, val], idx) => (
                    <motion.div
                      key={key}
                      className={styles.statBlockWhite}
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 + idx * 0.22, type: "spring" }}
                      whileHover={{
                        scale: 1.08,
                        background: "rgba(255,255,255,0.96)",
                        boxShadow: "0 12px 42px #eaffcfde"
                      }}
                    >
                      <motion.span
                        className={styles.statValueWhite}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8 + idx * 0.085 }}
                      >
                        {stats[key]}
                      </motion.span>
                      <span className={styles.statLabelWhite}>
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </span>
                    </motion.div>
                  ))}
              </div>
            </div>
            <motion.div
              className={styles.statsChartContainer}
              initial={{ opacity: 0, rotateY: 40 }}
              whileInView={{ opacity: 1, rotateY: 0 }}
              transition={{ duration: 1.1, type: "tween" }}
              whileHover={{
                scale: 1.06,
                boxShadow: "0 14px 60px #edf7ff"
              }}
            >
              {/* Chart image was removed for dynamic chart */}
            </motion.div>
          </motion.section>

          <motion.section
            ref={authorsRef}
            className={styles.authorsSectionGlass}
            initial={{ opacity: 0, scale: 0.98, y: 80 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, type: "spring" }}
            whileHover={{
              scale: 1.01,
              boxShadow: "0 22px 60px #f3ebcc"
            }}
          >
            <Carousel
              items={famousAuthorsBooks}
              interval={6000}
              renderItem={({ author, authorImg, bookTitle, bookCover, overview }) => (
                <motion.div
                  className={styles.authorBookCardGlass}
                  initial={{ opacity: 0, x: 80, scale: 0.96 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ duration: 0.8, type: "spring" }}
                  whileHover={{
                    scale: 1.03,
                    background: "rgba(255,255,255,0.92)"
                  }}
                >
                  <img src={authorImg} alt={author} className={styles.authorImg} />
                  <div className={styles.bookContent}>
                    <h2 className={styles.bookTitle}>{bookTitle}</h2>
                    <p className={styles.bookOverview}>{overview}</p>
                  </div>
                  <img src={bookCover} alt={bookTitle} className={styles.bookCover} />
                </motion.div>
              )}
            />
          </motion.section>

          <motion.section
            className={styles.loginRegisterSection}
            initial={{ opacity: 0, y: 60, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, type: "spring" }}
          >
            <motion.div
              ref={loginRef}
              className={styles.loginGlass}
              initial={{ opacity: 0, x: -80, scale: 0.95 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 1, type: "spring" }}
              whileHover={{
                scale: 1.08,
                background: "rgba(246,241,211,0.98)",
                boxShadow: "0 18px 56px #d0f5ff"
              }}
            >
              <h3 className={styles.authSectionTitle}>Login</h3>
              <p className={styles.authSectionDesc}>Sign in to access your personalized bookshelf, sync reading progress across devices, and get curated recommendations.</p>
              <Carousel items={loginImages} className={styles.authImageCarousel} renderItem={({ src, alt }) => <img key={alt} src={src} alt={alt} className={styles.authImageGlass} />} />
              <motion.button
                className={styles.authBtn}
                whileHover={{
                  scale: 1.09,
                  background: "#e3d085",
                  color: "#53621c",
                  boxShadow: "0 4px 24px #ede58d"
                }}
                transition={{ type: "spring" }}
              >
                

                 {/* Inside your homepage JSX, replace buttons with: */}
                <Link to="/login" className={styles.navLink}>Login</Link>


              </motion.button>
            </motion.div>
            <motion.div
              ref={registerRef}
              className={styles.registerGlass}
              initial={{ opacity: 0, x: 80, scale: 0.95 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 1, type: "spring" }}
              whileHover={{
                scale: 1.08,
                background: "rgba(246,241,211,0.98)",
                boxShadow: "0 18px 56px #e0fff5"
              }}
            >
              <h3 className={styles.authSectionTitle}>Register</h3>
              <p className={styles.authSectionDesc}>Create an account to join reading challenges, unlock community features, and access exclusive perks.</p>
              <Carousel items={registerImages} className={styles.authImageCarousel} renderItem={({ src, alt }) => <img key={alt} src={src} alt={alt} className={styles.authImageGlass} />} />
              <motion.button
                className={styles.authBtnAlt}
                whileHover={{
                  scale: 1.09,
                  background: "#ffecc3",
                  color: "#5a6d36",
                  borderColor: "#efe391",
                  boxShadow: "0 4px 24px #f7efc5"
                }}
                transition={{ type: "spring" }}
              >
                <Link to="/register" className={styles.navLink}>Register</Link>
              </motion.button>
            </motion.div>
          </motion.section>

          {/* New Book Carousel Section below login/register */}
          <motion.section
            className={styles.bookCarouselSection}
            initial={{ opacity: 0, scale: 0.93, y: 40 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, type: "spring" }}
            whileHover={{ scale: 1.02, boxShadow: "0 22px 60px #d9d2a3cc" }}
          >
            <h3 className={styles.bookCarouselTitle}>Welcome to the World of Books</h3>
            <BookCoverCarousel books={bookCoverCarouselData} />
          </motion.section>

          <motion.section
            ref={categoryRef}
            className={styles.categorySection}
            initial={{ opacity: 0, scale: 0.93, y: 40 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, type: "spring" }}
          >
            <h3 className={styles.categoryTitle}>Explore Book Categories</h3>
            <div className={styles.categoryGrid}>
              {categoryData.map(({ name, color }) => (
                <motion.div
                  key={name}
                  className={styles.categoryCardGlass}
                  style={{ background: color }}
                  whileHover={{
                    scale: 1.11,
                    boxShadow: "0 28px 80px #dbe7f0",
                    filter: "brightness(1.12)",
                    background: color,
                  }}
                  transition={{ type: "spring", stiffness: 320, damping: 22 }}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  {name}
                </motion.div>
              ))}
            </div>
          </motion.section>

          <motion.section
            ref={funFactRef}
            className={styles.funFactSection}
            initial={{ opacity: 0, y: 80, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, type: "spring" }}
            whileHover={{
              scale: 1.025,
              boxShadow: "0 20px 50px #d0f0e8",
            }}
          >
            <FunFactCarousel facts={funFacts} />
          </motion.section>
        </>
      )}
    </div>
  );
};

export default Home;
