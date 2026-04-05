import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMarket } from '../context/MarketContext';
import { useWallet } from '../context/WalletContext';
import PriceChart from '../components/PriceChart';
import OrderBook from '../components/OrderBook';
import TradePanel from '../components/TradePanel';

export default function Trade() {
  const { pair } = useParams();
  const navigate = useNavigate();
  const { prices, selectedPair, setSelectedPair, candleData, orderBook, trades, COINS } = useMarket();
  const { orders } = useWallet();

  useEffect(() => {
    if (pair) {
      const sym = pair.split('-')[0];
      if (prices[sym]) setSelectedPair(sym);
    }
  }, [pair]);

  const currentPrice = prices[selectedPair]?.price || 0;
  const change = prices[selectedPair]?.change || 0;

  return (
    <div className="fade-in">
      {/* Pair selector */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', overflowX: 'auto', paddingBottom: '4px' }}>
        {COINS.map(sym => (
          <button key={sym} onClick={() => { setSelectedPair(sym); navigate(`/trade/${sym}-USDT`); }} style={{
            padding: '8px 16px', borderRadius: 'var(--radius)', fontSize: '13px', fontWeight: '600',
            background: selectedPair === sym ? 'var(--accent-yellow-dim)' : 'var(--bg-card)',
            color: selectedPair === sym ? 'var(--accent-yellow)' : 'var(--text-secondary)',
            border: `1px solid ${selectedPair === sym ? 'var(--accent-yellow)' : 'var(--border)'}`,
            whiteSpace: 'nowrap', transition: 'all 0.15s',
          }}>{sym}/USDT</button>
        ))}
      </div>

      {/* Main trading layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px 280px', gridTemplateRows: 'auto auto', gap: '16px' }}>
        {/* Chart */}
        <div style={{ gridColumn: '1', gridRow: '1', minHeight: '420px' }}>
          <PriceChart data={candleData} symbol={selectedPair} currentPrice={currentPrice} change={change} />
        </div>

        {/* Order Book */}
        <div style={{ gridColumn: '2', gridRow: '1 / 3', minHeight: '580px' }}>
          <OrderBook orderBook={orderBook} currentPrice={currentPrice} symbol={selectedPair} />
        </div>

        {/* Trade Panel */}
        <div style={{ gridColumn: '3', gridRow: '1 / 3' }}>
          <TradePanel symbol={selectedPair} />
        </div>

        {/* Recent Trades + Open Orders */}
        <div style={{ gridColumn: '1', gridRow: '2', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {/* Recent Trades */}
          <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', padding: '16px' }}>
            <h3 style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '12px' }}>Recent Trades</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 0 6px', borderBottom: '1px solid var(--border)', marginBottom: '4px' }}>
              {['Price(USDT)', 'Qty', 'Time'].map(h => <span key={h} style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{h}</span>)}
            </div>
            <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
              {trades.map((t, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0' }}>
                  <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: t.side === 'buy' ? 'var(--accent-green)' : 'var(--accent-red)' }}>
                    {t.price?.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                  </span>
                  <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>{t.qty?.toFixed(4)}</span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{t.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Open Orders */}
          <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', padding: '16px' }}>
            <h3 style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '12px' }}>My Orders</h3>
            <div style={{ maxHeight: '180px', overflowY: 'auto' }}>
              {orders.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px', padding: '20px 0' }}>No orders yet</div>
              ) : orders.slice(0, 10).map(o => (
                <div key={o.id} style={{ padding: '8px 0', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: o.side === 'buy' ? 'var(--accent-green)' : 'var(--accent-red)', textTransform: 'uppercase' }}>{o.side}</span>
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)', marginLeft: '6px' }}>{o.qty} {o.symbol}</span>
                  </div>
                  <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '10px', fontWeight: '600',
                    background: o.status === 'filled' ? 'var(--accent-green-dim)' : 'var(--accent-yellow-dim)',
                    color: o.status === 'filled' ? 'var(--accent-green)' : 'var(--accent-yellow)',
                  }}>{o.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
