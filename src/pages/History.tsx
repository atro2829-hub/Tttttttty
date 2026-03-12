import React, { useEffect, useState } from 'react';
import { Transaction } from '../types';
import { History as HistoryIcon, ArrowUpRight, ArrowDownLeft, TrendingUp, Filter, Search, ChevronRight } from 'lucide-react';

export default function History() {
  const [history, setHistory] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/transactions/history')
      .then(res => res.json())
      .then(setHistory)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div></div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Transaction History</h1>
          <p className="text-slate-500 text-sm">View all your deposits, withdrawals, and earnings.</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input type="text" placeholder="Search..." className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
          </div>
          <button className="p-2 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-slate-900">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-xs text-slate-400 uppercase tracking-wider">
                <th className="px-6 py-5 font-medium">Type</th>
                <th className="px-6 py-5 font-medium">Amount</th>
                <th className="px-6 py-5 font-medium">Method/Details</th>
                <th className="px-6 py-5 font-medium">Status</th>
                <th className="px-6 py-5 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {history.length > 0 ? history.map((tx) => (
                <tr key={tx.id} className="text-sm hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-5">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        tx.type === 'deposit' ? "bg-emerald-50 text-emerald-600" : 
                        tx.type === 'withdrawal' ? "bg-red-50 text-red-600" : 
                        tx.type === 'interest' ? "bg-blue-50 text-blue-600" : "bg-purple-50 text-purple-600"
                      }`}>
                        {tx.type === 'deposit' ? <ArrowDownLeft className="w-5 h-5" /> : 
                         tx.type === 'withdrawal' ? <ArrowUpRight className="w-5 h-5" /> : <TrendingUp className="w-5 h-5" />}
                      </div>
                      <span className="font-bold text-slate-900 capitalize">{tx.type}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 font-bold text-slate-900">
                    {tx.type === 'withdrawal' ? '-' : '+'}${tx.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="text-slate-700 font-medium">{tx.method || 'Internal'}</span>
                      <span className="text-[10px] text-slate-400 font-mono truncate max-w-[150px]">{tx.details}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${
                      tx.status === 'completed' ? "bg-emerald-100 text-emerald-700" : 
                      tx.status === 'pending' ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"
                    }`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-slate-500">
                    {new Date(tx.created_at).toLocaleString()}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-6 py-24 text-center">
                    <div className="flex flex-col items-center space-y-4">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
                        <HistoryIcon className="w-8 h-8 text-slate-300" />
                      </div>
                      <p className="text-slate-400 font-medium">No transactions found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


