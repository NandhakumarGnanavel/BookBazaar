"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { supabase } from "../supabaseClient"
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
  const [user, setUser] = useState(null)

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        navigate("/login")
        return
      }
      setUser(user)
    }
    checkUser()
  }, [navigate])

  useEffect(() => {
    if (id && user) {
      fetchBook()
      fetchRelatedBooks()
    }
  }, [id, user])

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
      alert(`Message sent to seller: "${chatMessage}"`)
      setChatMessage("")
      setShowContact(false)
    }
  }

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite)
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

  if (!user) {
    return null
  }

  if (loading) {
    return (
      <div className="book-details-wrapper">
        <div className="details-bg"></div>
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
        <div className="details-bg"></div>
        <div className="error-container">
          <div className="error-icon">📚</div>
          <h2>Book Not Found</h2>
          <p>The book you're looking for doesn't exist or has been removed.</p>
          <button className="back-btn" onClick={() => navigate("/buy")}>
            <span>Browse Other Books</span>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="book-details-wrapper">
      <div className="details-bg"></div>
      {/* Ultra-Modern Header */}
      <header className="details-header">
        <div className="header-content">
          <button className="back-btn" onClick={() => navigate("/buy")}>
            <span>← Back to Browse</span>
          </button>
          <button className={`favorite-btn ${isFavorite ? "active" : ""}`} onClick={toggleFavorite}>
            <span>{isFavorite ? "❤️ Saved" : "🤍 Save"}</span>
          </button>
        </div>
      </header>

      <div className="book-details-content">
        {/* Ultra-Modern Main Book Details */}
        <div className="book-main-details">
          <div className="book-image-section">
            <div className="book-image-container">
              <img src={book.image_url || "/placeholder.svg"} alt={book.title} />
              <div className="image-overlay">
                <button className="zoom-btn" onClick={() => window.open(book.image_url, "_blank")}>
                  <span>🔍 View Full Size</span>
                </button>
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
                <span className="meta-label">Author:</span>
                <span className="meta-value">{book.author}</span>
              </div>
              {book.category && (
                <div className="meta-item">
                  <span className="meta-label">Category:</span>
                  <span className="meta-value">{book.category}</span>
                </div>
              )}
              {book.condition && (
                <div className="meta-item">
                  <span className="meta-label">Condition:</span>
                  <span className="meta-value condition">{book.condition}</span>
                </div>
              )}
              <div className="meta-item">
                <span className="meta-label">Listed:</span>
                <span className="meta-value">{new Date(book.created_at).toLocaleDateString()}</span>
              </div>
            </div>

            {book.description && (
              <div className="book-description">
                <h3>Description</h3>
                <p>{book.description}</p>
              </div>
            )}

            <div className="contact-section">
              <h3>Contact Seller</h3>
              <div className="contact-actions">
                <button className="contact-btn primary" onClick={handleWhatsApp}>
                  <span>WhatsApp</span>
                </button>
                <button className="contact-btn secondary" onClick={handleCallSeller}>
                  <span>Call</span>
                </button>
                <button className="contact-btn tertiary" onClick={handleContactSeller}>
                  <span>Message</span>
                </button>
              </div>
              {showContact && (
                <div className="contact-form">
                  <textarea
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    placeholder="Type your message to the seller..."
                    rows="4"
                  />
                  <div className="form-actions">
                    <button className="send-btn" onClick={handleSendMessage}>
                      <span>Send Message</span>
                    </button>
                    <button className="cancel-btn" onClick={() => setShowContact(false)}>
                      <span>Cancel</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Ultra-Modern Related Books */}
        {relatedBooks.length > 0 && (
          <section className="related-books">
            <h2>More Books You Might Like</h2>
            <div className="related-books-grid">
              {relatedBooks.map((relatedBook) => (
                <div
                  key={relatedBook.id}
                  className="related-book-card"
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
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

export default BookDetails
