import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

// Auto attach JWT token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('cryptex_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto logout on 401
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('cryptex_token');
      window.location.href = '/';
    }
    return Promise.reject(err);
  }
);

// Auth
export const register = (email, password) => API.post('/auth/register', { email, password });
export const login = (email, password) => API.post('/auth/login', { email, password });

// Market
export const getPrices = () => API.get('/market/prices');
export const getTokenPrice = (symbol) => API.get(`/market/price/${symbol}`);

// Orders
export const placeOrder = (order) => API.post('/orders', order);
export const getOrders = () => API.get('/orders');

// Wallet
export const getBalances = () => API.get('/wallet/balances');
export const getTransactions = () => API.get('/wallet/transactions');
export const swapTokens = (data) => API.post('/wallet/swap', data);

// User
export const getProfile = () => API.get('/user/profile');
export const updateWallet = (walletAddress) => API.put('/user/wallet', { walletAddress });

export default API;
