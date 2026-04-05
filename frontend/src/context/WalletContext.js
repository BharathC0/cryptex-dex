import React, { createContext, useContext, useState } from 'react';

const WalletContext = createContext();

const INITIAL_BALANCES = {
  USDT: { balance: 10000, locked: 0 },
  BTC: { balance: 0.2451, locked: 0 },
  ETH: { balance: 3.821, locked: 0 },
  BNB: { balance: 12.5, locked: 0 },
  SOL: { balance: 45.2, locked: 0 },
  ADA: { balance: 1200, locked: 0 },
  XRP: { balance: 5000, locked: 0 },
  DOGE: { balance: 15000, locked: 0 },
  MATIC: { balance: 800, locked: 0 },
  AVAX: { balance: 25, locked: 0 },
  LINK: { balance: 60, locked: 0 },
};

export function WalletProvider({ children }) {
  const [balances, setBalances] = useState(INITIAL_BALANCES);
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState('');
  const [orders, setOrders] = useState([]);
  const [txHistory, setTxHistory] = useState([]);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAddress(accounts[0]);
        setConnected(true);
        return accounts[0];
      } catch (err) {
        console.error('Wallet connection failed:', err);
      }
    } else {
      // Simulate wallet connection for demo
      const demoAddress = '0x' + Math.random().toString(16).slice(2, 42).padEnd(40, '0');
      setAddress(demoAddress);
      setConnected(true);
      return demoAddress;
    }
  };

  const disconnectWallet = () => {
    setConnected(false);
    setAddress('');
  };

  const placeOrder = (order) => {
    const newOrder = {
      id: Date.now(),
      ...order,
      status: 'open',
      filled: 0,
      timestamp: new Date().toISOString(),
    };
    setOrders(prev => [newOrder, ...prev]);

    // Simulate fill after 2-5 seconds
    setTimeout(() => {
      setOrders(prev => prev.map(o => o.id === newOrder.id ? { ...o, status: 'filled', filled: o.qty } : o));
      // Update balance
      setBalances(prev => {
        const updated = { ...prev };
        const [base, quote] = order.pair.split('/');
        if (order.side === 'buy') {
          const cost = order.qty * order.price;
          updated[quote] = { ...updated[quote], balance: +(updated[quote].balance - cost).toFixed(8) };
          updated[base] = { ...updated[base], balance: +(updated[base].balance + order.qty).toFixed(8) };
        } else {
          updated[base] = { ...updated[base], balance: +(updated[base].balance - order.qty).toFixed(8) };
          const earned = order.qty * order.price;
          updated[quote] = { ...updated[quote], balance: +(updated[quote].balance + earned).toFixed(8) };
        }
        return updated;
      });
      setTxHistory(prev => [{ ...newOrder, status: 'filled', time: new Date().toLocaleString() }, ...prev]);
    }, 2000 + Math.random() * 3000);

    return newOrder;
  };

  const swap = (fromToken, toToken, amount, rate) => {
    setBalances(prev => {
      const updated = { ...prev };
      updated[fromToken] = { ...updated[fromToken], balance: +(updated[fromToken].balance - amount).toFixed(8) };
      const received = amount * rate;
      if (!updated[toToken]) updated[toToken] = { balance: 0, locked: 0 };
      updated[toToken] = { ...updated[toToken], balance: +(updated[toToken].balance + received).toFixed(8) };
      return updated;
    });
    setTxHistory(prev => [{
      id: Date.now(), type: 'swap', from: fromToken, to: toToken,
      amount, received: amount * rate, status: 'completed', time: new Date().toLocaleString()
    }, ...prev]);
  };

  return (
    <WalletContext.Provider value={{ balances, connected, address, orders, txHistory, connectWallet, disconnectWallet, placeOrder, swap }}>
      {children}
    </WalletContext.Provider>
  );
}

export const useWallet = () => useContext(WalletContext);
