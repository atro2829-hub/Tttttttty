import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { Wallet, ArrowUpRight, ArrowDownLeft, ShieldCheck, Copy, CheckCircle2 } from 'lucide-react';

export default function WalletPage() {
  const { user, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw'>('deposit');
  const [method, setMethod] = useState<'binance' | 'usdt_trc20' | 'usdt_erc20' | 'usdt_bep20'>('usdt_trc20');
  const [amount, setAmount] = useState('');
  const [details, setDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const endpoint = activeTab === 'deposit' ? '/api/transactions/deposit' : '/api/transactions/withdraw';
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: parseFloat(amount), method, details })
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: 'success', text: data.message });
        setAmount('');
        setDetails('');
        if (activeTab === 'withdraw') await refreshUser();
      } else {
        setMessage({ type: 'error', text: data.error });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Something went wrong' });
    } finally {
      setLoading(false);
    }
  };

  const depositAddresses = {
    usdt_trc20: 'TXY1234567890ABCDEFGHIJKLMN',
    usdt_erc20: '0x1234567890ABCDEFGHIJKLMN',
    usdt_bep20: '0x1234567890ABCDEFGHIJKLMN',
    binance: '87654321 (NexusInvest Official)'
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Wallet className="w-32 h-32" />
        </div>
        <div className="relative z-10 space-y-4">
          <p className="text-slate-400 text-sm font-medium uppercase tracking-widest">Total Balance</p>
          <h2 className="text-4xl font-bold">${user?.balance.toFixed(2)} <span className="text-emerald-400">USDT</span></h2>
          <div className="flex items-center space-x-4 pt-4">
            <div className="flex items-center space-x-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Secure Wallet</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-slate-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Real-time Updates</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
        <div className="flex border-b border-slate-50">
          <button 
            onClick={() => setActiveTab('deposit')}
            className={`flex-1 py-6 font-bold text-sm transition-all flex items-center justify-center space-x-2 ${activeTab === 'deposit' ? 'text-emerald-600 bg-emerald-50/50 border-b-2 border-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <ArrowUpRight className="w-5 h-5" />
            <span>Deposit Funds</span>
          </button>
          <button 
            onClick={() => setActiveTab('withdraw')}
            className={`flex-1 py-6 font-bold text-sm transition-all flex items-center justify-center space-x-2 ${activeTab === 'withdraw' ? 'text-red-600 bg-red-50/50 border-b-2 border-red-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <ArrowDownLeft className="w-5 h-5" />
            <span>Withdraw Funds</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {message && (
            <div className={`p-4 rounded-xl text-sm font-medium ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
              {message.text}
            </div>
          )}

          <div className="space-y-4">
            <label className="text-sm font-bold text-slate-700">Select Payment Method</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'usdt_trc20', label: 'USDT (TRC20)' },
                { id: 'usdt_erc20', label: 'USDT (ERC20)' },
                { id: 'usdt_bep20', label: 'USDT (BEP20)' },
                { id: 'binance', label: 'Binance ID' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMethod(m.id as any)}
                  className={`p-4 rounded-2xl text-xs font-bold border transition-all ${method === m.id ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-slate-50 border-slate-100 text-slate-500 hover:border-slate-200'}`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {activeTab === 'deposit' && (
            <div className="bg-slate-900 rounded-2xl p-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Deposit Address</span>
                <button 
                  type="button"
                  onClick={() => navigator.clipboard.writeText(depositAddresses[method])}
                  className="text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              <p className="text-white font-mono text-sm break-all bg-white/5 p-3 rounded-xl border border-white/10">
                {depositAddresses[method]}
              </p>
              <p className="text-[10px] text-amber-400 font-medium leading-relaxed">
                * Send only USDT to this address. Sending any other coin may result in permanent loss. 
                Ensure you are using the correct network ({method.split('_')[1]?.toUpperCase() || 'Binance'}).
              </p>
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Amount (USDT)</label>
              <input 
                type="number"
                required
                placeholder="0.00"
                className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">
                {activeTab === 'deposit' ? 'Transaction Hash / Binance ID' : 'Your Wallet Address / Binance ID'}
              </label>
              <input 
                type="text"
                required
                placeholder={activeTab === 'deposit' ? "Paste TXID here" : "Enter your receiving address"}
                className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-5 rounded-2xl font-bold text-white transition-all shadow-lg ${activeTab === 'deposit' ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200' : 'bg-red-600 hover:bg-red-700 shadow-red-200'} disabled:opacity-50`}
          >
            {loading ? 'Processing...' : (activeTab === 'deposit' ? 'Submit Deposit Request' : 'Request Withdrawal')}
          </button>

          <p className="text-[10px] text-slate-400 text-center uppercase tracking-widest font-bold">
            Transactions are processed within 1-24 hours
          </p>
        </form>
      </div>
    </div>
  );
}
