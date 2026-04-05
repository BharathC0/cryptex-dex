-- CrypteX Database Schema
CREATE DATABASE IF NOT EXISTS cryptex_db;
USE cryptex_db;

CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  wallet_address VARCHAR(42),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS balances (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  token VARCHAR(20) NOT NULL,
  balance DECIMAL(20, 8) DEFAULT 0,
  locked DECIMAL(20, 8) DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES users(id),
  UNIQUE KEY (user_id, token)
);

CREATE TABLE IF NOT EXISTS orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  pair VARCHAR(20) NOT NULL,
  side ENUM('buy','sell') NOT NULL,
  type ENUM('market','limit') NOT NULL,
  qty DECIMAL(20, 8) NOT NULL,
  price DECIMAL(20, 8) NOT NULL,
  filled DECIMAL(20, 8) DEFAULT 0,
  status ENUM('open','filled','cancelled') DEFAULT 'open',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS transactions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  type ENUM('swap','buy','sell','deposit','withdraw') NOT NULL,
  from_token VARCHAR(20),
  to_token VARCHAR(20),
  amount DECIMAL(20, 8),
  received DECIMAL(20, 8),
  fee DECIMAL(20, 8) DEFAULT 0,
  status ENUM('pending','completed','failed') DEFAULT 'completed',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Seed demo user (password: demo1234)
INSERT IGNORE INTO users (email, password_hash, wallet_address) VALUES
('demo@cryptex.io', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '0xDemoAddress000000000000000000000000000001');

-- Seed demo balances
INSERT IGNORE INTO balances (user_id, token, balance) VALUES
(1, 'USDT', 10000), (1, 'BTC', 0.2451), (1, 'ETH', 3.821),
(1, 'BNB', 12.5), (1, 'SOL', 45.2), (1, 'ADA', 1200),
(1, 'XRP', 5000), (1, 'DOGE', 15000), (1, 'MATIC', 800);
