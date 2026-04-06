import React from 'react';
import { Link } from 'react-router-dom';


function MainMenu() {
  return (
    <div className="animate-fade-in" style={{ textAlign: 'center', marginTop: '5vh' }}>
      <h1 style={{ fontSize: '4rem', marginBottom: '1rem' }}>Board Game Hub</h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginBottom: '3rem' }}>
        Your premium destination for card games and local board game rentals.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        
        <Link to="/game" className="glass-card" style={{ display: 'block', textDecoration: 'none' }}>
          <h2>🃏 Play Crazy 8</h2>
          <p style={{ color: 'var(--text-primary)', marginTop: '1rem' }}>
            Jump right into an intense match of Crazy 8 against our local AI.
          </p>
          <div className="btn-primary" style={{ marginTop: '2rem', width: '100%' }}>Play Now</div>
        </Link>
        
        <Link to="/borrow" className="glass-card" style={{ display: 'block', textDecoration: 'none' }}>
          <h2>🎲 Rent Games</h2>
          <p style={{ color: 'var(--text-primary)', marginTop: '1rem' }}>
            Browse our library of board games and rent them out instantly.
          </p>
          <div className="btn-primary" style={{ marginTop: '2rem', width: '100%' }}>Browse Library</div>
        </Link>
        
        <Link to="/login" className="glass-card" style={{ display: 'block', textDecoration: 'none' }}>
          <h2>👤 My Account</h2>
          <p style={{ color: 'var(--text-primary)', marginTop: '1rem' }}>
            Log in to manage your active rentals and save game records.
          </p>
          <div className="btn-primary" style={{ marginTop: '2rem', width: '100%' }}>Login</div>
        </Link>
        
      </div>
    </div>
  );
}

export default MainMenu;
