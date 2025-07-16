"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../supabaseClient"
import "./Profile.css"

const Profile = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [userInfo, setUserInfo] = useState({ name: "", email: "", phone: "", bio: "" })
  const [userBooks, setUserBooks] = useState([])
  const [userStats, setUserStats] = useState({
    booksListed: 0,
    booksSold: 0,
    totalEarnings: 0,
  })
  const [recentActivity, setRecentActivity] = useState([])
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    publicProfile: true,
    showPhone: false,
  })
  const [editMode, setEditMode] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        navigate("/login")
        return
      }

      setUser(user)
      setUserInfo({
        name: user.user_metadata?.name || "",
        email: user.email,
        phone: user.user_metadata?.phone || "",
        bio:
          user.user_metadata?.bio ||
          "Book enthusiast and avid reader. Love discovering new stories and sharing great books with the community.",
      })

      // Fetch user's books
      const { data: books } = await supabase.from("books").select("*").eq("user_id", user.id)
      if (books) {
        setUserBooks(books)
        setUserStats({
          booksListed: books.length,
          booksSold: Math.floor(books.length * 0.3), // Mock data
          totalEarnings: books.reduce((sum, book) => sum + book.price * 0.3, 0), // Mock data
        })
      }

      // Mock recent activity
      setRecentActivity([
        {
          id: 1,
          type: "book_listed",
          title: "Listed 'The Great Gatsby'",
          description: "Successfully listed a new book for sale",
          time: "2 hours ago",
          icon: "📚",
        },
        {
          id: 2,
          type: "book_sold",
          title: "Sold 'To Kill a Mockingbird'",
          description: "Book sold to John Doe for ₹450",
          time: "1 day ago",
          icon: "💰",
        },
        {
          id: 3,
          type: "message",
          title: "New message received",
          description: "Someone is interested in your book",
          time: "3 days ago",
          icon: "💬",
        },
      ])

      setLoading(false)
    }
    getUser()
  }, [navigate])

  const handleUpdateProfile = async () => {
    const { error } = await supabase.auth.updateUser({
      data: {
        name: userInfo.name,
        phone: userInfo.phone,
        bio: userInfo.bio,
      },
    })
    if (error) {
      console.error("Error updating profile:", error)
    } else {
      setEditMode(false)
    }
  }

  const toggleSetting = (setting) => {
    setSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }))
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate("/")
  }

  if (loading) {
    return (
      <div className="profile-wrapper">
        <div className="profile-bg"></div>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your profile...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="profile-wrapper">
      <div className="profile-bg"></div>

      {/* Modern Header */}
      <header className="profile-header">
        <div className="header-content">
          <button className="back-btn" onClick={() => navigate("/")}>
            <span>← Back to Home</span>
          </button>
          <h1 className="header-title">My Profile</h1>
          <div></div>
        </div>
      </header>

      <div className="profile-content">
        {/* Profile Hero Section */}
        <div className="profile-hero">
          <div className="hero-content">
            <div className="profile-avatar-section">
              <div className="profile-avatar-large">
                <span>{userInfo.name ? userInfo.name.charAt(0).toUpperCase() : "👤"}</span>
                <div className="avatar-status"></div>
              </div>
              <button className="change-avatar-btn">
                <span>Change Photo</span>
              </button>
            </div>

            <div className="profile-info">
              {editMode ? (
                <>
                  <input
                    type="text"
                    value={userInfo.name}
                    onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                    className="profile-name-input"
                    placeholder="Your name"
                  />
                  <textarea
                    value={userInfo.bio}
                    onChange={(e) => setUserInfo({ ...userInfo, bio: e.target.value })}
                    className="profile-bio-input"
                    placeholder="Tell us about yourself..."
                    rows="3"
                  />
                </>
              ) : (
                <>
                  <h2 className="profile-name">{userInfo.name || "Book Lover"}</h2>
                  <p className="profile-email">{userInfo.email}</p>
                  <div className="profile-badges">
                    <span className="profile-badge">
                      <span>Premium Member</span>
                    </span>
                    <span className="profile-badge">
                      <span>Verified Seller</span>
                    </span>
                    <span className="profile-badge">
                      <span>Top Rated</span>
                    </span>
                  </div>
                  <p className="profile-bio">{userInfo.bio}</p>
                </>
              )}
            </div>

            <div className="profile-stats-section">
              {editMode ? (
                <div style={{ display: "flex", gap: "1rem", flexDirection: "column" }}>
                  <button className="edit-profile-btn" onClick={handleUpdateProfile}>
                    <span>Save Changes</span>
                  </button>
                  <button className="edit-profile-btn" onClick={() => setEditMode(false)}>
                    <span>Cancel</span>
                  </button>
                </div>
              ) : (
                <button className="edit-profile-btn" onClick={() => setEditMode(true)}>
                  <span>Edit Profile</span>
                </button>
              )}

              <div className="stats-grid">
                <div className="stat-card">
                  <span className="stat-number">{userStats.booksListed}</span>
                  <span className="stat-label">Books Listed</span>
                </div>
                <div className="stat-card">
                  <span className="stat-number">{userStats.booksSold}</span>
                  <span className="stat-label">Books Sold</span>
                </div>
                <div className="stat-card">
                  <span className="stat-number">₹{Math.round(userStats.totalEarnings)}</span>
                  <span className="stat-label">Total Earned</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Sections */}
        <div className="profile-sections">
          {/* Recent Activity */}
          <div className="profile-section">
            <h3 className="section-title">
              <span className="section-icon">⚡</span>
              Recent Activity
            </h3>
            <div className="activity-list">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="activity-item">
                  <div className="activity-icon">{activity.icon}</div>
                  <div className="activity-content">
                    <h4>{activity.title}</h4>
                    <p>{activity.description}</p>
                    <small>{activity.time}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Settings */}
          <div className="profile-section">
            <h3 className="section-title">
              <span className="section-icon">⚙️</span>
              Settings
            </h3>
            <div className="settings-list">
              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-icon">📧</div>
                  <div className="setting-content">
                    <h4>Email Notifications</h4>
                    <p>Receive updates about your books and messages</p>
                  </div>
                </div>
                <div
                  className={`setting-toggle ${settings.emailNotifications ? "active" : ""}`}
                  onClick={() => toggleSetting("emailNotifications")}
                >
                  <div className="toggle-slider"></div>
                </div>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-icon">📱</div>
                  <div className="setting-content">
                    <h4>SMS Notifications</h4>
                    <p>Get text messages for important updates</p>
                  </div>
                </div>
                <div
                  className={`setting-toggle ${settings.smsNotifications ? "active" : ""}`}
                  onClick={() => toggleSetting("smsNotifications")}
                >
                  <div className="toggle-slider"></div>
                </div>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-icon">🌍</div>
                  <div className="setting-content">
                    <h4>Public Profile</h4>
                    <p>Allow others to see your profile information</p>
                  </div>
                </div>
                <div
                  className={`setting-toggle ${settings.publicProfile ? "active" : ""}`}
                  onClick={() => toggleSetting("publicProfile")}
                >
                  <div className="toggle-slider"></div>
                </div>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-icon">📞</div>
                  <div className="setting-content">
                    <h4>Show Phone Number</h4>
                    <p>Display your phone number on book listings</p>
                  </div>
                </div>
                <div
                  className={`setting-toggle ${settings.showPhone ? "active" : ""}`}
                  onClick={() => toggleSetting("showPhone")}
                >
                  <div className="toggle-slider"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* My Books Section */}
        <div className="profile-section" style={{ gridColumn: "1 / -1" }}>
          <h3 className="section-title">
            <span className="section-icon">📚</span>
            My Books ({userBooks.length})
          </h3>
          <div className="my-books-grid">
            {userBooks.slice(0, 6).map((book) => (
              <div key={book.id} className="book-card-mini" onClick={() => navigate(`/book/${book.id}`)}>
                <div className="book-image-mini">
                  <img src={book.image_url || "/placeholder.svg"} alt={book.title} />
                </div>
                <div className="book-info-mini">
                  <h4>{book.title}</h4>
                  <p>{book.author}</p>
                  <span className="book-price-mini">₹{book.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="profile-actions">
          <button className="action-btn primary" onClick={() => navigate("/sell")}>
            <span>📚 Sell New Book</span>
          </button>
          <button className="action-btn secondary" onClick={() => navigate("/buy")}>
            <span>🔍 Browse Books</span>
          </button>
          <button className="action-btn secondary" onClick={() => navigate("/favorites")}>
            <span>❤️ My Favorites</span>
          </button>
          <button className="action-btn secondary" onClick={handleLogout}>
            <span>  ⬅ Logout</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Profile
