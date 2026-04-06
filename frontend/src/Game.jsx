import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Card from './components/Card';

const SUITS = ['♠', '♥', '♦', '♣'];
const VALUES = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

// Helpers
const generateDeck = () => {
  let deck = [];
  for (let s of SUITS) {
    for (let v of VALUES) {
      deck.push({ suit: s, value: v });
    }
  }
  // Shuffle
  return deck.sort(() => Math.random() - 0.5);
};

function Game() {
  const [deck, setDeck] = useState([]);
  const [playerHand, setPlayerHand] = useState([]);
  const [aiHand, setAiHand] = useState([]);
  const [discardPile, setDiscardPile] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState('player'); // 'player' | 'ai'
  const [declaredSuit, setDeclaredSuit] = useState(null); // When an 8 is played
  const [message, setMessage] = useState('');
  
  // Scoring / Wins
  const [isGameOver, setIsGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [score, setScore] = useState({ player: 0, ai: 0 });

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    let newDeck = generateDeck();
    let pHand = newDeck.splice(0, 5);
    let aHand = newDeck.splice(0, 5);
    
    // Ensure the first discard isn't an 8 (for simplicity)
    let firstCard = newDeck.splice(0, 1)[0];
    while (firstCard.value === '8') {
      newDeck.push(firstCard);
      firstCard = newDeck.splice(0, 1)[0];
    }

    setDeck(newDeck);
    setPlayerHand(pHand);
    setAiHand(aHand);
    setDiscardPile([firstCard]);
    setCurrentPlayer('player');
    setDeclaredSuit(firstCard.suit);
    setMessage('Your turn! Play a matching suit, value, or an 8.');
    setIsGameOver(false);
    setWinner(null);
  };

  const checkWinCondition = (pHand, aHand) => {
    if (pHand.length === 0) {
      endGame('player');
      return true;
    } else if (aHand.length === 0) {
      endGame('ai');
      return true;
    }
    return false;
  };

  const endGame = async (win) => {
    setIsGameOver(true);
    setWinner(win);
    setMessage(win === 'player' ? '🎉 You won the game!' : '😞 The AI won this time.');
    setScore(prev => ({ ...prev, [win]: prev[win] + 1 }));

    try {
      await fetch('/api/games/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ winner: win, timestamp: new Date() })
      });
    } catch (e) {
      console.error('Failed to save game to backend', e);
    }
  };

  const canPlayCard = (card, topCard, currentDeclaredSuit) => {
    if (card.value === '8') return true;
    if (card.value === topCard.value) return true;
    if (card.suit === currentDeclaredSuit) return true;
    return false;
  };

  // ----- Player Actions -----
  const playPlayerCard = (idx) => {
    if (currentPlayer !== 'player' || isGameOver) return;
    
    const card = playerHand[idx];
    const topCard = discardPile[0];

    if (!canPlayCard(card, topCard, declaredSuit)) {
      setMessage('Invalid move! Must match suit, value, or play an 8.');
      return;
    }

    const newHand = [...playerHand];
    newHand.splice(idx, 1);
    
    let nextDeclaredSuit = card.suit;
    if (card.value === '8') {
      // In a real game you'd show a prompt to pick a suit. For now, we auto-pick the suit of the next card in hand, or default.
      const suitsCount = { '♠':0, '♥':0, '♦':0, '♣':0 };
      newHand.forEach(c => suitsCount[c.suit]++);
      nextDeclaredSuit = Object.keys(suitsCount).reduce((a, b) => suitsCount[a] > suitsCount[b] ? a : b) || '♠';
      setMessage(`You played an 8 and changed the suit to ${nextDeclaredSuit}`);
    } else {
      setMessage('You played a card. AI is thinking...');
    }

    setPlayerHand(newHand);
    setDiscardPile([card, ...discardPile]);
    setDeclaredSuit(nextDeclaredSuit);
    
    if (!checkWinCondition(newHand, aiHand)) {
      setCurrentPlayer('ai');
    }
  };

  const drawPlayerCard = () => {
    if (currentPlayer !== 'player' || isGameOver) return;
    if (deck.length === 0) {
      setMessage('The deck is empty! Turn skipped.');
      setCurrentPlayer('ai');
      return;
    }
    
    const newDeck = [...deck];
    const card = newDeck.splice(0, 1)[0];
    
    setPlayerHand([...playerHand, card]);
    setDeck(newDeck);
    setMessage('You drew a card. AI is thinking...');
    setCurrentPlayer('ai');
  };


  // ----- AI Logic -----
  useEffect(() => {
    if (currentPlayer === 'ai' && !isGameOver) {
      const timer = setTimeout(() => {
        takeAITurn();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [currentPlayer, isGameOver]);

  const takeAITurn = () => {
    const topCard = discardPile[0];
    
    // Smart AI logic prioritizing 8s and best suit matching
    let cardToPlayIdx = -1;

    // 1. Prioritize playing an 8 aggressively if requested by user logic
    const idx8 = aiHand.findIndex(c => c.value === '8');
    
    if (idx8 !== -1) {
       cardToPlayIdx = idx8;
    } else {
       // 2. Otherwise find the first matching card
       cardToPlayIdx = aiHand.findIndex(c => canPlayCard(c, topCard, declaredSuit));
    }

    const newHand = [...aiHand];

    if (cardToPlayIdx !== -1) {
      const card = newHand.splice(cardToPlayIdx, 1)[0];
      
      let nextDeclaredSuit = card.suit;
      if (card.value === '8') {
        const suitsCount = { '♠':0, '♥':0, '♦':0, '♣':0 };
        newHand.forEach(c => suitsCount[c.suit]++);
        nextDeclaredSuit = Object.keys(suitsCount).reduce((a, b) => suitsCount[a] > suitsCount[b] ? a : b) || '♠';
        setMessage(`AI played an 8 and changed suit to ${nextDeclaredSuit}. Your turn!`);
      } else {
        setMessage('AI played a card. Your turn!');
      }

      setAiHand(newHand);
      setDiscardPile([card, ...discardPile]);
      setDeclaredSuit(nextDeclaredSuit);
      
      if (!checkWinCondition(playerHand, newHand)) {
        setCurrentPlayer('player');
      }
    } else {
      // Must draw
      if (deck.length > 0) {
        const newDeck = [...deck];
        const card = newDeck.splice(0, 1)[0];
        setAiHand([...newHand, card]);
        setDeck(newDeck);
        setMessage('AI drew a card. Your turn!');
      } else {
        setMessage('Deck is empty! AI skipped. Your turn!');
      }
      setCurrentPlayer('player');
    }
  };

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2>🃏 Crazy 8 Arena</h2>
        <div style={{ background: 'rgba(0,0,0,0.5)', padding: '0.5rem 1rem', borderRadius: '8px' }}>
          Score - Player: <span style={{color: 'var(--success)'}}>{score.player}</span> | AI: <span style={{color: 'var(--danger)'}}>{score.ai}</span>
        </div>
        <Link to="/" className="btn-secondary">Back to Menu</Link>
      </div>
      
      {/* AI Hand */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <p style={{ color: 'var(--text-secondary)' }}>AI Opponent ({aiHand.length} cards)</p>
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', opacity: 0.8 }}>
          {aiHand.map((_, idx) => (
             <Card key={idx} isHidden={true} />
          ))}
        </div>
      </div>

      {/* Discard Pile and Deck */}
      <div className={`glass-card ${currentPlayer === 'ai' && !isGameOver ? 'ai-thinking' : ''}`} style={{ textAlign: 'center', marginBottom: '2rem', padding: '3rem' }}>
        <h3 style={{ color: isGameOver ? (winner === 'player' ? 'var(--success)' : 'var(--danger)') : 'var(--accent-color)', height: '2rem' }}>
          {message}
        </h3>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', margin: '2rem 0' }}>
          <div>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>Deck ({deck.length})</p>
            <div onClick={drawPlayerCard} style={{cursor: currentPlayer === 'player' && !isGameOver ? 'pointer' : 'default'}}>
               <Card isHidden={true} />
            </div>
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Pile (Suit: <strong>{declaredSuit}</strong>)
            </p>
            {discardPile.length > 0 && (
              <Card suit={discardPile[0].suit} value={discardPile[0].value} />
            )}
          </div>
        </div>

        {isGameOver && (
          <button onClick={startNewGame} className="btn-primary" style={{ marginTop: '1rem' }}>
            Play Again
          </button>
        )}
      </div>

      {/* Player Hand */}
      <div className="glass-card">
        <h3>Your Hand</h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
          {playerHand.map((card, idx) => (
            <Card 
              key={idx} 
              suit={card.suit} 
              value={card.value} 
              onClick={() => playPlayerCard(idx)} 
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Game;
