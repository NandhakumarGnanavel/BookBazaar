

// Updated App.js Routing
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import BuyBooks from './pages/BuyBooks';
import SellBooks from './pages/SellBooks';
import BookDetails from './pages/BookDetails';

import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
      
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/buy" element={<BuyBooks />} />
        <Route path="/sell" element={<SellBooks />} />
        <Route path="/book/:id" element={<BookDetails />} />
      </Routes>
    </Router>
  );
}

export default App;

