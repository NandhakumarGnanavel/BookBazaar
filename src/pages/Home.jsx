"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../supabaseClient"
import "./Home.css"
import { motion } from "framer-motion"

const Home = () => {
  const navigate = useNavigate()
  const [books, setBooks] = useState([])
  const [showProfile, setShowProfile] = useState(false)
  const [userInfo, setUserInfo] = useState({ name: "", email: "", phone: "" })
  const [editMode, setEditMode] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const fetchBooks = async () => {
      const { data, error } = await supabase
        .from("books")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(8)

      if (error) console.error("Error fetching books:", error)
      else setBooks(data || [])
    }
    fetchBooks()
  }, [])

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        setUserInfo({
          name: user.user_metadata?.name || "",
          email: user.email,
          phone: user.user_metadata?.phone || "",
        })
      }
    }
    getUser()
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = "/login"
  }

  const handleUpdateProfile = async () => {
    const { error } = await supabase.auth.updateUser({
      data: {
        name: userInfo.name,
        phone: userInfo.phone,
      },
    })
    if (error) console.error("Error updating profile:", error)
    else setEditMode(false)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  return (
    <div className="home-wrapper">
      {/* Animated Background Elements */}
      <div className="background-elements">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
          <div className="shape shape-5"></div>
        </div>
        <div className="particle-field">
          {[...Array(20)].map((_, i) => (
            <div key={i} className={`particle particle-${i + 1}`}></div>
          ))}
        </div>
      </div>

      {/* Modern Navbar */}
      <motion.header
        className={`navbar ${isScrolled ? "scrolled" : ""}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="navbar-container">
          <motion.div className="logo" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <span className="logo-icon">📚</span>
            <span className="logo-text">BookSwap</span>
          </motion.div>

          <div className="search-container">
            <motion.div className="search-box" whileFocus={{ scale: 1.02 }}>
              <input
                type="text"
                placeholder="Search books, authors, categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <motion.button className="search-btn" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                🔍
              </motion.button>
            </motion.div>
          </div>

          <div className="nav-actions">
            <motion.button
              className="nav-btn"
              onClick={() => navigate("/buy")}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Browse Books
            </motion.button>
            <motion.button
              className="nav-btn primary"
              onClick={() => navigate("/sell")}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Sell Books
            </motion.button>
            <motion.div
              className="profile-avatar"
              onClick={() => setShowProfile(!showProfile)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <div className="avatar-circle">
                <span>{userInfo.name ? userInfo.name.charAt(0).toUpperCase() : "👤"}</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Enhanced Profile Dropdown */}
        {showProfile && (
          <motion.div
            className="profile-dropdown"
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <div className="profile-header">
              <div className="profile-avatar-large">
                <span>{userInfo.name ? userInfo.name.charAt(0).toUpperCase() : "👤"}</span>
              </div>
              <div className="profile-info">
                <h4>{userInfo.name || "User"}</h4>
                <p>{userInfo.email}</p>
              </div>
            </div>

            {editMode ? (
              <div className="edit-profile">
                <input
                  type="text"
                  value={userInfo.name}
                  onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                  placeholder="Full Name"
                />
                <input
                  type="text"
                  value={userInfo.phone}
                  onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
                  placeholder="Phone Number"
                />
                <div className="profile-actions">
                  <button className="save-btn" onClick={handleUpdateProfile}>
                    Save
                  </button>
                  <button className="cancel-btn" onClick={() => setEditMode(false)}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="profile-details">
                <div className="detail-item">
                  <span className="label">Name:</span>
                  <span className="value">{userInfo.name || "Not set"}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Phone:</span>
                  <span className="value">{userInfo.phone || "Not set"}</span>
                </div>
                <button className="edit-btn" onClick={() => setEditMode(true)}>
                  ✏️ Edit Profile
                </button>
              </div>
            )}

            <div className="profile-menu">
              <button className="menu-item" onClick={() => navigate("/my-books")}>
                📚 My Books
              </button>
              <button className="menu-item" onClick={() => navigate("/favorites")}>
                ❤️ Favorites
              </button>
              <button className="menu-item" onClick={() => navigate("/settings")}>
                ⚙️ Settings
              </button>
            </div>

            <button className="logout-btn" onClick={handleLogout}>
              🚪 Logout
            </button>
          </motion.div>
        )}
      </motion.header>

      {/* Hero Section */}
      <motion.section className="hero" variants={containerVariants} initial="hidden" animate="visible">
        <div className="hero-content">
          <motion.div className="hero-text" variants={itemVariants}>
            <h1>
              <span className="gradient-text">Discover</span> Your Next
              <br />
              <span className="highlight">Great Read</span>
            </h1>
            <p>
              Join thousands of book lovers trading, buying, and selling books in their local community. Find rare gems,
              bestsellers, and hidden treasures .
            </p>
          </motion.div>

          <motion.div className="hero-stats" variants={itemVariants}>
            <div className="stat-item">
              <div className="stat-number">00+</div>
              <div className="stat-label">Books Available</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">00+</div>
              <div className="stat-label">Happy Users</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">00+</div>
              <div className="stat-label">Whole Tamilnadu</div>
            </div>
          </motion.div>

          <motion.div className="hero-actions" variants={itemVariants}>
            <motion.button
              className="cta-btn primary"
              onClick={() => navigate("/buy")}
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>🛒 Start Shopping</span>
              <div className="btn-glow"></div>
            </motion.button>
            <motion.button
              className="cta-btn secondary"
              onClick={() => navigate("/sell")}
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>💰 Sell Your Books</span>
            </motion.button>
          </motion.div>
        </div>

        <motion.div className="hero-visual" variants={itemVariants}>
          <div className="book-stack">
            <div className="book book-1">
              <div className="book-spine"></div>
              <div className="book-cover">📖</div>
            </div>
            <div className="book book-2">
              <div className="book-spine"></div>
              <div className="book-cover">📚</div>
            </div>
            <div className="book book-3">
              <div className="book-spine"></div>
              <div className="book-cover">📓</div>
            </div>
          </div>
          <div className="floating-elements">
            <div className="element element-1">💫</div>
            <div className="element element-2">⭐</div>
            <div className="element element-3">✨</div>
          </div>
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        className="features"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.h2 variants={itemVariants}>Why Choose BookSwap?</motion.h2>
        <div className="features-grid">
          <motion.div className="feature-card" variants={itemVariants}>
            <div className="feature-icon">🆓</div>
            <h3>Completely Free</h3>
            <p>No hidden fees, no commissions. Connect directly with buyers and sellers.</p>
          </motion.div>
          <motion.div className="feature-card" variants={itemVariants}>
            <div className="feature-icon">🚀</div>
            <h3>Lightning Fast</h3>
            <p>Post your books in seconds and start getting responses immediately.</p>
          </motion.div>
          <motion.div className="feature-card" variants={itemVariants}>
            <div className="feature-icon">🔒</div>
            <h3>Safe & Secure</h3>
            <p>Verified users and secure messaging for peace of mind.</p>
          </motion.div>
          <motion.div className="feature-card" variants={itemVariants}>
            <div className="feature-icon">🌍</div>
            <h3>Local Community</h3>
            <p>Connect with book lovers in your area for easy exchanges.</p>
          </motion.div>
        </div>
      </motion.section>

      {/* Recent Books Section */}
      <motion.section
        className="recent-books"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.div className="section-header" variants={itemVariants}>
          <h2>📚 Recently Added Books</h2>
          <p>Fresh arrivals from our community of book lovers</p>
          <motion.button
            className="view-all-btn"
            onClick={() => navigate("/buy")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View All Books →
          </motion.button>
        </motion.div>

        <motion.div className="books-grid" variants={containerVariants}>
          {books.map((book, index) => (
            <motion.div
              key={book.id}
              className="book-card"
              variants={itemVariants}
              whileHover={{
                scale: 1.05,
                y: -10,
                transition: { duration: 0.3 },
              }}
              onClick={() => navigate(`/book/${book.id}`)}
              custom={index}
            >
              <div className="book-image-container">
                <img src={book.image_url || "/placeholder.svg"} alt={book.title} />
                <div className="book-overlay">
                  <button className="quick-view-btn">Quick View</button>
                </div>
              </div>
              <div className="book-info">
                <h4>{book.title}</h4>
                <p className="book-author">{book.author}</p>
                <div className="book-details">
                  <span className="book-price">₹{book.price}</span>
                  <span className="book-category">{book.category}</span>
                </div>
              </div>
              <div className="book-actions">
                <button className="contact-btn">💬 Contact</button>
                <button className="favorite-btn">❤️</button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className="cta-section"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="cta-content">
          <h2>Ready to Start Trading?</h2>
          <p>Join our community of book enthusiasts today!</p>
          <div className="cta-buttons">
            <motion.button
              className="cta-btn primary large"
              onClick={() => navigate("/sell")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Sell Your First Book
            </motion.button>
            <motion.button
              className="cta-btn secondary large"
              onClick={() => navigate("/buy")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Browse Collection
            </motion.button>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <span className="logo-icon">📚</span>
              <span className="logo-text">BookSwap</span>
            </div>
            <p>Connecting book lovers across India. Trade, buy, and sell books with ease.</p>
            <div className="social-links">
              <a href="#" className="social-link">
                📘
              </a>
              <a href="#" className="social-link">
                📷
              </a>
              <a href="#" className="social-link">
                🐦
              </a>
            </div>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li>
                <a href="/buy">Browse Books</a>
              </li>
              <li>
                <a href="/sell">Sell Books</a>
              </li>
              <li>
                <a href="/categories">Categories</a>
              </li>
              <li>
                <a href="/how-it-works">How It Works</a>
              </li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Support</h4>
            <ul>
              <li>
                <a href="/help">Help Center</a>
              </li>
              <li>
                <a href="/contact">Contact Us</a>
              </li>
              <li>
                <a href="/safety">Safety Tips</a>
              </li>
              <li>
                <a href="/faq">FAQ</a>
              </li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Legal</h4>
            <ul>
              <li>
                <a href="/privacy">Privacy Policy</a>
              </li>
              <li>
                <a href="/terms">Terms of Service</a>
              </li>
              <li>
                <a href="/cookies">Cookie Policy</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} BookSwap. Made with ❤️ for book lovers across India.</p>
        </div>
      </footer>
    </div>
  )
}

export default Home
