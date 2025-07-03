"use client"

import { useEffect, useState } from "react"
import { supabase } from "../supabaseClient"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import "./BuyBooks.css"

const BuyBooks = () => {
  const [books, setBooks] = useState([])
  const [filteredBooks, setFilteredBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [priceRange, setPriceRange] = useState([0, 10000])
  const [sortBy, setSortBy] = useState("newest")
  const [viewMode, setViewMode] = useState("grid")
  const [favorites, setFavorites] = useState([])
  const navigate = useNavigate()

  const categories = [
    "all",
    "Fiction",
    "Non-Fiction",
    "Academic",
    "Children",
    "Romance",
    "Mystery",
    "Science",
    "Biography",
    "Self-Help",
  ]

  useEffect(() => {
    fetchBooks()
  }, [])

  useEffect(() => {
    filterBooks()
  }, [books, searchQuery, selectedCategory, priceRange, sortBy])

  const fetchBooks = async () => {
    setLoading(true)
    const { data, error } = await supabase.from("books").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching books:", error)
    } else {
      setBooks(data || [])
    }
    setLoading(false)
  }

  const filterBooks = () => {
    let filtered = [...books]

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (book) =>
          book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.category?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((book) => book.category === selectedCategory)
    }

    // Price range filter
    filtered = filtered.filter((book) => book.price >= priceRange[0] && book.price <= priceRange[1])

    // Sort
    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        break
      case "oldest":
        filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
        break
      case "price-low":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "title":
        filtered.sort((a, b) => a.title.localeCompare(b.title))
        break
      default:
        break
    }

    setFilteredBooks(filtered)
  }

  const toggleFavorite = (bookId) => {
    setFavorites((prev) => (prev.includes(bookId) ? prev.filter((id) => id !== bookId) : [...prev, bookId]))
  }

  // Simplify animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        staggerChildren: 0.03,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  }

  return (
    <div className="buy-books-wrapper">
      {/* Background Elements */}
      <div className="background-elements">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </div>

      {/* Header */}
      <motion.header className="buy-header" initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
        <div className="header-content">
          <motion.button
            className="back-btn"
            onClick={() => navigate("/")}
            whileHover={{ scale: 1.05, x: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            ← Back to Home
          </motion.button>
          <div className="header-info">
            <h1>📚 Browse Books</h1>
            <p>Discover amazing books from our community</p>
          </div>
          <div className="view-controls">
            <motion.button
              className={`view-btn ${viewMode === "grid" ? "active" : ""}`}
              onClick={() => setViewMode("grid")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ⊞
            </motion.button>
            <motion.button
              className={`view-btn ${viewMode === "list" ? "active" : ""}`}
              onClick={() => setViewMode("list")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ☰
            </motion.button>
          </div>
        </div>
      </motion.header>

      <div className="buy-content">
        {/* Filters Sidebar */}
        <motion.aside
          className="filters-sidebar"
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="filter-section">
            <h3>🔍 Search</h3>
            <div className="search-container">
              <input
                type="text"
                placeholder="Search books, authors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
          </div>

          <div className="filter-section">
            <h3>📂 Categories</h3>
            <div className="category-list">
              {categories.map((category) => (
                <motion.button
                  key={category}
                  className={`category-btn ${selectedCategory === category ? "active" : ""}`}
                  onClick={() => setSelectedCategory(category)}
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {category === "all" ? "All Categories" : category}
                </motion.button>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <h3>💰 Price Range</h3>
            <div className="price-range">
              <div className="price-inputs">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([Number.parseInt(e.target.value) || 0, priceRange[1]])}
                />
                <span>to</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number.parseInt(e.target.value) || 10000])}
                />
              </div>
              <div className="price-display">
                ₹{priceRange[0]} - ₹{priceRange[1]}
              </div>
            </div>
          </div>

          <div className="filter-section">
            <h3>🔄 Sort By</h3>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="title">Title A-Z</option>
            </select>
          </div>

          <motion.button
            className="clear-filters-btn"
            onClick={() => {
              setSearchQuery("")
              setSelectedCategory("all")
              setPriceRange([0, 10000])
              setSortBy("newest")
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Clear All Filters
          </motion.button>
        </motion.aside>

        {/* Main Content */}
        <main className="books-main">
          <motion.div
            className="results-header"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="results-info">
              <h2>
                {loading ? "Loading..." : `${filteredBooks.length} Books Found`}
                {selectedCategory !== "all" && <span className="category-tag">in {selectedCategory}</span>}
              </h2>
              {searchQuery && (
                <p className="search-info">
                  Showing results for "<strong>{searchQuery}</strong>"
                </p>
              )}
            </div>
          </motion.div>

          {/* Loading State */}
          {loading && (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading amazing books...</p>
            </div>
          )}

          {/* Books Grid/List */}
          {!loading && (
            <motion.div
              className={`books-container ${viewMode}`}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <AnimatePresence>
                {filteredBooks.map((book, index) => (
                  // Simplify book card animations
                  <motion.div
                    key={book.id}
                    className="book-card"
                    variants={itemVariants}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    whileHover={{
                      scale: 1.02,
                      y: -5,
                      transition: { duration: 0.2 },
                    }}
                    onClick={() => navigate(`/book/${book.id}`)}
                  >
                    <div className="book-image-container">
                      <img src={book.image_url || "/placeholder.svg"} alt={book.title} />
                      <div className="book-overlay">
                        <motion.button
                          className="quick-view-btn"
                          onClick={(e) => {
                            e.stopPropagation()
                            navigate(`/book/${book.id}`)
                          }}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          👁️ Quick View
                        </motion.button>
                      </div>
                      <motion.button
                        className={`favorite-btn ${favorites.includes(book.id) ? "active" : ""}`}
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleFavorite(book.id)
                        }}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.8 }}
                      >
                        {favorites.includes(book.id) ? "❤️" : "🤍"}
                      </motion.button>
                    </div>

                    <div className="book-info">
                      <div className="book-header">
                        <h3>{book.title}</h3>
                        <span className="book-price">₹{book.price}</span>
                      </div>
                      <p className="book-author">by {book.author}</p>
                      {book.category && <span className="book-category">{book.category}</span>}
                      <div className="book-meta">
                        <span className="book-date">📅 {new Date(book.created_at).toLocaleDateString()}</span>
                        <span className="book-contact">📞 Contact Available</span>
                      </div>
                    </div>

                    <div className="book-actions">
                      <motion.button
                        className="contact-btn"
                        onClick={(e) => {
                          e.stopPropagation()
                          navigate(`/book/${book.id}`)
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        💬 Contact Seller
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {/* No Results */}
          {!loading && filteredBooks.length === 0 && (
            <motion.div
              className="no-results"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="no-results-icon">📚</div>
              <h3>No books found</h3>
              <p>Try adjusting your search criteria or browse all categories</p>
              <motion.button
                className="browse-all-btn"
                onClick={() => {
                  setSearchQuery("")
                  setSelectedCategory("all")
                  setPriceRange([0, 10000])
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Browse All Books
              </motion.button>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  )
}

export default BuyBooks
