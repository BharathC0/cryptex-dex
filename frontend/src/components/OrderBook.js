import React from 'react';

export default function OrderBook({ orderBook, currentPrice, symbol }) {
  const { bids = [], asks = [] } = orderBook || {};
  const maxBid = Math.max(...bids.map(b => b.total), 1);
  const maxAsk = Math.max(...asks.map(a => a.total), 1);

  const Row = ({ item, side }) => {
    const pct = (item.total / (side === 'bid' ? maxBid : maxAsk)) * 100;
    const color = side === 'bid' ? 'var(--accent-green)' : 'var(--accent-red)';
    const bgColor = side === 'bid' ? 'rgba(14,203,129,0.08)' : 'rgba(246,70,93,0.08)';
    return (
      <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', padding: '2px 8px', cursor: 'pointer' }}
        onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
        <div style={{
          position: 'absolute', right: 0, top: 0, bottom: 0,
          width: `${pct}%`, background: bgColor, transition: 'width 0.3s',
        }} />
        <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color, position: 'relative', zIndex: 1, minWidth: '90px' }}>
          {item.price?.toLocaleString(undefined, { maximumFractionDigits: 4 })}
        </span>
        <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', position: 'relative', zIndex: 1, minWidth: '70px', textAlign: 'right' }}>
          {item.qty?.toFixed(4)}
        </span>
        <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', position: 'relative', zIndex: 1, minWidth: '80px', textAlign: 'right' }}>
          {item.total?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
        </span>
      </div>
    );
  };

  return (
    <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', padding: '16px', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <h3 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '12px', color: 'var(--text-secondary)' }}>Order Book</h3>
      {/* Headers */}
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 8px 8px', borderBottom: '1px solid var(--border)' }}>
        {['Price (USDT)', `Qty (${symbol})`, 'Total'].map(h => (
          <span key={h} style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>{h}</span>
        ))}
      </div>

      {/* Asks (sell orders - red) - reversed */}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column-reverse' }}>
        {asks.slice(0, 10).map((ask, i) => <Row key={i} item={ask} side="ask" />)}
      </div>

      {/* Spread */}
      <div style={{ padding: '8px', textAlign: 'center', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', margin: '4px 0' }}>
        <span style={{ fontSize: '16px', fontWeight: '800', fontFamily: 'var(--font-mono)', color: currentPrice >= asks[0]?.price ? 'var(--accent-green)' : 'var(--accent-red)' }}>
          {currentPrice?.toLocaleString(undefined, { maximumFractionDigits: 4 })}
        </span>
      </div>

      {/* Bids (buy orders - green) */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        {bids.slice(0, 10).map((bid, i) => <Row key={i} item={bid} side="bid" />)}
      </div>
    </div>
  );
}
