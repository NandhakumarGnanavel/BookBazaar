import React, { useState } from 'react';
import AddBook from './AddBook';
import BookList from './BookList';
import './Dashboard.css';

function Dashboard() {
  const [viewMode, setViewMode] = useState('add'); // 'add' or 'list'

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <h1>📚 Book Bazaar</h1>
        <div className="nav-links">
          <button onClick={() => setViewMode('add')}>Add Book</button>
          <button onClick={() => setViewMode('list')}>View Books</button>
        </div>
      </nav>

      <div className="content-area animate">
        {viewMode === 'add' ? <AddBook /> : <BookList />}
      </div>
    </div>
  );
}

export default Dashboard;
"use client"

import { useState, useEffect, useRef } from "react"
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
  const dropdownRef = useRef(null)

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfilePanel(false)
      }
    }
    if (showProfilePanel) {
      document.addEventListener("mousedown", handleClickOutside)
    } else {
      document.removeEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showProfilePanel])

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

  return (
    <div className="home-wrapper">
      {showLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <div className="loading-text">BookSwap</div>
          <div className="loading-subtext">Connecting book lovers worldwide...</div>
        </div>
      )}

      <div className="ultra-bg"></div>
      <div className="cursor-trail"></div>

      <header className={`navbar ${isScrolled ? "scrolled" : ""}`}>
        <div className="navbar-container">
          <div className="logo magnetic">
            <span className="logo-icon">📚</span>
            <span className="logo-text">BookSwap</span>
          </div>

          <div className="nav-actions">
            {user ? (
              <>
                <button className="nav-btn magnetic" onClick={() => navigate("/buy")}>Browse Books</button>
                <button className="nav-btn primary magnetic" onClick={() => navigate("/sell")}>Sell Books</button>
                <div className="profile-avatar magnetic" onClick={() => setShowProfilePanel(!showProfilePanel)}>
                  <div className="avatar-circle">
                    <span>{userInfo.name ? userInfo.name.charAt(0).toUpperCase() : "👤"}</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <button className="nav-btn magnetic" onClick={() => navigate("/login")}>Login</button>
                <button className="nav-btn primary magnetic" onClick={() => navigate("/register")}>Register</button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ✅ Modern Dropdown Profile */}
      {showProfilePanel && user && (
        <div className="profile-dropdown" ref={dropdownRef}>
          <div className="profile-header">
            <div className="profile-avatar-large">
              {userInfo.name ? userInfo.name.charAt(0).toUpperCase() : "👤"}
            </div>
            <div className="profile-info">
              <h4>{userInfo.name || "User"}</h4>
              <p>{userInfo.email}</p>
              <div className="profile-badge" onClick={() => navigate("/profile")}>Edit Profile</div>
            </div>
          </div>
          <div className="profile-content">
            <div className="profile-actions">
              <button className="profile-btn" onClick={() => navigate("/my-books")}>
                📚 My Books
              </button>
              <button className="profile-btn" onClick={() => navigate("/favorites")}>
                ❤️ Favorites
              </button>
              <button className="profile-btn logout-btn" onClick={handleLogout}>
                🔒 Logout
              </button>
            </div>
          </div>
        </div>
      )}
