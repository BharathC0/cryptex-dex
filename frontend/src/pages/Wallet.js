import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { useMarket } from '../context/MarketContext';
import { useNavigate } from 'react-router-dom';

export default function Wallet() {
  const { balances, connected, connectWallet, address, txHistory, orders } = useWallet();
  const { prices } = useMarket();
  const navigate = useNavigate();
  const [tab, setTab] = useState('assets');

  const assets = Object.entries(balances).map(([sym, bal]) => {
    const price = sym === 'USDT' ? 1 : (prices[sym]?.price || 0);
    const usdValue = bal.balance * price;
    const change = prices[sym]?.change || 0;
    return { sym, ...bal, price, usdValue, change };
  }).filter(a => a.usdValue > 0.01).sort((a, b) => b.usdValue - a.usdValue);

  const totalValue = assets.reduce((s, a) => s + a.usdValue, 0);

  if (!connected) {
    return (
      <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center' }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>◉</div>
        <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px' }}>Connect Your Wallet</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '15px', maxWidth: '400px' }}>
          Connect your Web3 wallet to view your portfolio, balances, and transaction history.
        </p>
        <button onClick={connectWallet} style={{
          padding: '14px 40px', background: 'var(--accent-yellow)', color: '#0b0e11',
          borderRadius: 'var(--radius)', fontSize: '16px', fontWeight: '800',
          boxShadow: '0 4px 20px rgba(240,185,11,0.4)',
        }}>Connect Wallet</button>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800' }}>Wallet</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-green)' }} />
            <span style={{ fontSize: '13px', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>{address}</span>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Total Portfolio Value</div>
          <div style={{ fontSize: '36px', fontWeight: '800', fontFamily: 'var(--font-mono)', color: 'var(--accent-yellow)' }}>
            ${totalValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </div>
        </div>
      </div>

      {/* Allocation pie visual */}
      <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', padding: '20px', marginBottom: '20px', border: '1px solid var(--border)' }}>
        <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '16px' }}>Allocation</h3>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          {assets.map(a => {
            const pct = (a.usdValue / totalValue) * 100;
            const color = a.sym === 'USDT' ? '#26a17b' : (prices[a.sym]?.color || '#888');
            return (
              <div key={a.sym} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '60px' }}>
                <div style={{ width: `${Math.max(pct * 0.8, 20)}px`, height: `${Math.max(pct * 0.8, 20)}px`, borderRadius: '50%', background: color + '40', border: `2px solid ${color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: '800', color, maxWidth: '70px', maxHeight: '70px' }}>
                  {pct.toFixed(0)}%
                </div>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>{a.sym}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '16px', background: 'var(--bg-secondary)', padding: '4px', borderRadius: 'var(--radius)', width: 'fit-content' }}>
        {['assets', 'orders', 'history'].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '8px 20px', borderRadius: '6px', fontSize: '13px', fontWeight: '600',
            background: tab === t ? 'var(--bg-card)' : 'transparent',
            color: tab === t ? 'var(--text-primary)' : 'var(--text-secondary)',
            textTransform: 'capitalize',
          }}>{t}</button>
        ))}
      </div>

      {/* Assets tab */}
      {tab === 'assets' && (
        <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: 'var(--bg-secondary)' }}>
              <tr>
                {['Token', 'Balance', 'Price', '24h', 'Value', 'Action'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: h === 'Token' ? 'left' : 'right', fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {assets.map(a => {
                const color = a.sym === 'USDT' ? '#26a17b' : (prices[a.sym]?.color || '#888');
                const pos = a.change >= 0;
                return (
                  <tr key={a.sym} style={{ borderTop: '1px solid var(--border)' }}>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: color + '25', border: `1px solid ${color}50`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '800', color }}>
                          {a.sym[0]}
                        </div>
                        <div>
                          <div style={{ fontWeight: '700', fontSize: '14px' }}>{a.sym}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{a.sym === 'USDT' ? 'Tether USD' : prices[a.sym]?.name || a.sym}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>{a.balance.toFixed(6)}</td>
                    <td style={{ padding: '14px 16px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
                      ${a.price.toLocaleString(undefined, { maximumFractionDigits: a.price > 1 ? 2 : 6 })}
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                      <span style={{ fontSize: '12px', fontWeight: '700', color: pos ? 'var(--accent-green)' : 'var(--accent-red)' }}>
                        {pos ? '+' : ''}{a.change.toFixed(2)}%
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: '14px', fontWeight: '700' }}>
                      ${a.usdValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                      {a.sym !== 'USDT' && (
                        <button onClick={() => navigate(`/trade/${a.sym}-USDT`)} style={{
                          padding: '5px 14px', background: 'var(--accent-yellow-dim)', color: 'var(--accent-yellow)',
                          border: '1px solid var(--accent-yellow)', borderRadius: 'var(--radius)', fontSize: '12px', fontWeight: '700',
                        }}>Trade</button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Orders tab */}
      {tab === 'orders' && (
        <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', overflow: 'hidden' }}>
          {orders.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>No orders placed yet</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: 'var(--bg-secondary)' }}>
                <tr>
                  {['Pair', 'Side', 'Type', 'Qty', 'Price', 'Status', 'Time'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o.id} style={{ borderTop: '1px solid var(--border)' }}>
                    <td style={{ padding: '12px 16px', fontWeight: '700', fontSize: '13px' }}>{o.pair}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: o.side === 'buy' ? 'var(--accent-green)' : 'var(--accent-red)' }}>{o.side}</span>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{o.type}</td>
                    <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>{o.qty}</td>
                    <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>${o.price?.toLocaleString()}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '20px', fontWeight: '600',
                        background: o.status === 'filled' ? 'var(--accent-green-dim)' : 'var(--accent-yellow-dim)',
                        color: o.status === 'filled' ? 'var(--accent-green)' : 'var(--accent-yellow)',
                      }}>{o.status}</span>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                      {new Date(o.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* History tab */}
      {tab === 'history' && (
        <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', overflow: 'hidden' }}>
          {txHistory.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>No transactions yet</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: 'var(--bg-secondary)' }}>
                <tr>
                  {['Type', 'Details', 'Status', 'Time'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {txHistory.map(tx => (
                  <tr key={tx.id} style={{ borderTop: '1px solid var(--border)' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontSize: '12px', fontWeight: '700', padding: '3px 10px', borderRadius: '20px', textTransform: 'uppercase',
                        background: tx.type === 'swap' ? 'rgba(24,144,255,0.15)' : tx.side === 'buy' ? 'var(--accent-green-dim)' : 'var(--accent-red-dim)',
                        color: tx.type === 'swap' ? 'var(--accent-blue)' : tx.side === 'buy' ? 'var(--accent-green)' : 'var(--accent-red)',
                      }}>{tx.type || tx.side}</span>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '13px', fontFamily: 'var(--font-mono)' }}>
                      {tx.type === 'swap'
                        ? `${tx.amount} ${tx.from} → ${tx.received?.toFixed(4)} ${tx.to}`
                        : `${tx.qty} ${tx.symbol} @ $${tx.price?.toLocaleString()}`
                      }
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '20px', background: 'var(--accent-green-dim)', color: 'var(--accent-green)', fontWeight: '600' }}>completed</span>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '12px', color: 'var(--text-secondary)' }}>{tx.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
