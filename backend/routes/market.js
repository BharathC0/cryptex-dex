const express = require('express');
const router = express.Router();

const PRICES = {
  BTC: { price: 67432.50, change: 2.34, volume: '28.4B', mcap: '1.32T', name: 'Bitcoin' },
  ETH: { price: 3521.80, change: -1.12, volume: '14.2B', mcap: '423B', name: 'Ethereum' },
  BNB: { price: 412.30, change: 0.87, volume: '1.8B', mcap: '63B', name: 'BNB' },
  SOL: { price: 178.45, change: 4.21, volume: '3.1B', mcap: '82B', name: 'Solana' },
  ADA: { price: 0.4521, change: -2.34, volume: '512M', mcap: '16B', name: 'Cardano' },
  XRP: { price: 0.6234, change: 1.56, volume: '1.2B', mcap: '35B', name: 'Ripple' },
  DOGE: { price: 0.1823, change: 5.67, volume: '2.3B', mcap: '26B', name: 'Dogecoin' },
  MATIC: { price: 1.023, change: -0.45, volume: '445M', mcap: '10B', name: 'Polygon' },
  AVAX: { price: 38.92, change: 3.12, volume: '678M', mcap: '16B', name: 'Avalanche' },
  LINK: { price: 18.34, change: -1.89, volume: '334M', mcap: '11B', name: 'Chainlink' },
};

// Get all prices
router.get('/prices', (req, res) => {
  const updated = {};
  Object.entries(PRICES).forEach(([sym, data]) => {
    const drift = (Math.random() - 0.498) * data.price * 0.002;
    updated[sym] = { ...data, price: +(data.price + drift).toFixed(4) };
  });
  res.json(updated);
});

// Get single token price
router.get('/price/:symbol', (req, res) => {
  const sym = req.params.symbol.toUpperCase();
  if (!PRICES[sym]) return res.status(404).json({ error: 'Token not found' });
  const drift = (Math.random() - 0.498) * PRICES[sym].price * 0.002;
  res.json({ ...PRICES[sym], price: +(PRICES[sym].price + drift).toFixed(4) });
});

module.exports = router;
