const express = require('express');
const router = express.Router();

// Temporary in-memory user storage
let users = [];

// REGISTER
router.post('/register', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({ success: false, message: "Email and password are required" });
  }

  const exists = users.find(u => u.email === email);
  if (exists) {
    return res.json({ success: false, message: "User already exists" });
  }

  users.push({ email, password });
  res.json({ success: true, message: "Registration successful!" });
});

// LOGIN
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    return res.json({ success: false, message: "Invalid email or password" });
  }

  res.json({ success: true, message: "Successful sign in!" });
});

module.exports = router;
