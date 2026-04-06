import React from 'react';

function Card({ suit, value, isHidden, onClick }) {
  if (isHidden) {
    return (
      <div className="card card-hidden">
        ?
      </div>
    );
  }

  // Red text for hearts and diamonds
  const isRed = suit === '♥' || suit === '♦';

  return (
    <div 
      className="card"
      onClick={onClick}
      style={{
        cursor: onClick ? 'pointer' : 'default',
        color: isRed ? '#ef4444' : 'black'
      }}
      onMouseOver={(e) => { if(onClick) e.currentTarget.style.transform = 'translateY(-10px)' }}
      onMouseOut={(e) => { if(onClick) e.currentTarget.style.transform = 'none' }}
    >
      {suit}{value}
    </div>
  );
}

export default Card;
