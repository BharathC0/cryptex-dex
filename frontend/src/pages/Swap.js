import React, { useState } from 'react';
import { useMarket } from '../context/MarketContext';
import { useWallet } from '../context/WalletContext';

export default function Swap() {
  const { prices, COINS } = useMarket();
  const { balances, swap, connected, connectWallet } = useWallet();
  const [fromToken, setFromToken] = useState('USDT');
  const [toToken, setToToken] = useState('BTC');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState(null);
  const [swapping, setSwapping] = useState(false);

  const fromPrice = fromToken === 'USDT' ? 1 : (prices[fromToken]?.price || 1);
  const toPrice = toToken === 'USDT' ? 1 : (prices[toToken]?.price || 1);
  const rate = fromPrice / toPrice;
  const received = (parseFloat(amount) || 0) * rate;
  const priceImpact = Math.random() * 0.3 + 0.1;
  const fee = (parseFloat(amount) || 0) * fromPrice * 0.003;

  const allTokens = ['USDT', ...COINS];

  const handleSwap = async () => {
    if (!connected) { await connectWallet(); return; }
    if (!amount || parseFloat(amount) <= 0) { setStatus({ type: 'error', msg: 'Enter valid amount' }); return; }
    const bal = balances[fromToken]?.balance || 0;
    if (parseFloat(amount) > bal) { setStatus({ type: 'error', msg: 'Insufficient balance' }); return; }

    setSwapping(true);
    await new Promise(r => setTimeout(r, 1500));
    swap(fromToken, toToken, parseFloat(amount), rate);
    setStatus({ type: 'success', msg: `Swapped ${amount} ${fromToken} → ${received.toFixed(6)} ${toToken}` });
    setAmount('');
    setSwapping(false);
    setTimeout(() => setStatus(null), 4000);
  };

  const flipTokens = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setAmount('');
  };

  const TokenSelect = ({ value, onChange, label }) => (
    <div>
      <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)} style={{
        width: '100%', background: 'var(--bg-secondary)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius)', padding: '10px 12px', color: 'var(--text-primary)',
        fontSize: '14px', fontWeight: '600', fontFamily: 'var(--font-display)', cursor: 'pointer',
      }}>
        {allTokens.filter(t => t !== (label.includes('From') ? toToken : fromToken)).map(t => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="fade-in" style={{ maxWidth: '480px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px' }}>Swap</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '14px' }}>
        Instantly swap any token at the best rates
      </p>

      <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', padding: '24px', border: '1px solid var(--border)' }}>
        {/* From */}
        <div style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--radius)', padding: '16px', marginBottom: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>From</span>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Balance: <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
                {(balances[fromToken]?.balance || 0).toFixed(4)} {fromToken}
              </span>
            </span>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <input value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" type="number"
              style={{
                flex: 1, background: 'transparent', border: 'none', fontSize: '28px', fontWeight: '800',
                fontFamily: 'var(--font-mono)', color: 'var(--text-primary)',
              }} />
            <select value={fromToken} onChange={e => setFromToken(e.target.value)} style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)',
              padding: '8px 12px', color: 'var(--text-primary)', fontSize: '14px', fontWeight: '700', cursor: 'pointer',
            }}>
              {allTokens.filter(t => t !== toToken).map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
            ≈ ${((parseFloat(amount) || 0) * fromPrice).toFixed(2)}
          </div>
        </div>

        {/* Flip button */}
        <div style={{ textAlign: 'center', margin: '4px 0' }}>
          <button onClick={flipTokens} style={{
            width: '36px', height: '36px', borderRadius: '50%', background: 'var(--bg-hover)',
            border: '2px solid var(--border)', fontSize: '16px', transition: 'all 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.transform = 'rotate(180deg)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'rotate(0deg)'}>⇅</button>
        </div>

        {/* To */}
        <div style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--radius)', padding: '16px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>To</span>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Balance: <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
                {(balances[toToken]?.balance || 0).toFixed(4)} {toToken}
              </span>
            </span>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ flex: 1, fontSize: '28px', fontWeight: '800', fontFamily: 'var(--font-mono)', color: 'var(--accent-green)' }}>
              {received > 0 ? received.toFixed(6) : '0.00'}
            </div>
            <select value={toToken} onChange={e => setToToken(e.target.value)} style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)',
              padding: '8px 12px', color: 'var(--text-primary)', fontSize: '14px', fontWeight: '700', cursor: 'pointer',
            }}>
              {allTokens.filter(t => t !== fromToken).map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        {/* Info */}
        {amount && parseFloat(amount) > 0 && (
          <div style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--radius)', padding: '12px 16px', marginBottom: '16px' }}>
            {[
              { label: 'Rate', value: `1 ${fromToken} = ${rate.toFixed(6)} ${toToken}` },
              { label: 'Price Impact', value: `${priceImpact.toFixed(2)}%`, color: 'var(--accent-green)' },
              { label: 'Fee (0.3%)', value: `$${fee.toFixed(4)}` },
              { label: 'Min received', value: `${(received * 0.995).toFixed(6)} ${toToken}` },
            ].map(row => (
              <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', fontSize: '13px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>{row.label}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '600', color: row.color || 'var(--text-primary)' }}>{row.value}</span>
              </div>
            ))}
          </div>
        )}

        <button onClick={handleSwap} disabled={swapping} style={{
          width: '100%', padding: '16px', borderRadius: 'var(--radius)',
          background: swapping ? 'var(--bg-hover)' : 'var(--accent-yellow)',
          color: swapping ? 'var(--text-secondary)' : '#0b0e11',
          fontSize: '16px', fontWeight: '800', letterSpacing: '0.5px',
          transition: 'all 0.2s', boxShadow: swapping ? 'none' : '0 4px 20px rgba(240,185,11,0.3)',
        }}>
          {swapping ? '⏳ Swapping...' : !connected ? '🔌 Connect Wallet' : `Swap ${fromToken} → ${toToken}`}
        </button>

        {status && (
          <div style={{
            marginTop: '12px', padding: '12px', borderRadius: 'var(--radius)', fontSize: '13px', fontWeight: '600',
            background: status.type === 'success' ? 'var(--accent-green-dim)' : 'var(--accent-red-dim)',
            color: status.type === 'success' ? 'var(--accent-green)' : 'var(--accent-red)',
            border: `1px solid ${status.type === 'success' ? 'var(--accent-green)' : 'var(--accent-red)'}`,
          }}>{status.type === 'success' ? '✅' : '❌'} {status.msg}</div>
        )}
      </div>
    </div>
  );
}
