import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMarket } from '../context/MarketContext';
import { useWallet } from '../context/WalletContext';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

function MiniChart({ data, positive }) {
  const color = positive ? '#0ecb81' : '#f6465d';
  return (
    <ResponsiveContainer width="100%" height={40}>
      <AreaChart data={data.slice(-20).map(d => ({ v: d.close }))}>
        <defs>
          <linearGradient id={`g${positive}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.4} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey="v" stroke={color} strokeWidth={1.5} fill={`url(#g${positive})`} dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function CoinCard({ sym, info, navigate, candleData }) {
  const pos = info.change >= 0;
  const miniData = candleData?.slice(-20).map((c, i) => ({ v: c.close + (Math.sin(i * 0.5) * c.close * 0.01) })) || [];
  return (
    <div onClick={() => navigate(`/trade/${sym}-USDT`)} style={{
      background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', padding: '20px',
      cursor: 'pointer', border: '1px solid var(--border)', transition: 'all 0.2s',
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-light)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: info.color + '30', border: `1px solid ${info.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '800', color: info.color }}>{sym[0]}</div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '700' }}>{sym}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{info.name}</div>
            </div>
          </div>
        </div>
        <span style={{ fontSize: '12px', fontWeight: '700', padding: '3px 8px', borderRadius: '20px', background: pos ? 'var(--accent-green-dim)' : 'var(--accent-red-dim)', color: pos ? 'var(--accent-green)' : 'var(--accent-red)' }}>
          {pos ? '+' : ''}{info.change?.toFixed(2)}%
        </span>
      </div>
      <ResponsiveContainer width="100%" height={40}>
        <AreaChart data={miniData}>
          <defs>
            <linearGradient id={`mg${sym}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={pos ? '#0ecb81' : '#f6465d'} stopOpacity={0.3} />
              <stop offset="95%" stopColor={pos ? '#0ecb81' : '#f6465d'} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area type="monotone" dataKey="v" stroke={pos ? '#0ecb81' : '#f6465d'} strokeWidth={1.5} fill={`url(#mg${sym})`} dot={false} />
        </AreaChart>
      </ResponsiveContainer>
      <div style={{ marginTop: '12px' }}>
        <div style={{ fontSize: '20px', fontWeight: '800', fontFamily: 'var(--font-mono)' }}>
          ${info.price?.toLocaleString(undefined, { maximumFractionDigits: info.price > 1 ? 2 : 6 })}
        </div>
        <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>Vol: ${info.volume}</div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { prices, candleData, selectedPair } = useMarket();
  const { balances } = useWallet();
  const navigate = useNavigate();

  const totalUsdValue = Object.entries(balances).reduce((sum, [sym, bal]) => {
    const price = sym === 'USDT' ? 1 : (prices[sym]?.price || 0);
    return sum + bal.balance * price;
  }, 0);

  return (
    <div className="fade-in">
      {/* Welcome banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1a1f2e 0%, #222840 50%, #1a1f2e 100%)',
        borderRadius: 'var(--radius-lg)', padding: '28px 32px', marginBottom: '24px',
        border: '1px solid var(--border)', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', right: '-20px', top: '-20px', width: '200px', height: '200px', background: 'var(--accent-yellow)', opacity: 0.03, borderRadius: '50%' }} />
        <div style={{ position: 'absolute', right: '60px', bottom: '-40px', width: '150px', height: '150px', background: 'var(--accent-blue)', opacity: 0.05, borderRadius: '50%' }} />
        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Portfolio Value</div>
        <div style={{ fontSize: '40px', fontWeight: '800', fontFamily: 'var(--font-mono)', color: 'var(--accent-yellow)' }}>
          ${totalUsdValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
        </div>
        <div style={{ fontSize: '14px', color: 'var(--accent-green)', marginTop: '4px' }}>↑ 2.34% today</div>
        <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
          <button onClick={() => navigate('/trade/BTC-USDT')} style={{ padding: '10px 24px', background: 'var(--accent-yellow)', color: '#0b0e11', borderRadius: 'var(--radius)', fontWeight: '700', fontSize: '13px' }}>Start Trading →</button>
          <button onClick={() => navigate('/swap')} style={{ padding: '10px 24px', background: 'var(--bg-secondary)', color: 'var(--text-primary)', borderRadius: 'var(--radius)', fontWeight: '600', fontSize: '13px', border: '1px solid var(--border)' }}>Swap Tokens</button>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: '24h Volume', value: '$84.3B', icon: '📊', color: 'var(--accent-blue)' },
          { label: 'Listed Assets', value: `${Object.keys(prices).length}`, icon: '🪙', color: 'var(--accent-yellow)' },
          { label: 'Active Trades', value: '2.4M+', icon: '⚡', color: 'var(--accent-green)' },
          { label: 'Network', value: 'Ethereum', icon: '🌐', color: 'var(--accent-red)' },
        ].map(s => (
          <div key={s.label} style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', padding: '16px 20px', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '22px', marginBottom: '8px' }}>{s.icon}</div>
            <div style={{ fontSize: '22px', fontWeight: '800', fontFamily: 'var(--font-mono)', color: s.color }}>{s.value}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Coin grid */}
      <h2 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '16px' }}>Live Markets</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
        {Object.entries(prices).map(([sym, info]) => (
          <CoinCard key={sym} sym={sym} info={info} navigate={navigate} candleData={candleData} />
        ))}
      </div>
    </div>
  );
}
