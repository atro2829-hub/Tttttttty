import React from 'react';
import { useAuth } from '../AuthContext';
import { Users, Copy, CheckCircle2, TrendingUp, Gift, Share2 } from 'lucide-react';

export default function Referrals() {
  const { user } = useAuth();
  const referralLink = `${window.location.origin}/register?ref=${user?.referral_code}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    alert('Referral link copied to clipboard!');
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Referral Program</h1>
        <p className="text-slate-500">Invite your friends to NexusInvest and earn 10% commission on every deposit they make. There's no limit to how much you can earn!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 space-y-6">
          <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center">
            <Gift className="w-7 h-7 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Your Referral Link</h2>
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
              <span className="text-sm font-mono text-slate-600 truncate mr-4">{referralLink}</span>
              <button onClick={copyToClipboard} className="p-2 text-emerald-600 hover:bg-emerald-100 rounded-xl transition-colors">
                <Copy className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center justify-center space-x-4">
              <button className="flex-1 bg-slate-900 text-white py-4 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all flex items-center justify-center space-x-2">
                <Share2 className="w-4 h-4" />
                <span>Share Link</span>
              </button>
            </div>
          </div>
          <div className="pt-4 border-t border-slate-50">
            <div className="flex items-center space-x-3 text-sm text-slate-500">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>10% Instant Commission</span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-slate-500 mt-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Unlimited Referrals</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Users className="w-32 h-32" />
          </div>
          <div className="relative z-10 space-y-6">
            <h2 className="text-2xl font-bold">Referral Statistics</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                <p className="text-slate-400 text-xs font-medium uppercase tracking-widest mb-1">Total Referrals</p>
                <p className="text-3xl font-bold">0</p>
              </div>
              <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                <p className="text-slate-400 text-xs font-medium uppercase tracking-widest mb-1">Total Earned</p>
                <p className="text-3xl font-bold text-emerald-400">$0.00</p>
              </div>
            </div>
            <div className="bg-emerald-500/10 p-6 rounded-2xl border border-emerald-500/20 flex items-center space-x-4">
              <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold">Referral Bonus</p>
                <p className="text-xs text-slate-400">Earned from your network this month</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
        <div className="p-8 border-b border-slate-50">
          <h3 className="font-bold text-slate-900">Your Referral Network</h3>
        </div>
        <div className="p-12 text-center space-y-4">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
            <Users className="w-8 h-8 text-slate-300" />
          </div>
          <p className="text-slate-400 font-medium">You haven't referred anyone yet.</p>
          <button onClick={copyToClipboard} className="text-sm font-bold text-emerald-600 hover:text-emerald-700">Invite Friends</button>
        </div>
      </div>
    </div>
  );
}
