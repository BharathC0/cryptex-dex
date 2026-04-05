import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Trade from './pages/Trade';
import Wallet from './pages/Wallet';
import Markets from './pages/Markets';
import Swap from './pages/Swap';
import { WalletProvider } from './context/WalletContext';
import { MarketProvider } from './context/MarketContext';

function App() {
  return (
    <WalletProvider>
      <MarketProvider>
        <Router>
          <div style={{ display: 'flex', minHeight: '100vh' }}>
            <Sidebar />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginLeft: '220px' }}>
              <Navbar />
              <main style={{ flex: 1, padding: '24px', marginTop: '64px' }}>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/trade/:pair?" element={<Trade />} />
                  <Route path="/swap" element={<Swap />} />
                  <Route path="/markets" element={<Markets />} />
                  <Route path="/wallet" element={<Wallet />} />
                </Routes>
              </main>
            </div>
          </div>
        </Router>
      </MarketProvider>
    </WalletProvider>
  );
}

export default App;
