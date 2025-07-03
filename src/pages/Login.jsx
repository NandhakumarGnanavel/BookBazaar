"use client"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { supabase } from "../supabaseClient"
import "./AuthPage.css"
import Lottie from "lottie-react"
import loginAnimation from "../animations/login-animation.json"
import loginLeftAnimation from "../animations/login-left-animation.json"

function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errorMsg, setErrorMsg] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMsg("")

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (error) {
        setErrorMsg(error.message)
      } else {
        // Add success animation
        document.querySelector(".marketplace-container").classList.add("success")
        setTimeout(() => {
          navigate("/home")
        }, 800)
      }
    } catch (err) {
      setErrorMsg("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="auth-container">
      {/* Advanced particle system */}
      <div className="particle-system">
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
      </div>

      {/* Advanced mesh gradient overlay */}
      <div className="mesh-gradient"></div>

      <div className="marketplace-container">
        {/* Left side - Branding with Lottie */}
        <div className="brand-section">
          <div className="lottie-left">
            <Lottie animationData={loginLeftAnimation} loop={true} />
          </div>
          <h1 className="brand-title">BookSwap</h1>
          <p className="brand-subtitle">
            Connect with book lovers in your area. Buy, sell, and exchange books directly with other readers.
          </p>
          <div className="features-list">
            <div className="feature-item">
              <span className="feature-icon">🆓</span>
              <span>Completely free platform</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🤝</span>
              <span>Direct buyer-seller contact</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📍</span>
              <span>Local book community</span>
            </div>
          </div>
        </div>

        {/* Right side - Login form with Lottie */}
        <div className="form-section">
          <form onSubmit={handleLogin} className={`auth-form ${isLoading ? "loading" : ""}`}>
            <div className="lottie-center-top">
              <div className="lottie-animation">
                <Lottie animationData={loginAnimation} loop={true} />
              </div>
            </div>

            <div className="form-header">
              <h2 className="form-title">Welcome Back</h2>
              <p className="form-subtitle">Sign in to continue your book trading journey</p>
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
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            {errorMsg && <div className="error-message">{errorMsg}</div>}

            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? "Signing In..." : "Sign In"}
            </button>

            <div className="auth-link">
              New to BookSwap? <Link to="/register">Create your free account</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
