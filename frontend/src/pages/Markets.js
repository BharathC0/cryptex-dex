import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMarket } from '../context/MarketContext';

export default function Markets() {
  const { prices } = useMarket();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('mcap');
  const [sortDir, setSortDir] = useState('desc');

  const filtered = Object.entries(prices)
    .filter(([sym, info]) =>
      sym.toLowerCase().includes(search.toLowerCase()) ||
      info.name.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      let va = a[1], vb = b[1];
      const field = sort === 'price' ? 'price' : sort === 'change' ? 'change' : 'price';
      const diff = (vb[field] || 0) - (va[field] || 0);
      return sortDir === 'desc' ? diff : -diff;
    });

  const toggleSort = (col) => {
    if (sort === col) setSortDir(d => d === 'desc' ? 'asc' : 'desc');
    else { setSort(col); setSortDir('desc'); }
  };

  const Th = ({ col, label }) => (
    <th onClick={() => toggleSort(col)} style={{
      padding: '12px 16px', textAlign: col === 'name' ? 'left' : 'right',
      fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600', cursor: 'pointer',
      background: sort === col ? 'var(--bg-hover)' : 'transparent',
      userSelect: 'none', whiteSpace: 'nowrap',
    }}>
      {label} {sort === col ? (sortDir === 'desc' ? '↓' : '↑') : ''}
    </th>
  );

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800' }}>Markets</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>Live prices for all listed tokens</p>
        </div>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search token..."
          style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)',
            padding: '10px 16px', color: 'var(--text-primary)', fontSize: '14px', width: '220px',
          }}
          onFocus={e => e.target.style.borderColor = 'var(--accent-yellow)'}
          onBlur={e => e.target.style.borderColor = 'var(--border)'}
        />
      </div>

      <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: 'var(--bg-secondary)' }}>
            <tr>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>#</th>
              <Th col="name" label="Token" />
              <Th col="price" label="Price" />
              <Th col="change" label="24h %" />
              <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>Volume</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>Market Cap</th>
              <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(([sym, info], idx) => {
              const pos = info.change >= 0;
              return (
                <tr key={sym} style={{ borderTop: '1px solid var(--border)', transition: 'background 0.15s', cursor: 'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  onClick={() => navigate(`/trade/${sym}-USDT`)}>
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: 'var(--text-muted)' }}>{idx + 1}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: (info.color || '#888') + '25', border: `1px solid ${info.color || '#888'}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '800', color: info.color || '#888' }}>
                        {sym[0]}
                      </div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: '700' }}>{sym}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{info.name}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: '14px', fontWeight: '700' }}>
                    ${info.price?.toLocaleString(undefined, { maximumFractionDigits: info.price > 1 ? 2 : 6 })}
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                    <span style={{ fontSize: '13px', fontWeight: '700', fontFamily: 'var(--font-mono)', padding: '4px 10px', borderRadius: '20px', background: pos ? 'var(--accent-green-dim)' : 'var(--accent-red-dim)', color: pos ? 'var(--accent-green)' : 'var(--accent-red)' }}>
                      {pos ? '+' : ''}{info.change?.toFixed(2)}%
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text-secondary)' }}>${info.volume}</td>
                  <td style={{ padding: '14px 16px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text-secondary)' }}>${info.mcap}</td>
                  <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                    <button onClick={e => { e.stopPropagation(); navigate(`/trade/${sym}-USDT`); }} style={{
                      padding: '6px 16px', background: 'var(--accent-yellow-dim)', color: 'var(--accent-yellow)',
                      border: '1px solid var(--accent-yellow)', borderRadius: 'var(--radius)', fontSize: '12px', fontWeight: '700',
                    }}>Trade</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
