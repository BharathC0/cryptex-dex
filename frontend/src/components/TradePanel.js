import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { useMarket } from '../context/MarketContext';

export default function TradePanel({ symbol = 'BTC' }) {
  const { balances, placeOrder, connected, connectWallet } = useWallet();
  const { prices } = useMarket();
  const [side, setSide] = useState('buy');
  const [orderType, setOrderType] = useState('market');
  const [qty, setQty] = useState('');
  const [limitPrice, setLimitPrice] = useState('');
  const [pct, setPct] = useState(0);
  const [status, setStatus] = useState(null);

  const currentPrice = prices[symbol]?.price || 0;
  const quoteBalance = balances['USDT']?.balance || 0;
  const baseBalance = balances[symbol]?.balance || 0;
  const execPrice = orderType === 'market' ? currentPrice : (parseFloat(limitPrice) || currentPrice);
  const total = (parseFloat(qty) || 0) * execPrice;

  const setPercent = (p) => {
    setPct(p);
    if (side === 'buy') {
      const maxQty = (quoteBalance * p / 100) / execPrice;
      setQty(maxQty.toFixed(6));
    } else {
      setQty((baseBalance * p / 100).toFixed(6));
    }
  };

  const handleSubmit = async () => {
    if (!connected) { await connectWallet(); return; }
    if (!qty || parseFloat(qty) <= 0) { setStatus({ type: 'error', msg: 'Enter valid quantity' }); return; }

    const order = {
      pair: `${symbol}/USDT`,
      side,
      type: orderType,
      qty: parseFloat(qty),
      price: execPrice,
      total,
      symbol,
    };

    placeOrder(order);
    setStatus({ type: 'success', msg: `${side.toUpperCase()} order placed: ${qty} ${symbol}` });
    setQty('');
    setPct(0);
    setTimeout(() => setStatus(null), 3000);
  };

  const btnColor = side === 'buy' ? 'var(--accent-green)' : 'var(--accent-red)';
  const btnBg = side === 'buy' ? 'var(--accent-green-dim)' : 'var(--accent-red-dim)';

  return (
    <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', padding: '20px' }}>
      {/* Buy/Sell tabs */}
      <div style={{ display: 'flex', marginBottom: '20px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius)', padding: '4px' }}>
        {['buy', 'sell'].map(s => (
          <button key={s} onClick={() => setSide(s)} style={{
            flex: 1, padding: '10px', borderRadius: '6px', fontSize: '14px', fontWeight: '700',
            background: side === s ? (s === 'buy' ? 'var(--accent-green)' : 'var(--accent-red)') : 'transparent',
            color: side === s ? '#fff' : 'var(--text-secondary)',
            textTransform: 'uppercase', letterSpacing: '1px', transition: 'all 0.2s',
          }}>{s}</button>
        ))}
      </div>

      {/* Order type */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        {['market', 'limit'].map(t => (
          <button key={t} onClick={() => setOrderType(t)} style={{
            padding: '6px 14px', borderRadius: 'var(--radius)', fontSize: '12px', fontWeight: '600',
            background: orderType === t ? 'var(--bg-hover)' : 'transparent',
            color: orderType === t ? 'var(--text-primary)' : 'var(--text-muted)',
            border: `1px solid ${orderType === t ? 'var(--border-light)' : 'transparent'}`,
            textTransform: 'capitalize',
          }}>{t}</button>
        ))}
      </div>

      {/* Balance display */}
      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '12px', display: 'flex', justifyContent: 'space-between' }}>
        <span>Available:</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '600', color: 'var(--text-primary)' }}>
          {side === 'buy' ? `${quoteBalance.toFixed(2)} USDT` : `${baseBalance.toFixed(6)} ${symbol}`}
        </span>
      </div>

      {/* Limit Price Input */}
      {orderType === 'limit' && (
        <div style={{ marginBottom: '12px' }}>
          <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Price (USDT)</label>
          <input value={limitPrice} onChange={e => setLimitPrice(e.target.value)} placeholder={currentPrice.toFixed(2)} type="number"
            style={{
              width: '100%', background: 'var(--bg-secondary)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius)', padding: '10px 12px', color: 'var(--text-primary)',
              fontSize: '14px', fontFamily: 'var(--font-mono)', transition: 'border 0.2s',
            }}
            onFocus={e => e.target.style.borderColor = btnColor}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
          />
        </div>
      )}

      {/* Quantity Input */}
      <div style={{ marginBottom: '12px' }}>
        <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Quantity ({symbol})</label>
        <input value={qty} onChange={e => setQty(e.target.value)} placeholder="0.00000000" type="number"
          style={{
            width: '100%', background: 'var(--bg-secondary)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius)', padding: '10px 12px', color: 'var(--text-primary)',
            fontSize: '14px', fontFamily: 'var(--font-mono)',
          }}
          onFocus={e => e.target.style.borderColor = btnColor}
          onBlur={e => e.target.style.borderColor = 'var(--border)'}
        />
      </div>

      {/* Percentage slider */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '16px' }}>
        {[25, 50, 75, 100].map(p => (
          <button key={p} onClick={() => setPercent(p)} style={{
            flex: 1, padding: '6px 0', fontSize: '11px', fontWeight: '600',
            background: pct === p ? btnBg : 'var(--bg-secondary)',
            color: pct === p ? btnColor : 'var(--text-muted)',
            border: `1px solid ${pct === p ? btnColor : 'var(--border)'}`,
            borderRadius: '6px', transition: 'all 0.15s',
          }}>{p}%</button>
        ))}
      </div>

      {/* Total */}
      <div style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--radius)', padding: '10px 12px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Total (USDT)</span>
        <span style={{ fontSize: '14px', fontFamily: 'var(--font-mono)', fontWeight: '700', color: 'var(--text-primary)' }}>
          ${total.toLocaleString(undefined, { maximumFractionDigits: 2 })}
        </span>
      </div>

      {/* Submit button */}
      <button onClick={handleSubmit} style={{
        width: '100%', padding: '14px', borderRadius: 'var(--radius)', fontWeight: '800',
        fontSize: '15px', letterSpacing: '1px', textTransform: 'uppercase',
        background: side === 'buy' ? 'var(--accent-green)' : 'var(--accent-red)',
        color: '#fff', transition: 'all 0.2s',
        boxShadow: `0 4px 20px ${side === 'buy' ? 'rgba(14,203,129,0.3)' : 'rgba(246,70,93,0.3)'}`,
      }}
        onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
      >
        {!connected ? '🔌 Connect Wallet' : `${side === 'buy' ? 'Buy' : 'Sell'} ${symbol}`}
      </button>

      {/* Status */}
      {status && (
        <div style={{
          marginTop: '12px', padding: '10px 12px', borderRadius: 'var(--radius)', fontSize: '13px', fontWeight: '600',
          background: status.type === 'success' ? 'var(--accent-green-dim)' : 'var(--accent-red-dim)',
          color: status.type === 'success' ? 'var(--accent-green)' : 'var(--accent-red)',
          border: `1px solid ${status.type === 'success' ? 'var(--accent-green)' : 'var(--accent-red)'}`,
        }}>{status.msg}</div>
      )}
    </div>
  );
}
