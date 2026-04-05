# 🚀 CrypteX DEX - Decentralized Crypto Exchange

A Binance-style crypto exchange with live charts, order book, trading, swaps, and wallet support.

## ✨ Features
- 10+ Cryptocurrencies (BTC, ETH, BNB, SOL, ADA, XRP, DOGE, MATIC, AVAX, LINK)
- Live price simulation with real-time chart updates
- Full trading terminal (Buy/Sell, Market/Limit orders)
- Token swap interface with rate calculation
- MetaMask wallet integration
- Portfolio & transaction history
- Dark theme (Binance-inspired)

## 🛠️ Tech Stack
- **Frontend**: React 18, Recharts, React Router, Ethers.js
- **Backend**: Node.js, Express, MySQL
- **Deploy**: Vercel (frontend) + Railway/Render (backend)

## 🚀 Quick Start

### Frontend
\`\`\`bash
cd frontend
npm install
npm start
\`\`\`

### Backend
\`\`\`bash
cd backend
cp .env.example .env
# Edit .env with your MySQL credentials
mysql -u root -p < config/schema.sql
npm install
npm run dev
\`\`\`

## 🌐 Deploy

### Frontend → Vercel
\`\`\`bash
cd frontend
npm install -g vercel
npm run build
vercel --prod
\`\`\`

### Backend → Railway
1. Go to railway.app → New Project → Deploy from GitHub
2. Select `cryptex/backend` folder
3. Add environment variables from `.env.example`
4. Add MySQL plugin

## 📁 Structure
\`\`\`
cryptex/
├── frontend/          React app
│   └── src/
│       ├── components/  (Navbar, Sidebar, Chart, OrderBook, TradePanel)
│       ├── pages/       (Dashboard, Trade, Swap, Markets, Wallet)
│       └── context/     (MarketContext, WalletContext)
└── backend/           Node.js API
    ├── routes/          (auth, market, orders, wallet)
    └── config/          (db.js, schema.sql)
\`\`\`

Built with ❤️ by BharathC0
