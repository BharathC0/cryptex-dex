import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const MarketContext = createContext();

const INITIAL_PRICES = {
  BTC: { price: 67432.50, change: 2.34, volume: '28.4B', mcap: '1.32T', symbol: 'BTC', name: 'Bitcoin', color: '#f0b90b' },
  ETH: { price: 3521.80, change: -1.12, volume: '14.2B', mcap: '423B', symbol: 'ETH', name: 'Ethereum', color: '#627eea' },
  BNB: { price: 412.30, change: 0.87, volume: '1.8B', mcap: '63B', symbol: 'BNB', name: 'BNB', color: '#f0b90b' },
  SOL: { price: 178.45, change: 4.21, volume: '3.1B', mcap: '82B', symbol: 'SOL', name: 'Solana', color: '#9945ff' },
  ADA: { price: 0.4521, change: -2.34, volume: '512M', mcap: '16B', symbol: 'ADA', name: 'Cardano', color: '#0033ad' },
  XRP: { price: 0.6234, change: 1.56, volume: '1.2B', mcap: '35B', symbol: 'XRP', name: 'Ripple', color: '#00aae4' },
  DOGE: { price: 0.1823, change: 5.67, volume: '2.3B', mcap: '26B', symbol: 'DOGE', name: 'Dogecoin', color: '#c2a633' },
  MATIC: { price: 1.023, change: -0.45, volume: '445M', mcap: '10B', symbol: 'MATIC', name: 'Polygon', color: '#8247e5' },
  AVAX: { price: 38.92, change: 3.12, volume: '678M', mcap: '16B', symbol: 'AVAX', name: 'Avalanche', color: '#e84142' },
  LINK: { price: 18.34, change: -1.89, volume: '334M', mcap: '11B', symbol: 'LINK', name: 'Chainlink', color: '#2a5ada' },
};

function generateCandles(basePrice, count = 50) {
  const candles = [];
  let price = basePrice * 0.85;
  const now = Date.now();
  for (let i = count; i >= 0; i--) {
    const open = price;
    const change = (Math.random() - 0.48) * price * 0.025;
    const close = open + change;
    const high = Math.max(open, close) + Math.random() * price * 0.01;
    const low = Math.min(open, close) - Math.random() * price * 0.01;
    const volume = Math.random() * 1000000 + 500000;
    candles.push({
      time: new Date(now - i * 3600000).toISOString(),
      open: +open.toFixed(2),
      high: +high.toFixed(2),
      low: +low.toFixed(2),
      close: +close.toFixed(2),
      volume: +volume.toFixed(0),
    });
    price = close;
  }
  return candles;
}

function generateOrderBook(price) {
  const bids = [], asks = [];
  for (let i = 0; i < 15; i++) {
    const bidPrice = price - (i + 1) * price * 0.001 - Math.random() * price * 0.0005;
    const askPrice = price + (i + 1) * price * 0.001 + Math.random() * price * 0.0005;
    bids.push({ price: +bidPrice.toFixed(2), qty: +(Math.random() * 5 + 0.01).toFixed(4), total: +(bidPrice * (Math.random() * 5 + 0.01)).toFixed(2) });
    asks.push({ price: +askPrice.toFixed(2), qty: +(Math.random() * 5 + 0.01).toFixed(4), total: +(askPrice * (Math.random() * 5 + 0.01)).toFixed(2) });
  }
  return { bids, asks };
}

export function MarketProvider({ children }) {
  const [prices, setPrices] = useState(INITIAL_PRICES);
  const [selectedPair, setSelectedPair] = useState('BTC');
  const [candleData, setCandleData] = useState(() => generateCandles(INITIAL_PRICES.BTC.price));
  const [orderBook, setOrderBook] = useState(() => generateOrderBook(INITIAL_PRICES.BTC.price));
  const [trades, setTrades] = useState([]);

  // Simulate live price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setPrices(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(sym => {
          const drift = (Math.random() - 0.498) * updated[sym].price * 0.002;
          const newPrice = +(updated[sym].price + drift).toFixed(sym === 'BTC' || sym === 'ETH' ? 2 : 4);
          updated[sym] = { ...updated[sym], price: newPrice };
        });
        return updated;
      });
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  // Update candle + orderbook when pair changes
  useEffect(() => {
    if (prices[selectedPair]) {
      setCandleData(generateCandles(prices[selectedPair].price));
      setOrderBook(generateOrderBook(prices[selectedPair].price));
    }
  }, [selectedPair]);

  // Live candle tick
  useEffect(() => {
    const interval = setInterval(() => {
      const price = prices[selectedPair]?.price;
      if (!price) return;
      setCandleData(prev => {
        const last = prev[prev.length - 1];
        const newClose = +(price + (Math.random() - 0.5) * price * 0.001).toFixed(2);
        const updated = [...prev.slice(-49), {
          ...last,
          close: newClose,
          high: Math.max(last.high, newClose),
          low: Math.min(last.low, newClose),
        }];
        return updated;
      });
      setOrderBook(generateOrderBook(price));
      // Random trade
      setTrades(prev => [{
        price: +(price + (Math.random() - 0.5) * price * 0.001).toFixed(2),
        qty: +(Math.random() * 2).toFixed(4),
        side: Math.random() > 0.5 ? 'buy' : 'sell',
        time: new Date().toLocaleTimeString(),
      }, ...prev.slice(0, 29)]);
    }, 2000);
    return () => clearInterval(interval);
  }, [selectedPair, prices]);

  return (
    <MarketContext.Provider value={{ prices, selectedPair, setSelectedPair, candleData, orderBook, trades, COINS: Object.keys(prices) }}>
      {children}
    </MarketContext.Provider>
  );
}

export const useMarket = () => useContext(MarketContext);
