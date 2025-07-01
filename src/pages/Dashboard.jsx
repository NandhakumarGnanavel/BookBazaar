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
