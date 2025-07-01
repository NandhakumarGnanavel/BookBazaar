import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './Navbar.css';

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="nav-title">📚 Book Bazaar</div>
      <div className="nav-links">
        <Link to="/add-book">Add Book</Link>
        <Link to="/books">View Books</Link>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}

export default Navbar;
