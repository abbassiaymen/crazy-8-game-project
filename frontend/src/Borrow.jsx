import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const INITIAL_GAMES = [
  { id: 1, title: 'Catan', description: 'Trade, build, and settle.', availability: 3 },
  { id: 2, title: 'Ticket to Ride', description: 'Cross-country train adventure.', availability: 1 },
  { id: 3, title: 'Pandemic', description: 'Save the world from outbreaks.', availability: 0 },
];

function Borrow() {
  const [games, setGames] = useState(INITIAL_GAMES);
  const [orderedGames, setOrderedGames] = useState([]);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const savedGames = localStorage.getItem('gamesList');
    const savedOrders = localStorage.getItem('orderedList');
    if (savedGames) {
      setGames(JSON.parse(savedGames));
    }
    if (savedOrders) {
      setOrderedGames(JSON.parse(savedOrders));
    }
  }, []);

  const saveState = (newGames, newOrders) => {
    localStorage.setItem('gamesList', JSON.stringify(newGames));
    localStorage.setItem('orderedList', JSON.stringify(newOrders));
  };

  const handleOrder = (game) => {
    if (game.availability > 0) {
      const updatedGames = games.map(g => 
        g.id === game.id ? { ...g, availability: g.availability - 1 } : g
      );
      const updatedOrders = [...orderedGames, game];
      
      setGames(updatedGames);
      setOrderedGames(updatedOrders);
      saveState(updatedGames, updatedOrders);
      
      showMessage(`Success: You ordered ${game.title}!`, 'success');
    } else {
      showMessage(`Error: ${game.title} is currently out of stock.`, 'error');
    }
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>🎲 Board Game Library</h2>
        <Link to="/" className="btn-secondary">Back to Menu</Link>
      </div>

      {message && (
        <div style={{
          padding: '1rem',
          marginBottom: '1.5rem',
          borderRadius: '8px',
          backgroundColor: message.type === 'success' ? '#10b981' : '#ef4444',
          color: 'white',
          fontWeight: 'bold',
          textAlign: 'center',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          {message.text}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
        {games.map(game => (
          <div key={game.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ marginBottom: '0.5rem' }}>{game.title}</h3>
            <p style={{ color: 'var(--text-secondary)', flexGrow: 1 }}>{game.description}</p>
            
            <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ 
                padding: '6px 10px', borderRadius: '4px', fontSize: '0.9rem', fontWeight: 'bold',
                backgroundColor: game.availability > 0 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                color: game.availability > 0 ? 'var(--success)' : 'var(--danger)'
              }}>
                Availability: {game.availability}
              </span>
              
              <button 
                className={game.availability > 0 ? 'btn-primary' : 'btn-secondary'}
                onClick={() => handleOrder(game)}
                style={{ padding: '0.6rem 1.2rem', opacity: game.availability === 0 ? 0.6 : 1, cursor: game.availability === 0 ? 'not-allowed' : 'pointer'}}
              >
                Order
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Ordered Games Section */}
      <div style={{ 
        marginTop: '3rem', 
        padding: '2rem', 
        backgroundColor: '#10b981', /* Green section */
        borderRadius: '12px',
        boxShadow: '0 8px 16px rgba(16, 185, 129, 0.2)'
      }}>
        <h3 style={{ color: 'white', fontWeight: 'bold', marginBottom: '1rem', fontSize: '1.5rem' }}>
          ✅ Your Ordered Games
        </h3>
        
        {orderedGames.length === 0 ? (
          <p style={{ color: 'white', fontWeight: 'bold', fontSize: '1.1rem' }}>
            You haven't ordered any games yet.
          </p>
        ) : (
          <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem' }}>
            {orderedGames.map((item, index) => (
              <li key={index} style={{ 
                color: 'white', 
                fontWeight: 'bold', /* White bold text */
                fontSize: '1.2rem',
                marginBottom: '0.5rem'
              }}>
                {item.title}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Borrow;
