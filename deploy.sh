#!/bin/bash
# ============================================================
# CrypteX DEX - One-Click GitHub Push + Vercel Deploy Script
# Run this on YOUR machine after downloading the project
# ============================================================

set -e

GITHUB_TOKEN="YOUR_GITHUB_TOKEN_HERE"
GITHUB_USER="BharathC0"
REPO_NAME="cryptex-dex"

echo "🚀 CrypteX DEX - Auto Deploy Starting..."
echo "========================================="

# Step 1: Configure git
git config --global user.email "bharathc0@github.com"
git config --global user.name "$GITHUB_USER"
echo "✅ Git configured"

# Step 2: Create GitHub repo via API
echo "📦 Creating GitHub repository..."
CREATE_RESPONSE=$(curl -s -X POST \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/user/repos \
  -d "{\"name\":\"$REPO_NAME\",\"description\":\"CrypteX - Binance-style Decentralized Crypto Exchange\",\"private\":false,\"auto_init\":false}")

REPO_URL=$(echo $CREATE_RESPONSE | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('clone_url',''))" 2>/dev/null)

if [ -z "$REPO_URL" ]; then
  echo "⚠️  Repo might already exist, using existing..."
  REPO_URL="https://github.com/$GITHUB_USER/$REPO_NAME.git"
fi

echo "✅ GitHub repo: $REPO_URL"

# Step 3: Initialize and push
echo "📤 Pushing code to GitHub..."
cd "$(dirname "$0")"

if [ ! -d ".git" ]; then
  git init
fi

git remote remove origin 2>/dev/null || true
git remote add origin "https://$GITHUB_TOKEN@github.com/$GITHUB_USER/$REPO_NAME.git"

git add -A
git commit -m "🚀 feat: CrypteX DEX - Full Binance-style crypto exchange

- Live price charts for BTC, ETH, BNB, SOL, ADA, XRP, DOGE, MATIC, AVAX, LINK
- Real-time order book with bid/ask depth
- Buy/Sell trading with market & limit orders
- Token swap interface with rate calculation
- MetaMask wallet integration
- Portfolio dashboard with transaction history
- Backend: Node.js + Express + MySQL
- Frontend: React 18 + Recharts"

git branch -M main
git push -u origin main --force

echo "✅ Code pushed to GitHub!"
echo "🔗 Repo: https://github.com/$GITHUB_USER/$REPO_NAME"

# Step 4: Deploy frontend to Vercel
echo ""
echo "🌐 Deploying frontend to Vercel..."
cd frontend

if ! command -v vercel &> /dev/null; then
  echo "📥 Installing Vercel CLI..."
  npm install -g vercel
fi

npm install
npm run build

echo ""
echo "🎯 Run this to deploy to Vercel:"
echo "   cd frontend && vercel --prod"
echo ""
echo "Or set up auto-deploy:"
echo "1. Go to vercel.com → Import Project"
echo "2. Select GitHub repo: $GITHUB_USER/$REPO_NAME"
echo "3. Set Root Directory: frontend"
echo "4. Deploy!"
echo ""
echo "========================================="
echo "✅ ALL DONE! Your CrypteX DEX is ready!"
echo "========================================="
echo ""
echo "📌 GitHub: https://github.com/$GITHUB_USER/$REPO_NAME"
echo "📌 Next: Deploy to Vercel using the steps above"
