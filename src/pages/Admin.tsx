import React, { useEffect, useState } from 'react';
import { Transaction, User } from '../types';
import { 
  Users, 
  Wallet, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Filter,
  ShieldCheck,
  TrendingUp,
  Mail
} from 'lucide-react';

export default function Admin() {
  const [users, setUsers] = useState<User[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'users' | 'transactions'>('transactions');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [uRes, tRes] = await Promise.all([
        fetch('/api/admin/users'),
        fetch('/api/admin/transactions')
      ]);
      setUsers(await uRes.json());
      setTransactions(await tRes.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApprove = async (id: number) => {
    if (!confirm('Are you sure you want to approve this transaction?')) return;
    const res = await fetch(`/api/admin/transactions/${id}/approve`, { method: 'POST' });
    if (res.ok) fetchData();
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div></div>;

  const stats = [
    { label: 'Total Users', value: users.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Pending Tx', value: transactions.filter(t => t.status === 'pending').length, icon: Wallet, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Total Volume', value: `$${transactions.filter(t => t.status === 'completed').reduce((s, t) => s + t.amount, 0).toFixed(0)}`, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center space-x-2">
          <ShieldCheck className="w-7 h-7 text-emerald-600" />
          <span>Admin Control Center</span>
        </h1>
        <button onClick={fetchData} className="text-sm font-bold text-emerald-600 hover:text-emerald-700">Refresh Data</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center space-x-4">
            <div className={`w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
        <div className="flex border-b border-slate-50">
          <button 
            onClick={() => setActiveTab('transactions')}
            className={`flex-1 py-6 font-bold text-sm transition-all ${activeTab === 'transactions' ? 'text-emerald-600 bg-emerald-50/50 border-b-2 border-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Manage Transactions
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`flex-1 py-6 font-bold text-sm transition-all ${activeTab === 'users' ? 'text-emerald-600 bg-emerald-50/50 border-b-2 border-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            User Management
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'transactions' ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-xs text-slate-400 uppercase tracking-wider">
                    <th className="px-6 py-4 font-medium">User</th>
                    <th className="px-6 py-4 font-medium">Type</th>
                    <th className="px-6 py-4 font-medium">Amount</th>
                    <th className="px-6 py-4 font-medium">Method</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="text-sm hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900">{tx.user_email}</td>
                      <td className="px-6 py-4 capitalize">{tx.type}</td>
                      <td className="px-6 py-4 font-bold">${tx.amount.toFixed(2)}</td>
                      <td className="px-6 py-4 text-xs font-mono">{tx.method}</td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${tx.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : tx.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {tx.status === 'pending' && (
                          <div className="flex items-center space-x-2">
                            <button 
                              onClick={() => handleApprove(tx.id)}
                              className="p-1.5 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200 transition-colors"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                            <button className="p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors">
                              <XCircle className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-xs text-slate-400 uppercase tracking-wider">
                    <th className="px-6 py-4 font-medium">User</th>
                    <th className="px-6 py-4 font-medium">Balance</th>
                    <th className="px-6 py-4 font-medium">Role</th>
                    <th className="px-6 py-4 font-medium">Joined</th>
                    <th className="px-6 py-4 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {users.map((u) => (
                    <tr key={u.id} className="text-sm hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-900">{u.full_name}</span>
                          <span className="text-xs text-slate-500">{u.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-bold text-emerald-600">${u.balance.toFixed(2)}</td>
                      <td className="px-6 py-4 capitalize">{u.role}</td>
                      <td className="px-6 py-4 text-slate-500">{new Date(u.created_at as any).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <button className="text-xs font-bold text-red-600 hover:text-red-700">Block</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
