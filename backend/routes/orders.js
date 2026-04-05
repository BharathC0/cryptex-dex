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

// Place order
router.post('/', auth, async (req, res) => {
  const { pair, side, type, qty, price } = req.body;
  const userId = req.user.userId;
  try {
    const [result] = await db.query(
      'INSERT INTO orders (user_id, pair, side, type, qty, price) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, pair, side, type, qty, price]
    );
    // Simulate fill
    setTimeout(async () => {
      await db.query('UPDATE orders SET status = "filled", filled = qty WHERE id = ?', [result.insertId]);
    }, 3000);
    res.json({ orderId: result.insertId, status: 'open', pair, side, type, qty, price });
  } catch (err) {
    res.status(500).json({ error: 'Order placement failed' });
  }
});

// Get user orders
router.get('/', auth, async (req, res) => {
  const [rows] = await db.query('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC LIMIT 50', [req.user.userId]);
  res.json(rows);
});

module.exports = router;
