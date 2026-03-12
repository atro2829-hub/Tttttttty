import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import { Plan, Investment, Transaction } from '../types';
import { 
  TrendingUp, 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState<{
    balance: number;
    totalInvested: number;
    activeInvestments: Investment[];
    recentTransactions: Transaction[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/user/dashboard')
      .then(res => res.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div></div>;

  // Mock chart data
  const chartData = [
    { name: 'Mon', value: 400 },
    { name: 'Tue', value: 600 },
    { name: 'Wed', value: 500 },
    { name: 'Thu', value: 900 },
    { name: 'Fri', value: 1200 },
    { name: 'Sat', value: 1100 },
    { name: 'Sun', value: 1500 },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Welcome back, {user?.full_name}</h1>
          <p className="text-slate-500 text-sm">Here's what's happening with your investments today.</p>
        </div>
        <div className="flex items-center space-x-3">
          <Link to="/wallet" className="bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 flex items-center space-x-2">
            <ArrowUpRight className="w-4 h-4" />
            <span>Deposit</span>
          </Link>
          <Link to="/wallet" className="bg-white text-slate-900 border border-slate-200 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all flex items-center space-x-2">
            <ArrowDownLeft className="w-4 h-4" />
            <span>Withdraw</span>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
              <Wallet className="w-5 h-5 text-emerald-600" />
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">+12.5%</span>
          </div>
          <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">Available Balance</p>
          <p className="text-2xl font-bold text-slate-900">${data.balance.toFixed(2)} USDT</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">Active</span>
          </div>
          <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">Total Invested</p>
          <p className="text-2xl font-bold text-slate-900">${data.totalInvested.toFixed(2)} USDT</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded-lg">Pending</span>
          </div>
          <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">Expected Profit</p>
          <p className="text-2xl font-bold text-slate-900">${(data.totalInvested * 0.15).toFixed(2)} USDT</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-900">Earnings Overview</h3>
            <select className="text-xs bg-slate-50 border-none rounded-lg focus:ring-0">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Active Investments */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-900">Active Plans</h3>
            <Link to="/plans" className="text-xs font-bold text-emerald-600 hover:text-emerald-700">View All</Link>
          </div>
          <div className="space-y-4">
            {data.activeInvestments.length > 0 ? data.activeInvestments.map((inv) => (
              <div key={inv.id} className="p-4 bg-slate-50 rounded-2xl space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-slate-900">{inv.plan_name}</span>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">Active</span>
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Amount: ${inv.amount}</span>
                  <span>Ends: {new Date(inv.end_date).toLocaleDateString()}</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-2/3 rounded-full" />
                </div>
              </div>
            )) : (
              <div className="text-center py-8">
                <p className="text-sm text-slate-400">No active investments</p>
                <Link to="/plans" className="text-xs font-bold text-emerald-600 mt-2 inline-block">Start Investing</Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex items-center justify-between">
          <h3 className="font-bold text-slate-900">Recent Transactions</h3>
          <Link to="/history" className="text-xs font-bold text-slate-500 hover:text-slate-900 flex items-center">
            View History <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-xs text-slate-400 uppercase tracking-wider">
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {data.recentTransactions.map((tx) => (
                <tr key={tx.id} className="text-sm hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center",
                        tx.type === 'deposit' ? "bg-emerald-50 text-emerald-600" : 
                        tx.type === 'withdrawal' ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600"
                      )}>
                        {tx.type === 'deposit' ? <ArrowDownLeft className="w-4 h-4" /> : 
                         tx.type === 'withdrawal' ? <ArrowUpRight className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
                      </div>
                      <span className="font-bold text-slate-900 capitalize">{tx.type}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-900">
                    {tx.type === 'withdrawal' ? '-' : '+'}${tx.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full",
                      tx.status === 'completed' ? "bg-emerald-100 text-emerald-700" : 
                      tx.status === 'pending' ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"
                    )}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {new Date(tx.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
