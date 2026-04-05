import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  { path: '/', label: 'Dashboard', icon: '⬡' },
  { path: '/markets', label: 'Markets', icon: '◈' },
  { path: '/trade/BTC-USDT', label: 'Trade', icon: '◆' },
  { path: '/swap', label: 'Swap', icon: '⇄' },
  { path: '/wallet', label: 'Wallet', icon: '◉' },
];

export default function Sidebar() {
  return (
    <aside style={{
      position: 'fixed', left: 0, top: 0, bottom: 0, width: '220px',
      background: 'var(--bg-secondary)', borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column', zIndex: 200,
    }}>
      {/* Logo */}
      <div style={{
        height: '64px', display: 'flex', alignItems: 'center', padding: '0 24px',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px', height: '32px', background: 'var(--accent-yellow)',
            borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '16px', fontWeight: '900', color: '#0b0e11',
          }}>X</div>
          <span style={{ fontSize: '20px', fontWeight: '800', letterSpacing: '-0.5px' }}>
            Crypte<span style={{ color: 'var(--accent-yellow)' }}>X</span>
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '16px 12px' }}>
        {NAV_ITEMS.map(item => (
          <NavLink key={item.path} to={item.path} end={item.path === '/'} style={({ isActive }) => ({
            display: 'flex', alignItems: 'center', gap: '12px',
            padding: '12px 16px', borderRadius: 'var(--radius)',
            marginBottom: '4px', fontSize: '14px', fontWeight: '600',
            color: isActive ? 'var(--accent-yellow)' : 'var(--text-secondary)',
            background: isActive ? 'var(--accent-yellow-dim)' : 'transparent',
            borderLeft: isActive ? '3px solid var(--accent-yellow)' : '3px solid transparent',
            transition: 'all 0.2s',
          })}>
            <span style={{ fontSize: '18px' }}>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)' }}>
        <div style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
          <div>CrypteX DEX v1.0</div>
          <div style={{ color: 'var(--accent-green)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-green)', display: 'inline-block' }} />
            All systems operational
          </div>
        </div>
      </div>
    </aside>
  );
}
