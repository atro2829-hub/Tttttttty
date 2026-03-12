import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import Database from 'better-sqlite3';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database('platform.db');
const JWT_SECRET = process.env.JWT_SECRET || 'nexus-invest-secret-key-2026';

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT,
    full_name TEXT,
    binance_id TEXT,
    usdt_address TEXT,
    balance REAL DEFAULT 0,
    referral_code TEXT UNIQUE,
    referred_by TEXT,
    role TEXT DEFAULT 'user',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS plans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    min_amount REAL,
    max_amount REAL,
    interest_rate REAL,
    duration_days INTEGER,
    description TEXT
  );

  CREATE TABLE IF NOT EXISTS investments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    plan_id INTEGER,
    amount REAL,
    start_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    end_date DATETIME,
    status TEXT DEFAULT 'active',
    last_interest_calc DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(plan_id) REFERENCES plans(id)
  );

  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    type TEXT, -- 'deposit', 'withdrawal', 'interest', 'referral'
    amount REAL,
    method TEXT, -- 'binance', 'usdt_trc20', 'usdt_erc20', 'usdt_bep20'
    status TEXT DEFAULT 'pending', -- 'pending', 'completed', 'failed'
    details TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS support_tickets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    subject TEXT,
    message TEXT,
    status TEXT DEFAULT 'open',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );
