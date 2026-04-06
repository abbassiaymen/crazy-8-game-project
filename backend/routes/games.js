const express = require('express');
const router = express.Router();

let gameLogs = []; // Temporary in-memory store. Replace with real DB model.

router.get('/state', (req, res) => {
  res.json({ message: 'Game state endpoint' });
});

router.post('/save', (req, res) => {
  const { winner, timestamp } = req.body;
  if (!winner) {
    return res.status(400).json({ error: 'Winner is required' });
  }

  const logEntry = {
    id: gameLogs.length + 1,
    winner,
    timestamp: timestamp || new Date()
  };

  gameLogs.push(logEntry);
  console.log(`[API Log] Game saved: Winner = ${winner}`);

  res.status(201).json({ success: true, log: logEntry });
});

module.exports = router;
