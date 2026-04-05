const express = require('express');
const db = require('../config/db');
const auth = require('../middleware/auth');
const router = express.Router();

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
