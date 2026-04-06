const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
const gameRoutes = require('./routes/games');
const rentalRoutes = require('./routes/rentals');

app.use('/api/auth', authRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/rentals', rentalRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
