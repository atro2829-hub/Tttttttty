export interface User {
  id: number;
  email: string;
  full_name: string;
  role: 'user' | 'admin';
  balance: number;
  referral_code: string;
  binance_id?: string;
  usdt_address?: string;
}

export interface Plan {
  id: number;
  name: string;
  min_amount: number;
  max_amount: number;
  interest_rate: number;
  duration_days: number;
  description: string;
}

export interface Investment {
  id: number;
  plan_id: number;
  plan_name: string;
  amount: number;
  start_date: string;
  end_date: string;
  status: 'active' | 'completed';
}

export interface Transaction {
  id: number;
  type: 'deposit' | 'withdrawal' | 'interest' | 'referral' | 'investment' | 'payout';
  amount: number;
  method?: string;
  status: 'pending' | 'completed' | 'failed';
  details: string;
  created_at: string;
  user_email?: string;
}
