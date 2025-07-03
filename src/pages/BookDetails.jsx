"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { supabase } from "../supabaseClient"
import { motion } from "framer-motion"
import "./BookDetails.css"

const BookDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [book, setBook] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showContact, setShowContact] = useState(false)
  const [message, setMessage] = useState("")
  const [chatMessage, setChatMessage] = useState("")
  const [isFavorite, setIsFavorite] = useState(false)
  const [relatedBooks, setRelatedBooks] = useState([])

  useEffect(() => {
    if (id) {
      fetchBook()
      fetchRelatedBooks()
    }
  }, [id])

  const fetchBook = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase.from("books").select("*").eq("id", id).single()

      if (error) {
        console.error("Error fetching book:", error)
        setMessage("Book not found")
      } else {
        setBook(data)
      }
    } catch (err) {
      console.error("Unexpected error:", err)
      setMessage("Failed to load book details")
    } finally {
      setLoading(false)
    }
  }

  const fetchRelatedBooks = async () => {
    try {
      const { data, error } = await supabase
        .from("books")
        .select("*")
        .neq("id", id)
        .limit(4)
        .order("created_at", { ascending: false })

      if (!error && data) {
        setRelatedBooks(data)
      }
    } catch (err) {
      console.error("Error fetching related books:", err)
    }
  }

  const handleContactSeller = () => {
    setShowContact(true)
  }

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      // In a real app, this would send a message to the seller
      alert(`Message sent to seller: "${chatMessage}"`)
      setChatMessage("")
      setShowContact(false)
    }
  }

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite)
    // In a real app, this would save to user's favorites
  }

  const handleCallSeller = () => {
    if (book?.contact_number) {
      window.open(`tel:${book.contact_number}`)
    }
  }

  const handleWhatsApp = () => {
    if (book?.contact_number) {
      const message = `Hi! I'm interested in your book "${book.title}" listed on BookSwap.`
      const whatsappUrl = `https://wa.me/91${book.contact_number}?text=${encodeURIComponent(message)}`
      window.open(whatsappUrl, "_blank")
    }
  }

  if (loading) {
    return (
      <div className="book-details-wrapper">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading book details...</p>
        </div>
      </div>
    )
  }

  if (!book) {
    return (
      <div className="book-details-wrapper">
        <div className="error-container">
          <div className="error-icon">📚</div>
          <h2>Book Not Found</h2>
          <p>The book you're looking for doesn't exist or has been removed.</p>
          <motion.button
            className="back-btn"
            onClick={() => navigate("/buy")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Browse Other Books
          </motion.button>
        </div>
      </div>
    )
  }

  return (
    <div className="book-details-wrapper">
      {/* Background Elements */}
      <div className="background-elements">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
        </div>
      </div>

      {/* Header */}
      <motion.header className="details-header" initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
        <div className="header-content">
          <motion.button
            className="back-btn"
            onClick={() => navigate("/buy")}
            whileHover={{ scale: 1.05, x: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            ← Back to Browse
          </motion.button>
          <motion.button
            className={`favorite-btn ${isFavorite ? "active" : ""}`}
            onClick={toggleFavorite}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isFavorite ? "❤️" : "🤍"} {isFavorite ? "Saved" : "Save"}
          </motion.button>
        </div>
      </motion.header>

      <div className="book-details-content">
        {/* Main Book Details */}
        <motion.div
          className="book-main-details"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="book-image-section">
            <div className="book-image-container">
              <img src={book.image_url || "/placeholder.svg"} alt={book.title} />
              <div className="image-overlay">
                <motion.button
                  className="zoom-btn"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => window.open(book.image_url, "_blank")}
                >
                  🔍 View Full Size
                </motion.button>
              </div>
            </div>
          </div>

          <div className="book-info-section">
            <div className="book-header">
              <h1>{book.title}</h1>
              <div className="book-price">₹{book.price}</div>
            </div>

            <div className="book-meta">
              <div className="meta-item">
                <span className="meta-label">✍️ Author:</span>
                <span className="meta-value">{book.author}</span>
              </div>
              {book.category && (
                <div className="meta-item">
                  <span className="meta-label">📂 Category:</span>
                  <span className="meta-value">{book.category}</span>
                </div>
              )}
              {book.condition && (
                <div className="meta-item">
                  <span className="meta-label">📋 Condition:</span>
                  <span className="meta-value condition">{book.condition}</span>
                </div>
              )}
              <div className="meta-item">
                <span className="meta-label">📅 Listed:</span>
                <span className="meta-value">{new Date(book.created_at).toLocaleDateString()}</span>
              </div>
            </div>

            {book.description && (
              <div className="book-description">
                <h3>📝 Description</h3>
                <p>{book.description}</p>
              </div>
            )}

            <div className="contact-section">
              <h3>📞 Contact Seller</h3>
              <div className="contact-actions">
                <motion.button
                  className="contact-btn primary"
                  onClick={handleWhatsApp}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  💬 WhatsApp
                </motion.button>
                <motion.button
                  className="contact-btn secondary"
                  onClick={handleCallSeller}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  📞 Call
                </motion.button>
                <motion.button
                  className="contact-btn tertiary"
                  onClick={handleContactSeller}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  ✉️ Message
                </motion.button>
              </div>
              {showContact && (
                <motion.div
                  className="contact-form"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.3 }}
                >
                  <textarea
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    placeholder="Type your message to the seller..."
                    rows="4"
                  />
                  <div className="form-actions">
                    <motion.button
                      className="send-btn"
                      onClick={handleSendMessage}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Send Message
                    </motion.button>
                    <button className="cancel-btn" onClick={() => setShowContact(false)}>
                      Cancel
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Related Books */}
        {relatedBooks.length > 0 && (
          <motion.section
            className="related-books"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h2>📚 More Books You Might Like</h2>
            <div className="related-books-grid">
              {relatedBooks.map((relatedBook) => (
                <motion.div
                  key={relatedBook.id}
                  className="related-book-card"
                  whileHover={{ scale: 1.03, y: -5 }}
                  onClick={() => navigate(`/book/${relatedBook.id}`)}
                >
                  <div className="related-book-image">
                    <img src={relatedBook.image_url || "/placeholder.svg"} alt={relatedBook.title} />
                  </div>
                  <div className="related-book-info">
                    <h4>{relatedBook.title}</h4>
                    <p>{relatedBook.author}</p>
                    <span className="related-book-price">₹{relatedBook.price}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </div>
  )
}

export default BookDetails
