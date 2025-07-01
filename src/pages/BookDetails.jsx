// src/pages/BookDetails.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { motion } from 'framer-motion';
import './BookDetails.css';

const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);

  useEffect(() => {
    const fetchBook = async () => {
      const { data, error } = await supabase.from('books').select('*').eq('id', id).single();
      if (!error) setBook(data);
    };
    fetchBook();
  }, [id]);

  return (
    <div className="book-detail-wrapper">
      {book ? (
        <motion.div
          className="book-detail"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <img src={book.image_url} alt={book.title} />
          <div>
            <h2>{book.title}</h2>
            <p><strong>Author:</strong> {book.author}</p>
            <p><strong>Price:</strong> ₹{book.price}</p>
            <p><strong>Category:</strong> {book.category}</p>
            <p><strong>Contact:</strong> {book.contact_number}</p>
            <motion.button className="chat-btn" whileHover={{ scale: 1.05 }}>
              💬 Chat with Seller
            </motion.button>
          </div>
        </motion.div>
      ) : (
        <p>Loading book details...</p>
      )}
    </div>
  );
};

export default BookDetails;
