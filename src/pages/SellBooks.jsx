import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import './SellBooks.css';

const SellBooks = () => {
  const [form, setForm] = useState({
    title: '',
    author: '',
    price: '',
    category: '',
    contact: '',
    image: null,
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({ ...form, [name]: files ? files[0] : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const imageName = `${Date.now()}_${form.image.name}`;
    const { error: uploadError } = await supabase.storage
      .from('book-images')
      .upload(imageName, form.image);

    if (uploadError) return setMessage('Image upload failed');

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const publicUrl = supabase.storage
      .from('book-images')
      .getPublicUrl(imageName).data.publicUrl;

    const { error: insertError } = await supabase.from('books').insert([
      {
        title: form.title,
        author: form.author,
        price: form.price,
        category: form.category,
        contact_number: form.contact,
        image_url: publicUrl,
        user_id: user?.id,
      },
    ]);

    if (insertError) setMessage('Error adding book');
    else setMessage('Book added successfully!');
  };

  return (
    <div className="sell-wrapper">
      <h2>Sell Your Book</h2>
      <form className="sell-form" onSubmit={handleSubmit}>
        <input type="text" name="title" placeholder="Book Title" required onChange={handleChange} />
        <input type="text" name="author" placeholder="Author" required onChange={handleChange} />
        <input type="number" name="price" placeholder="Price" required onChange={handleChange} />
        <input type="text" name="category" placeholder="Category" onChange={handleChange} />
        <input type="text" name="contact" placeholder="Your Contact Number" required onChange={handleChange} />
        <input type="file" name="image" accept="image/*" required onChange={handleChange} />
        <button type="submit">Add Book</button>
        <p>{message}</p>
      </form>
    </div>
  );
};

export default SellBooks;
