import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav style={{ padding: '1rem 2rem', borderBottom: '1px solid var(--card-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', textDecoration: 'none' }}>
        Board Game Hub
      </Link>
      <div>
        <Link to="/game" style={{ marginRight: '1rem' }}>Play Crazy 8</Link>
        <Link to="/borrow" style={{ marginRight: '1rem' }}>Rentals</Link>
        <Link to="/login" className="btn-secondary" style={{ padding: '0.5rem 1rem' }}>Login</Link>
      </div>
    </nav>
  );
}

export default Navbar;
