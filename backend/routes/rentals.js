const express = require('express');
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ message: 'Board game list endpoint' });
});

module.exports = router;
