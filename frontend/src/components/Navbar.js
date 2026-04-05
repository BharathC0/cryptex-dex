import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { useMarket } from '../context/MarketContext';

export default function Navbar() {
  const { connected, address, connectWallet, disconnectWallet } = useWallet();
  const { prices } = useMarket();
  const [connecting, setConnecting] = useState(false);

  const handleConnect = async () => {
    setConnecting(true);
    await connectWallet();
    setConnecting(false);
  };

  const shortAddr = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';

  return (
    <nav style={{
      position: 'fixed', top: 0, left: '220px', right: 0, height: '64px',
      background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 24px', zIndex: 100, backdropFilter: 'blur(10px)',
    }}>
      {/* Ticker */}
      <div style={{ display: 'flex', gap: '24px', overflow: 'hidden' }}>
        {['BTC', 'ETH', 'BNB', 'SOL', 'DOGE'].map(sym => (
          <div key={sym} style={{ display: 'flex', flexDirection: 'column', minWidth: '80px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>{sym}/USDT</span>
            <span style={{
              fontSize: '13px', fontWeight: '700', fontFamily: 'var(--font-mono)',
              color: prices[sym]?.change >= 0 ? 'var(--accent-green)' : 'var(--accent-red)'
            }}>
              ${prices[sym]?.price?.toLocaleString(undefined, { maximumFractionDigits: 4 })}
            </span>
          </div>
        ))}
      </div>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {connected ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '8px', height: '8px', borderRadius: '50%',
              background: 'var(--accent-green)', boxShadow: '0 0 8px var(--accent-green)'
            }} />
            <span style={{ fontSize: '13px', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>{shortAddr}</span>
            <button onClick={disconnectWallet} style={{
              background: 'var(--accent-red-dim)', color: 'var(--accent-red)',
              border: '1px solid var(--accent-red)', borderRadius: 'var(--radius)',
              padding: '6px 12px', fontSize: '12px', fontWeight: '600'
            }}>Disconnect</button>
          </div>
        ) : (
          <button onClick={handleConnect} disabled={connecting} style={{
            background: 'var(--accent-yellow)', color: '#0b0e11',
            borderRadius: 'var(--radius)', padding: '8px 20px',
            fontSize: '13px', fontWeight: '700', letterSpacing: '0.5px',
            transition: 'all 0.2s', opacity: connecting ? 0.7 : 1,
          }}>
            {connecting ? 'Connecting...' : 'Connect Wallet'}
          </button>
        )}
      </div>
    </nav>
  );
}
