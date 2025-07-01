import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './BuyBooks.css';

const BuyBooks = () => {
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      const { data, error } = await supabase.from('books').select('*').order('created_at', { ascending: false });
      if (error) console.error('Error fetching books:', error);
      else setBooks(data);
    };
    fetchBooks();
  }, []);

  return (
    <div className="buy-wrapper">
      <h2>Buy Books</h2>
      <div className="buy-list">
        {books.map((book) => (
          <motion.div
            key={book.id}
            className="buy-card"
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate(`/book/${book.id}`)}
          >
            <img src={book.image_url} alt={book.title} />
            <h3>{book.title}</h3>
            <p>{book.author}</p>
            <p>₹{book.price}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default BuyBooks;