`);

// Seed initial plans if empty
const planCount = db.prepare('SELECT COUNT(*) as count FROM plans').get() as { count: number };
if (planCount.count === 0) {
  const insertPlan = db.prepare('INSERT INTO plans (name, min_amount, max_amount, interest_rate, duration_days, description) VALUES (?, ?, ?, ?, ?, ?)');
  insertPlan.run('Starter', 10, 500, 1.5, 30, 'Perfect for beginners starting their journey.');
  insertPlan.run('Professional', 501, 5000, 2.5, 60, 'Advanced plan for seasoned investors.');
  insertPlan.run('Elite', 5001, 50000, 4.0, 90, 'Maximum returns for high-net-worth individuals.');
}

async function startServer() {
  const app = express();
  app.use(express.json());
  app.use(cookieParser());

  // Auth Middleware
  const authenticateToken = (req: any, res: any, next: any) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) return res.status(403).json({ error: 'Forbidden' });
      req.user = user;
      next();
    });
  };

  const isAdmin = (req: any, res: any, next: any) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });
    next();
  };

  // --- API Routes ---

  // Auth
  app.post('/api/auth/register', async (req, res) => {
    const { email, password, fullName, referralCode } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const myReferralCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      const result = db.prepare('INSERT INTO users (email, password, full_name, referral_code, referred_by) VALUES (?, ?, ?, ?, ?)')
        .run(email, hashedPassword, fullName, myReferralCode, referralCode || null);
      
      const user = { id: result.lastInsertRowid, email, role: 'user' };
      const token = jwt.sign(user, JWT_SECRET, { expiresIn: '24h' });
      res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'none' });
      res.json({ user });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const tokenUser = { id: user.id, email: user.email, role: user.role };
    const token = jwt.sign(tokenUser, JWT_SECRET, { expiresIn: '24h' });
    res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'none' });
    res.json({ user: tokenUser });
  });

  app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out' });
  });

  app.get('/api/auth/me', authenticateToken, (req: any, res) => {
    const user = db.prepare('SELECT id, email, full_name, role, balance, referral_code, binance_id, usdt_address FROM users WHERE id = ?').get(req.user.id);
    res.json(user);
  });

  // Plans
  app.get('/api/plans', (req, res) => {
    const plans = db.prepare('SELECT * FROM plans').all();
    res.json(plans);
  });

  // User Dashboard & Investments
  app.get('/api/user/dashboard', authenticateToken, (req: any, res) => {
    const user = db.prepare('SELECT balance FROM users WHERE id = ?').get(req.user.id) as any;
    const activeInvestments = db.prepare(`
      SELECT i.*, p.name as plan_name 
      FROM investments i 
      JOIN plans p ON i.plan_id = p.id 
      WHERE i.user_id = ? AND i.status = 'active'
    `).all(req.user.id);
    
    const totalInvested = activeInvestments.reduce((sum: number, inv: any) => sum + inv.amount, 0);
    const transactions = db.prepare('SELECT * FROM transactions WHERE user_id = ? ORDER BY created_at DESC LIMIT 10').all(req.user.id);
    
    res.json({
      balance: user.balance,
      totalInvested,
      activeInvestments,
      recentTransactions: transactions
    });
  });

  app.post('/api/investments/join', authenticateToken, (req: any, res) => {
    const { planId, amount } = req.body;
    const user = db.prepare('SELECT balance FROM users WHERE id = ?').get(req.user.id) as any;
    const plan = db.prepare('SELECT * FROM plans WHERE id = ?').get(planId) as any;

    if (!plan) return res.status(404).json({ error: 'Plan not found' });
    if (amount < plan.min_amount || amount > plan.max_amount) return res.status(400).json({ error: 'Amount outside plan limits' });
    if (user.balance < amount) return res.status(400).json({ error: 'Insufficient balance' });

    const transaction = db.transaction(() => {
      db.prepare('UPDATE users SET balance = balance - ? WHERE id = ?').run(amount, req.user.id);
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + plan.duration_days);
      db.prepare('INSERT INTO investments (user_id, plan_id, amount, end_date) VALUES (?, ?, ?, ?)').run(req.user.id, planId, amount, endDate.toISOString());
      db.prepare('INSERT INTO transactions (user_id, type, amount, status, details) VALUES (?, ?, ?, ?, ?)')
        .run(req.user.id, 'investment', amount, 'completed', `Invested in ${plan.name} plan`);
    });

    transaction();
    res.json({ message: 'Investment successful' });
  });

  // Transactions
  app.post('/api/transactions/deposit', authenticateToken, (req: any, res) => {
    const { amount, method, details } = req.body;
    db.prepare('INSERT INTO transactions (user_id, type, amount, method, details, status) VALUES (?, ?, ?, ?, ?, ?)')
      .run(req.user.id, 'deposit', amount, method, details, 'pending');
    res.json({ message: 'Deposit request submitted' });
  });

  app.post('/api/transactions/withdraw', authenticateToken, (req: any, res) => {
    const { amount, method, details } = req.body;
    const user = db.prepare('SELECT balance FROM users WHERE id = ?').get(req.user.id) as any;
    
    if (user.balance < amount) return res.status(400).json({ error: 'Insufficient balance' });

    const transaction = db.transaction(() => {
      db.prepare('UPDATE users SET balance = balance - ? WHERE id = ?').run(amount, req.user.id);
      db.prepare('INSERT INTO transactions (user_id, type, amount, method, details, status) VALUES (?, ?, ?, ?, ?, ?)')
        .run(req.user.id, 'withdrawal', amount, method, details, 'pending');
    });

    transaction();
    res.json({ message: 'Withdrawal request submitted' });
  });

  app.get('/api/transactions/history', authenticateToken, (req: any, res) => {
    const history = db.prepare('SELECT * FROM transactions WHERE user_id = ? ORDER BY created_at DESC').all(req.user.id);
    res.json(history);
  });

  // Admin Routes
  app.get('/api/admin/users', authenticateToken, isAdmin, (req, res) => {
    const users = db.prepare('SELECT id, email, full_name, balance, role, created_at FROM users').all();
    res.json(users);
  });

  app.get('/api/admin/transactions', authenticateToken, isAdmin, (req, res) => {
    const transactions = db.prepare(`
      SELECT t.*, u.email as user_email 
      FROM transactions t 
      JOIN users u ON t.user_id = u.id 
      ORDER BY t.created_at DESC
    `).all();
    res.json(transactions);
  });

  app.post('/api/admin/transactions/:id/approve', authenticateToken, isAdmin, (req, res) => {
    const { id } = req.params;
    const tx = db.prepare('SELECT * FROM transactions WHERE id = ?').get(id) as any;
    if (!tx) return res.status(404).json({ error: 'Transaction not found' });
    if (tx.status !== 'pending') return res.status(400).json({ error: 'Transaction already processed' });

    const transaction = db.transaction(() => {
      db.prepare('UPDATE transactions SET status = ? WHERE id = ?').run('completed', id);
      if (tx.type === 'deposit') {
        db.prepare('UPDATE users SET balance = balance + ? WHERE id = ?').run(tx.amount, tx.user_id);
        
        // Referral commission (10%)
        const user = db.prepare('SELECT referred_by FROM users WHERE id = ?').get(tx.user_id) as any;
        if (user.referred_by) {
          const referrer = db.prepare('SELECT id FROM users WHERE referral_code = ?').get(user.referred_by) as any;
          if (referrer) {
            const commission = tx.amount * 0.1;
            db.prepare('UPDATE users SET balance = balance + ? WHERE id = ?').run(commission, referrer.id);
            db.prepare('INSERT INTO transactions (user_id, type, amount, status, details) VALUES (?, ?, ?, ?, ?)')
              .run(referrer.id, 'referral', commission, 'completed', `Referral commission from ${tx.user_id}`);
          }
        }
      }
    });

    transaction();
    res.json({ message: 'Transaction approved' });
  });

  // Interest Calculation Cron (Simulated with interval)
  setInterval(() => {
    const activeInvestments = db.prepare(`
      SELECT i.*, p.interest_rate 
      FROM investments i 
      JOIN plans p ON i.plan_id = p.id 
      WHERE i.status = 'active'
    `).all() as any[];

    const now = new Date();
    activeInvestments.forEach(inv => {
      const lastCalc = new Date(inv.last_interest_calc);
      const diffHours = (now.getTime() - lastCalc.getTime()) / (1000 * 60 * 60);
      
      // Calculate interest every 24 hours (simulated for demo, maybe every minute for testing)
      if (diffHours >= 24) {
        const dailyInterest = (inv.amount * (inv.interest_rate / 100));
        const transaction = db.transaction(() => {
          db.prepare('UPDATE users SET balance = balance + ? WHERE id = ?').run(dailyInterest, inv.user_id);
          db.prepare('UPDATE investments SET last_interest_calc = ? WHERE id = ?').run(now.toISOString(), inv.id);
          db.prepare('INSERT INTO transactions (user_id, type, amount, status, details) VALUES (?, ?, ?, ?, ?)')
            .run(inv.user_id, 'interest', dailyInterest, 'completed', `Daily interest from ${inv.plan_id} plan`);
          
          // Check if investment ended
          if (new Date(inv.end_date) <= now) {
            db.prepare('UPDATE investments SET status = ? WHERE id = ?').run('completed', inv.id);
            db.prepare('UPDATE users SET balance = balance + ? WHERE id = ?').run(inv.amount, inv.user_id);
            db.prepare('INSERT INTO transactions (user_id, type, amount, status, details) VALUES (?, ?, ?, ?, ?)')
              .run(inv.user_id, 'payout', inv.amount, 'completed', `Investment principal returned`);
          }
        });
        transaction();
      }
    });
  }, 60000); // Check every minute

  // Vite middleware
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const PORT = 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
