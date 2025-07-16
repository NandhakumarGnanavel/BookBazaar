"use client"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { supabase } from "../supabaseClient"
import "./AuthPage.css"

function Register() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [errorMsg, setErrorMsg] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const validateForm = () => {
    if (password !== confirm) {
      setErrorMsg("Passwords do not match")
      return false
    }

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters long")
      return false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setErrorMsg("Please enter a valid email address")
      return false
    }

    return true
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setErrorMsg("")

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      })

      if (error) {
        setErrorMsg(error.message)
      } else {
        alert(
          "🎉 Welcome to BookSwap! Please check your email to verify your account and start trading books with your community.",
        )
        setTimeout(() => {
          navigate("/")
        }, 1000)
      }
    } catch (err) {
      setErrorMsg("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-content">
        {/* Left side - Branding */}
        <div className="brand-section">
          <div className="brand-content">
            <h1 className="brand-title">BookSwap</h1>
            <p className="brand-subtitle">
              Join thousands of book lovers who trade, buy, and sell books in their local community.
            </p>
            <div className="features-list">
              <div className="feature-item">
                <span className="feature-icon">🆓</span>
                <span>No platform fees ever</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">📱</span>
                <span>Easy ad posting & browsing</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🌍</span>
                <span>Connect with local readers</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Register form */}
        <div className="form-section">
          <form onSubmit={handleRegister} className="auth-form">
            <div className="form-header">
              <h2 className="form-title">Join BookSwap</h2>
              <p className="form-subtitle">Create your free account and start trading books today</p>
            </div>

            <div className="input-group">
              <input
                type="email"
                className="form-input"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="input-group">
              <input
                type="password"
                className="form-input"
                placeholder="Create a password (min. 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                minLength="6"
              />
            </div>

            <div className="input-group">
              <input
                type="password"
                className="form-input"
                placeholder="Confirm your password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            {errorMsg && <div className="error-message">{errorMsg}</div>}

            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? "Creating Account..." : "Create Free Account"}
            </button>

            <div className="auth-link">
              Already have an account? <Link to="/">Sign in here</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Register

