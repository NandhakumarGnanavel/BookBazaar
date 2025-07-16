"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../supabaseClient"
import "./Home.css"

const Home = () => {
  const navigate = useNavigate()
  const [books, setBooks] = useState([])
  const [userInfo, setUserInfo] = useState({ name: "", email: "", phone: "" })
  const [isScrolled, setIsScrolled] = useState(false)
  const [user, setUser] = useState(null)
  const [showLoading, setShowLoading] = useState(true)
  const [showProfilePanel, setShowProfilePanel] = useState(false)
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 })
  const [isCursorActive, setIsCursorActive] = useState(false)

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
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
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

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoading(false)
    }, 3000)
    return () => clearTimeout(timer)
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        !event.target.closest(".profile-dropdown") &&
        !event.target.closest(".profile-avatar")
      ) {
        setShowProfilePanel(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setShowProfilePanel(false)
  }

  const handleBookClick = (bookId) => {
    if (!user) {
      alert("Please login or register to view book details")
      navigate("/login")
      return
    }
    navigate(`/book/${bookId}`)
  }

  const handleMouseMove = (e) => {
    setCursorPos({ x: e.clientX, y: e.clientY })
  }

  const handleMouseEnter = () => {
    setIsCursorActive(true)
  }

  const handleMouseLeave = () => {
    setIsCursorActive(false)
  }

  return (
    <div
      className="home-wrapper"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {showLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <div className="loading-text">BookSwap</div>
          <div className="loading-subtext">Connecting book lovers worldwide...</div>
        </div>
      )}

      <div className="ultra-bg"></div>
      <div
        className={`cursor-trail ${isCursorActive ? "active" : ""}`}
        style={{ left: cursorPos.x, top: cursorPos.y }}
      ></div>

      <header className={`navbar ${isScrolled ? "scrolled" : ""}`}>
        <div className="navbar-container">
          <div className="logo magnetic">
            <span className="logo-icon">📚</span>
            <span className="logo-text">BookSwap</span>
          </div>

          <div className="nav-actions">
            {user ? (
              <>
                <button className="nav-btn magnetic" onClick={() => navigate("/buy")}>
                  <span>search Books</span>
                </button>
                <button className="nav-btn primary magnetic" onClick={() => navigate("/sell")}>
                  <span>Sell Books</span>
                </button>
                <div className="profile-avatar magnetic" onClick={() => setShowProfilePanel(!showProfilePanel)}>
                  <div className="avatar-circle">
                    <span>{userInfo.name ? userInfo.name.charAt(0).toUpperCase() : "👤"}</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <button className="nav-btn magnetic" onClick={() => navigate("/login")}>
                  <span>Login</span>
                </button>
                <button className="nav-btn primary magnetic" onClick={() => navigate("/register")}>
                  <span>Register</span>
                </button>
              </>
            )}
          </div>
        </div>

        {showProfilePanel && user && (
          <div className="profile-dropdown glass">
            <h4>{userInfo.name || "User"}</h4>
            <p>{userInfo.email}</p>
            <button onClick={() => navigate("/my-books")}>My Books</button>
            <button onClick={() => navigate("/favorites")}>Favorites</button>
            <button onClick={() => navigate("/profile")}>Profile</button>
            <button className="logout" onClick={handleLogout}>Logout</button>
          </div>
        )}
      </header>

      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1>
              Discover Your Next
              <br />
              <span className="highlight">Great Read</span>
            </h1>
            <p>
              Join thousands of book lovers trading, buying, and selling books in their local community. Find rare gems,
              bestsellers, and hidden treasures at unbeatable prices.
            </p>
            <div className="hero-stats">
              <div className="stat-item magnetic">
                <div className="stat-number">000+</div>
                <div className="stat-label">Books Available</div>
              </div>
              <div className="stat-item magnetic">
                <div className="stat-number">00+</div>
                <div className="stat-label">Happy Users</div>
              </div>
              <div className="stat-item magnetic">
                <div className="stat-number">00+</div>
                <div className="stat-label">Cities</div>
              </div>
            </div>
            <div className="hero-actions">
              {user ? (
                <>
                  <button className="cta-btn primary magnetic" onClick={() => navigate("/buy")}>
                    <span>Start Shopping</span>
                  </button>
                  <button className="cta-btn secondary magnetic" onClick={() => navigate("/sell")}>
                    <span>Sell Your Books</span>
                  </button>
                </>
              ) : (
                <>
                  <button className="cta-btn primary magnetic" onClick={() => navigate("/register")}>
                    <span>Join BookSwap</span>
                  </button>
                  <button className="cta-btn secondary magnetic" onClick={() => navigate("/login")}>
                    <span>Sign In</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="features">
        <h2>Why Choose BookSwap?</h2>
        <div className="features-grid">
          <div className="feature-card magnetic">
            <div className="feature-icon">🆓</div>
            <h3>Completely Free</h3>
            <p>No hidden fees, no commissions. Connect directly with buyers and sellers in your community.</p>
          </div>
          <div className="feature-card magnetic">
            <div className="feature-icon">⚡</div>
            <h3>Lightning Fast</h3>
            <p>Post your books in seconds and start getting responses immediately from interested buyers.</p>
          </div>
          <div className="feature-card magnetic">
            <div className="feature-icon">🔒</div>
            <h3>Safe & Secure</h3>
            <p>Verified users and secure messaging system for complete peace of mind during transactions.</p>
          </div>
          <div className="feature-card magnetic">
            <div className="feature-icon">🌍</div>
            <h3>Local Community</h3>
            <p>Connect with book lovers in your area for easy exchanges and build lasting friendships.</p>
          </div>
        </div>
      </section>

      <section className="recent-books">
        <div className="section-header">
          <h2>Recently Added Books</h2>
          <p>Fresh arrivals from our community of passionate book lovers</p>
          {user && (
            <button className="view-all-btn magnetic" onClick={() => navigate("/buy")}>
              <span>View All Books →</span>
            </button>
          )}
        </div>

        <div className="books-grid">
          {books.map((book) => (
            <div key={book.id} className="book-card magnetic" onClick={() => handleBookClick(book.id)}>
              <div className="book-image-container">
                <img src={book.image_url || "/placeholder.svg"} alt={book.title} />
              </div>
              <div className="book-info">
                <h4>{book.title}</h4>
                <p className="book-author">by {book.author}</p>
                <div className="book-details">
                  <span className="book-price">₹{book.price}</span>
                  <span className="book-category magnetic">{book.category}</span>
                </div>
              </div>
              <div className="book-actions">
                <button className="contact-btn magnetic">
                  <span>{user ? "Contact Seller" : "Login First"}</span>
                </button>
                <button className="favorite-btn magnetic">
                  <span>❤️</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Start Trading?</h2>
          <p>Join our community of book enthusiasts and start your literary journey today!</p>
          <div className="cta-buttons">
            {user ? (
              <>
                <button className="cta-btn primary large magnetic" onClick={() => navigate("/sell")}>
                  <span>Sell Your First Book</span>
                </button>
                <button className="cta-btn secondary large magnetic" onClick={() => navigate("/buy")}>
                  <span>Browse Collection</span>
                </button>
              </>
            ) : (
              <>
                <button className="cta-btn primary large magnetic" onClick={() => navigate("/register")}>
                  <span>Create Free Account</span>
                </button>
                <button className="cta-btn secondary large magnetic" onClick={() => navigate("/login")}>
                  <span>Sign In Now</span>
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo magnetic">
              <span className="logo-icon">📚</span>
              <span className="logo-text">BookSwap</span>
            </div>
            <p>Connecting book lovers across India. Trade, buy, and sell books with complete ease and security.</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="/buy">Browse Books</a></li>
              <li><a href="/sell">Sell Books</a></li>
              <li><a href="/categories">Categories</a></li>
              <li><a href="/how-it-works">How It Works</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Support</h4>
            <ul>
              <li><a href="/help">Help Center</a></li>
              <li><a href="/contact">Contact Us</a></li>
              <li><a href="/safety">Safety Tips</a></li>
              <li><a href="/faq">FAQ</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Legal</h4>
            <ul>
              <li><a href="/privacy">Privacy Policy</a></li>
              <li><a href="/terms">Terms of Service</a></li>
              <li><a href="/cookies">Cookie Policy</a></li>
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
