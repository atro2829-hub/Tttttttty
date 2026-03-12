import React from 'react';
import { useLocation } from 'react-router-dom';

export default function Legal() {
  const location = useLocation();
  const isTerms = location.pathname === '/terms';
  const isPrivacy = location.pathname === '/privacy';
  const isRefund = location.pathname === '/refund';

  const title = isTerms ? 'Terms of Service' : isPrivacy ? 'Privacy Policy' : 'Refund Policy';

  return (
    <div className="max-w-3xl mx-auto bg-white p-12 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 space-y-8">
      <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{title}</h1>
      <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
        <p className="text-sm italic">Last Updated: March 12, 2026</p>
        
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900">1. Introduction</h2>
          <p>Welcome to NexusInvest. These policies govern your use of our platform and services. By accessing or using NexusInvest, you agree to be bound by these terms.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900">2. Investment Risks</h2>
          <p>Digital asset investments carry significant risks. While we strive to provide stable returns, market volatility can affect performance. Never invest more than you can afford to lose.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900">3. Account Security</h2>
          <p>You are responsible for maintaining the confidentiality of your account credentials. We recommend enabling Two-Factor Authentication (2FA) for enhanced security.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900">4. Payments and Withdrawals</h2>
          <p>Deposits and withdrawals are processed via Binance ID and USDT. Ensure you use the correct network (TRC20, ERC20, or BEP20). NexusInvest is not responsible for funds sent to incorrect addresses.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900">5. Privacy</h2>
          <p>We value your privacy and protect your data using industry-standard encryption. We do not share your personal information with third parties except as required by law.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900">6. Refund Policy</h2>
          <p>Due to the nature of digital asset investments and blockchain transactions, all investments are final once processed. Refunds are only issued in exceptional cases at the sole discretion of the management.</p>
        </section>
      </div>
    </div>
  );
}
