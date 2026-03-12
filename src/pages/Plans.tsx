import React, { useEffect, useState } from 'react';
import { Plan } from '../types';
import { TrendingUp, CheckCircle2, ArrowRight, Zap, ShieldCheck, Clock } from 'lucide-react';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Plans() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [amount, setAmount] = useState<string>('');
  const [investing, setInvesting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    fetch('/api/plans')
      .then(res => res.json())
      .then(setPlans)
      .finally(() => setLoading(false));
  }, []);

  const handleInvest = async () => {
    if (!user) return navigate('/login');
    if (!selectedPlan) return;
    
    setInvesting(true);
    setMessage(null);

    try {
      const res = await fetch('/api/investments/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: selectedPlan.id, amount: parseFloat(amount) })
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: 'success', text: 'Investment successful!' });
        await refreshUser();
        setTimeout(() => {
          setSelectedPlan(null);
          setAmount('');
          setMessage(null);
        }, 2000);
      } else {
        setMessage({ type: 'error', text: data.error });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Something went wrong' });
    } finally {
      setInvesting(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div></div>;

  return (
    <div className="space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">Investment Plans</h1>
        <p className="text-slate-500 max-w-xl mx-auto">Choose a plan that fits your goals. All plans include automated daily interest and principal return upon completion.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div 
            key={plan.id} 
            className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col relative overflow-hidden group hover:border-emerald-200 transition-all"
          >
            {plan.name === 'Professional' && (
              <div className="absolute top-4 right-4 bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                Popular
              </div>
            )}
            
            <div className="space-y-6 flex-1">
              <div>
                <h3 className="text-2xl font-bold text-slate-900">{plan.name}</h3>
                <p className="text-sm text-slate-500 mt-1">{plan.description}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-baseline space-x-1">
                  <span className="text-4xl font-bold text-emerald-600">{plan.interest_rate}%</span>
                  <span className="text-slate-400 font-medium">/ daily</span>
                </div>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">ROI Rate</p>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-50">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Min Investment</span>
                  <span className="font-bold text-slate-900">${plan.min_amount} USDT</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Max Investment</span>
                  <span className="font-bold text-slate-900">${plan.max_amount} USDT</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Duration</span>
                  <span className="font-bold text-slate-900">{plan.duration_days} Days</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Total Profit</span>
                  <span className="font-bold text-emerald-600">{(plan.interest_rate * plan.duration_days).toFixed(1)}%</span>
                </div>
              </div>

              <ul className="space-y-3 pt-6">
                {[
                  'Daily interest payouts',
                  'Principal return at end',
                  '24/7 Support access',
                  'Secure TRC20/ERC20/BEP20'
                ].map((feature, i) => (
                  <li key={i} className="flex items-center space-x-3 text-sm text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button 
              onClick={() => setSelectedPlan(plan)}
              className="mt-8 w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center space-x-2 group-hover:bg-emerald-600"
            >
              <span>Invest Now</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>

      {/* Investment Modal */}
      {selectedPlan && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 space-y-6 shadow-2xl">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold text-slate-900">Invest in {selectedPlan.name}</h3>
              <button onClick={() => setSelectedPlan(null)} className="text-slate-400 hover:text-slate-600">
                <Zap className="w-6 h-6 rotate-45" />
              </button>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Available Balance</span>
                <span className="font-bold text-emerald-600">${user?.balance.toFixed(2)} USDT</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Plan Limits</span>
                <span className="font-bold text-slate-900">${selectedPlan.min_amount} - ${selectedPlan.max_amount}</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Investment Amount (USDT)</label>
              <input 
                type="number"
                placeholder={`Enter amount (min $${selectedPlan.min_amount})`}
                className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            {message && (
              <div className={`p-4 rounded-xl text-sm font-medium ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                {message.text}
              </div>
            )}

            <div className="pt-2">
              <button 
                onClick={handleInvest}
                disabled={investing || !amount}
                className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 disabled:opacity-50"
              >
                {investing ? 'Processing...' : 'Confirm Investment'}
              </button>
            </div>

            <p className="text-[10px] text-slate-400 text-center uppercase tracking-widest font-bold">
              Secure Transaction • Encrypted Data
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
