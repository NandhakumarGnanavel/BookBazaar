// === src/pages/Home.jsx ===
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './Home.css';
import { motion } from 'framer-motion';

const Home = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [showProfile, setShowProfile] = useState(false);
  const [userInfo, setUserInfo] = useState({ name: '', email: '', phone: '' });
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const fetchBooks = async () => {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) console.error('Error fetching books:', error);
      else setBooks(data || []);
    };
    fetchBooks();
  }, []);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUserInfo({
          name: user.user_metadata?.name || '',
          email: user.email,
          phone: user.user_metadata?.phone || '',
        });
      }
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  const handleUpdateProfile = async () => {
    const { error } = await supabase.auth.updateUser({
      data: {
        name: userInfo.name,
        phone: userInfo.phone,
      },
    });
    if (error) console.error('Error updating profile:', error);
    else setEditMode(false);
  };

  return (
    <div className="home-wrapper">
      <header className="navbar">
        <div className="logo">📚 Book Bazaar</div>
        <div className="nav-actions">
          <motion.div
            className="profile-box"
            onClick={() => setShowProfile(!showProfile)}
            whileHover={{ scale: 1.1 }}
          >
            👤
          </motion.div>
        </div>
        {showProfile && (
          <motion.div
            className="profile-dropdown"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {editMode ? (
              <>
                <input
                  type="text"
                  value={userInfo.name}
                  onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                  placeholder="Name"
                />
                <input
                  type="text"
                  value={userInfo.phone}
                  onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
                  placeholder="Phone"
                />
                <button onClick={handleUpdateProfile}>Save</button>
              </>
            ) : (
              <>
                <p>
                  <strong>Name:</strong> {userInfo.name}
                </p>
                <p>
                  <strong>Email:</strong> {userInfo.email}
                </p>
                <p>
                  <strong>Phone:</strong> {userInfo.phone}
                </p>
                <button onClick={() => setEditMode(true)}>Edit</button>
              </>
            )}
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </motion.div>
        )}
      </header>

      <motion.section
        className="hero"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1>Buy and Sell Old Books Online in India for Actual Money!</h1>
        <p>
          Book Bazaar helps you connect with buyers and sellers for second-hand books. Hassle-free and
          fast!
        </p>

        <div className="hero-cards">
          <motion.div
            className="card buy-card"
            onClick={() => navigate('/buy')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <img src="https://cdn-icons-png.flaticon.com/512/4333/4333609.png" alt="Buy" />
            <h3>Buy Used Books</h3>
          </motion.div>
          <motion.div
            className="card sell-card"
            onClick={() => navigate('/sell')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <img src="https://cdn-icons-png.flaticon.com/512/2331/2331966.png" alt="Sell" />
            <h3>Sell Old Books</h3>
          </motion.div>
        </div>
      </motion.section>

      <motion.section
        className="recent-books"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h2>📚 Recently Added Books</h2>
        <div className="book-list">
          {books.map((book) => (
            <motion.div
              key={book.id}
              className="book"
              whileHover={{ scale: 1.03 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <img src={book.image_url} alt={book.title} />
              <h4>{book.title}</h4>
              <p>{book.author}</p>
              <p>₹{book.price}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <footer className="footer">
        <p>© {new Date().getFullYear()} Book Bazaar. Made with ❤️ for book lovers.</p>
      </footer>
    </div>
  );
};

export default Home;

