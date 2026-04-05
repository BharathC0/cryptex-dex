import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius)', padding: '10px 14px',
    }}>
      <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
        {new Date(label).toLocaleString()}
      </div>
      <div style={{ fontSize: '16px', fontWeight: '700', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
        ${payload[0]?.value?.toLocaleString(undefined, { maximumFractionDigits: 4 })}
      </div>
      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
        Vol: {(payload[0]?.payload?.volume / 1000).toFixed(0)}K
      </div>
    </div>
  );
};

export default function PriceChart({ data, symbol, currentPrice, change }) {
  const [timeframe, setTimeframe] = useState('1H');
  const isPositive = change >= 0;
  const color = isPositive ? '#0ecb81' : '#f6465d';

  const chartData = data.map(d => ({ ...d, price: d.close }));

  const TIMEFRAMES = ['15M', '1H', '4H', '1D', '1W'];

  return (
    <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', padding: '20px', height: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
        <div>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '4px' }}>{symbol}/USDT</div>
          <div style={{ fontSize: '28px', fontWeight: '800', fontFamily: 'var(--font-mono)', color }}>
            ${currentPrice?.toLocaleString(undefined, { maximumFractionDigits: 4 })}
          </div>
          <div style={{ fontSize: '14px', fontWeight: '600', color, marginTop: '2px' }}>
            {isPositive ? '+' : ''}{change?.toFixed(2)}% (24h)
          </div>
        </div>
        {/* Timeframe selector */}
        <div style={{ display: 'flex', gap: '4px', background: 'var(--bg-secondary)', padding: '4px', borderRadius: 'var(--radius)' }}>
          {TIMEFRAMES.map(tf => (
            <button key={tf} onClick={() => setTimeframe(tf)} style={{
              padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '600',
              background: timeframe === tf ? 'var(--accent-yellow)' : 'transparent',
              color: timeframe === tf ? '#0b0e11' : 'var(--text-secondary)',
              transition: 'all 0.15s',
            }}>{tf}</button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis
            dataKey="time"
            tickFormatter={v => new Date(v).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            stroke="var(--text-muted)" tick={{ fontSize: 10, fill: 'var(--text-muted)' }}
            tickLine={false} axisLine={false}
          />
          <YAxis
            domain={['auto', 'auto']}
            tickFormatter={v => `$${v >= 1000 ? (v / 1000).toFixed(1) + 'K' : v.toFixed(2)}`}
            stroke="var(--text-muted)" tick={{ fontSize: 10, fill: 'var(--text-muted)' }}
            tickLine={false} axisLine={false} width={65}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone" dataKey="price" stroke={color} strokeWidth={2}
            fill="url(#priceGrad)" dot={false} activeDot={{ r: 4, fill: color, stroke: 'var(--bg-primary)', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
