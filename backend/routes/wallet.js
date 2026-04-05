const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'cryptex_secret_2024';

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try { req.user = jwt.verify(token, JWT_SECRET); next(); }
  catch { res.status(401).json({ error: 'Invalid token' }); }
};

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
