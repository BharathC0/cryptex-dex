const express = require('express');
const db = require('../config/db');
const auth = require('../middleware/auth');
const router = express.Router();

// Get profile
router.get('/profile', auth, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, email, wallet_address, created_at FROM users WHERE id = ?', [req.user.userId]);
    if (!rows.length) return res.status(404).json({ error: 'User not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update wallet address
router.put('/wallet', auth, async (req, res) => {
  const { walletAddress } = req.body;
  try {
    await db.query('UPDATE users SET wallet_address = ? WHERE id = ?', [walletAddress, req.user.userId]);
    res.json({ success: true, walletAddress });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update wallet' });
  }
});

module.exports = router;
