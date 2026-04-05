const express = require('express');
const db = require('../config/db');
const auth = require('../middleware/auth');
const router = express.Router();

// Get balances
router.get('/balances', auth, async (req, res) => {
  const [rows] = await db.query('SELECT token, balance, locked FROM balances WHERE user_id = ?', [req.user.userId]);
  const balances = {};
  rows.forEach(r => { balances[r.token] = { balance: parseFloat(r.balance), locked: parseFloat(r.locked) }; });
  res.json(balances);
});

// Get transactions
router.get('/transactions', auth, async (req, res) => {
  const [rows] = await db.query('SELECT * FROM transactions WHERE user_id = ? ORDER BY created_at DESC LIMIT 50', [req.user.userId]);
  res.json(rows);
});

// Swap tokens
router.post('/swap', auth, async (req, res) => {
  const { fromToken, toToken, amount, rate } = req.body;
  const userId = req.user.userId;
  const received = amount * rate;
  const fee = amount * 0.003;
  try {
    await db.query('UPDATE balances SET balance = balance - ? WHERE user_id = ? AND token = ?', [amount, userId, fromToken]);
    await db.query('INSERT INTO balances (user_id, token, balance) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE balance = balance + ?',
      [userId, toToken, received, received]);
    await db.query('INSERT INTO transactions (user_id, type, from_token, to_token, amount, received, fee) VALUES (?, "swap", ?, ?, ?, ?, ?)',
      [userId, fromToken, toToken, amount, received, fee]);
    res.json({ success: true, fromToken, toToken, amount, received, fee });
  } catch (err) {
    res.status(500).json({ error: 'Swap failed' });
  }
});

module.exports = router;
