"use client"

import { useState } from "react"
import { supabase } from "../supabaseClient"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import "./SellBooks.css"

const SellBooks = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    title: "",
    author: "",
    price: "",
    category: "",
    condition: "",
    description: "",
    contact: "",
    image: null,
  })
  const [imagePreview, setImagePreview] = useState(null)
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const categories = [
    "Fiction",
    "Non-Fiction",
    "Academic",
    "Children",
    "Romance",
    "Mystery",
    "Science",
    "Biography",
    "Self-Help",
    "History",
    "Philosophy",
    "Poetry",
  ]

  const conditions = ["Like New", "Very Good", "Good", "Fair", "Poor"]

  const handleChange = (e) => {
    const { name, value, files } = e.target

    if (name === "image" && files && files[0]) {
      const file = files[0]

      // Validate file
      const fileError = validateFile(file)
      if (fileError) {
        setErrors({ ...errors, [name]: fileError })
        return
      }

      setForm({ ...form, [name]: file })

      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => setImagePreview(e.target.result)
      reader.readAsDataURL(file)
    } else {
      setForm({ ...form, [name]: value })
    }

    // Clear error for this field
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" })
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!form.title.trim()) newErrors.title = "Title is required"
    if (!form.author.trim()) newErrors.author = "Author is required"
    if (!form.price || form.price <= 0) newErrors.price = "Valid price is required"
    if (!form.category) newErrors.category = "Category is required"
    if (!form.condition) newErrors.condition = "Condition is required"
    if (!form.contact.trim()) newErrors.contact = "Contact number is required"
    if (!form.image) newErrors.image = "Book image is required"

    // Validate contact number (basic validation)
    if (form.contact && !/^\d{10}$/.test(form.contact.replace(/\D/g, ""))) {
      newErrors.contact = "Please enter a valid 10-digit phone number"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateFile = (file) => {
    const maxSize = 5 * 1024 * 1024 // 5MB
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]

    if (file.size > maxSize) {
      return "File size must be less than 5MB"
    }

    if (!allowedTypes.includes(file.type)) {
      return "Only JPG, PNG, and WEBP files are allowed"
    }

    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      setMessage("Please fix the errors below")
      return
    }

    setIsLoading(true)
    setMessage("")

    try {
      // Get user first
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError || !user) {
        setMessage("You must be logged in to sell books")
        setIsLoading(false)
        return
      }

      let imageUrl = null

      // Upload image if provided
      if (form.image) {
        const fileExt = form.image.name.split(".").pop()
        const fileName = `${user.id}_${Date.now()}.${fileExt}`

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("book-images")
          .upload(fileName, form.image, {
            cacheControl: "3600",
            upsert: false,
          })

        if (uploadError) {
          console.error("Upload error:", uploadError)
          setMessage("Failed to upload image. Please try again.")
          setIsLoading(false)
          return
        }

        // Get public URL
        const { data: urlData } = supabase.storage.from("book-images").getPublicUrl(fileName)

        imageUrl = urlData.publicUrl
      }

      // Insert book record
      const { data: bookData, error: insertError } = await supabase
        .from("books")
        .insert([
          {
            title: form.title.trim(),
            author: form.author.trim(),
            price: Number.parseFloat(form.price),
            category: form.category,
            condition: form.condition,
            description: form.description.trim() || null,
            contact_number: form.contact.trim(),
            image_url: imageUrl,
            user_id: user.id,
          },
        ])
        .select()

      if (insertError) {
        console.error("Insert error:", insertError)
        setMessage("Failed to add book. Please try again.")
      } else {
        setMessage("🎉 Book added successfully! Redirecting to browse page...")

        // Reset form
        setForm({
          title: "",
          author: "",
          price: "",
          category: "",
          condition: "",
          description: "",
          contact: "",
          image: null,
        })
        setImagePreview(null)

        // Redirect after success
        setTimeout(() => {
          navigate("/buy")
        }, 2000)
      }
    } catch (error) {
      console.error("Unexpected error:", error)
      setMessage("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        staggerChildren: 0.05,
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
    <div className="sell-books-wrapper">
      {/* Background Elements */}
      <div className="background-elements">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </div>

      {/* Header */}
      <motion.header className="sell-header" initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
        <div className="header-content">
          <motion.button
            className="back-btn"
            onClick={() => navigate("/")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            ← Back to Home
          </motion.button>
          <div className="header-info">
            <h1>💰 Sell Your Books</h1>
            <p>Turn your old books into cash and help other readers discover great stories</p>
          </div>
        </div>
      </motion.header>

      <div className="sell-content">
        <motion.div className="sell-form-container" variants={containerVariants} initial="hidden" animate="visible">
          <motion.div className="form-header" variants={itemVariants}>
            <h2>📚 Add Your Book</h2>
            <p>Fill in the details below to list your book for sale</p>
          </motion.div>

          <form onSubmit={handleSubmit} className="sell-form">
            {/* Image Upload */}
            <motion.div className="form-group image-upload-group" variants={itemVariants}>
              <label>📸 Book Image *</label>
              <div className="image-upload-container">
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleChange}
                  className="image-input"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="image-upload-label">
                  {imagePreview ? (
                    <div className="image-preview">
                      <img src={imagePreview || "/placeholder.svg"} alt="Book preview" />
                      <div className="image-overlay">
                        <span>Click to change image</span>
                      </div>
                    </div>
                  ) : (
                    <div className="upload-placeholder">
                      <div className="upload-icon">📷</div>
                      <span>Click to upload book image</span>
                      <small>JPG, PNG, or WEBP (Max 5MB)</small>
                    </div>
                  )}
                </label>
              </div>
              {errors.image && <span className="error-message">{errors.image}</span>}
            </motion.div>

            {/* Title and Author */}
            <div className="form-row">
              <motion.div className="form-group" variants={itemVariants}>
                <label htmlFor="title">📖 Book Title *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  placeholder="Enter the book title"
                  value={form.title}
                  onChange={handleChange}
                  className={errors.title ? "error" : ""}
                />
                {errors.title && <span className="error-message">{errors.title}</span>}
              </motion.div>

              <motion.div className="form-group" variants={itemVariants}>
                <label htmlFor="author">✍️ Author *</label>
                <input
                  type="text"
                  id="author"
                  name="author"
                  placeholder="Enter the author name"
                  value={form.author}
                  onChange={handleChange}
                  className={errors.author ? "error" : ""}
                />
                {errors.author && <span className="error-message">{errors.author}</span>}
              </motion.div>
            </div>

            {/* Price and Category */}
            <div className="form-row">
              <motion.div className="form-group" variants={itemVariants}>
                <label htmlFor="price">💰 Price (₹) *</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  placeholder="Enter price in rupees"
                  value={form.price}
                  onChange={handleChange}
                  min="1"
                  className={errors.price ? "error" : ""}
                />
                {errors.price && <span className="error-message">{errors.price}</span>}
              </motion.div>

              <motion.div className="form-group" variants={itemVariants}>
                <label htmlFor="category">📂 Category *</label>
                <select
                  id="category"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className={errors.category ? "error" : ""}
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                {errors.category && <span className="error-message">{errors.category}</span>}
              </motion.div>
            </div>

            {/* Condition */}
            <motion.div className="form-group" variants={itemVariants}>
              <label>📋 Book Condition *</label>
              <div className="condition-options">
                {conditions.map((condition) => (
                  <label key={condition} className="condition-option">
                    <input
                      type="radio"
                      name="condition"
                      value={condition}
                      checked={form.condition === condition}
                      onChange={handleChange}
                    />
                    <span className="condition-label">{condition}</span>
                  </label>
                ))}
              </div>
              {errors.condition && <span className="error-message">{errors.condition}</span>}
            </motion.div>

            {/* Description */}
            <motion.div className="form-group" variants={itemVariants}>
              <label htmlFor="description">📝 Description (Optional)</label>
              <textarea
                id="description"
                name="description"
                placeholder="Add any additional details about the book..."
                value={form.description}
                onChange={handleChange}
                rows="4"
              />
            </motion.div>

            {/* Contact */}
            <motion.div className="form-group" variants={itemVariants}>
              <label htmlFor="contact">📞 Contact Number *</label>
              <input
                type="tel"
                id="contact"
                name="contact"
                placeholder="Enter your contact number"
                value={form.contact}
                onChange={handleChange}
                className={errors.contact ? "error" : ""}
              />
              {errors.contact && <span className="error-message">{errors.contact}</span>}
              <small className="field-hint">Buyers will use this number to contact you</small>
            </motion.div>

            {/* Submit Button */}
            <motion.div className="form-actions" variants={itemVariants}>
              <motion.button
                type="submit"
                className="submit-btn"
                disabled={isLoading}
                whileHover={{ scale: isLoading ? 1 : 1.01 }}
                whileTap={{ scale: isLoading ? 1 : 0.99 }}
              >
                {isLoading ? (
                  <div className="loading-content">
                    <div className="spinner"></div>
                    <span>Adding Book...</span>
                  </div>
                ) : (
                  <div className="submit-content">
                    <span>🚀 List My Book</span>
                  </div>
                )}
              </motion.button>
            </motion.div>

            {/* Message */}
            {message && (
              <motion.div
                className={`message ${message.includes("successfully") ? "success" : "error"}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {message}
              </motion.div>
            )}
          </form>
        </motion.div>

        {/* Tips Sidebar */}
        <motion.aside
          className="tips-sidebar"
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="tips-container">
            <h3>💡 Selling Tips</h3>
            <div className="tip-item">
              <div className="tip-icon">📸</div>
              <div className="tip-content">
                <h4>Take Great Photos</h4>
                <p>Use good lighting and show the book's condition clearly</p>
              </div>
            </div>
            <div className="tip-item">
              <div className="tip-icon">💰</div>
              <div className="tip-content">
                <h4>Price Competitively</h4>
                <p>Research similar books to set a fair price</p>
              </div>
            </div>
            <div className="tip-item">
              <div className="tip-icon">📝</div>
              <div className="tip-content">
                <h4>Be Honest</h4>
                <p>Accurately describe the book's condition and any defects</p>
              </div>
            </div>
            <div className="tip-item">
              <div className="tip-icon">⚡</div>
              <div className="tip-content">
                <h4>Respond Quickly</h4>
                <p>Reply to buyer inquiries promptly to close deals faster</p>
              </div>
            </div>
          </div>
        </motion.aside>
      </div>
    </div>
  )
}

export default SellBooks
