import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, ShieldCheck, Zap, Globe, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

export default function Home() {
  return (
    <div className="space-y-24 pb-24">
      {/* Hero Section */}
      <section className="relative pt-12">
        <div className="text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center space-x-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium border border-emerald-100"
          >
            <Zap className="w-4 h-4" />
            <span>New: High-yield Elite plans now live</span>
          </motion.div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-slate-900 tracking-tight leading-tight">
            The Future of <br />
            <span className="text-emerald-600">Digital Investment</span>
          </h1>
          
          <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Maximize your wealth with our secure, automated investment platform. 
            Supporting Binance ID and USDT payments on TRC20, ERC20, and BEP20 networks.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link 
              to="/register" 
              className="w-full sm:w-auto bg-emerald-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 flex items-center justify-center space-x-2"
            >
              <span>Get Started Now</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              to="/plans" 
              className="w-full sm:w-auto bg-white text-slate-900 border border-slate-200 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all flex items-center justify-center"
            >
              View Plans
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: 'Active Investors', value: '12,400+', icon: Globe },
          { label: 'Total Invested', value: '$45.2M+', icon: TrendingUp },
          { label: 'Security Rating', value: 'AAA+', icon: ShieldCheck },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex items-center space-x-6">
            <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center">
              <stat.icon className="w-7 h-7 text-emerald-600" />
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">{stat.label}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Features Section */}
      <section className="space-y-16">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Why Choose NexusInvest?</h2>
          <p className="text-slate-500 max-w-xl mx-auto">We provide the tools and security you need to grow your digital assets with confidence.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { title: 'Automated Earnings', desc: 'Our smart algorithms calculate and credit your interest daily without any manual effort.', icon: Zap },
            { title: 'Secure Payments', desc: 'Direct integration with Binance ID and USDT on multiple networks for instant deposits.', icon: ShieldCheck },
            { title: 'Referral Rewards', desc: 'Earn 10% commission on every deposit made by users you refer to the platform.', icon: Users },
            { title: 'Real-time Tracking', desc: 'Monitor your investments and earnings in real-time through our intuitive dashboard.', icon: LayoutDashboard },
            { title: '24/7 Support', desc: 'Our dedicated support team is always available to help you with any questions.', icon: HelpCircle },
            { title: 'Flexible Plans', desc: 'Choose from a variety of investment plans tailored to your financial goals.', icon: TrendingUp },
          ].map((feature, i) => (
            <div key={i} className="bg-white p-8 rounded-3xl border border-slate-100 hover:border-emerald-200 transition-all group">
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <feature.icon className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-slate-900 rounded-[3rem] p-12 md:p-24 text-center space-y-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[100%] bg-emerald-500 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[100%] bg-blue-500 rounded-full blur-[120px]" />
        </div>
        
        <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Ready to start earning?</h2>
        <p className="text-slate-400 max-w-xl mx-auto text-lg">
          Join thousands of investors worldwide and start your journey to financial freedom today.
        </p>
        <div className="pt-4">
          <Link 
            to="/register" 
            className="inline-flex items-center space-x-2 bg-emerald-500 text-white px-10 py-5 rounded-2xl font-bold text-xl hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-500/20"
          >
            <span>Create Free Account</span>
            <ArrowRight className="w-6 h-6" />
          </Link>
        </div>
        <div className="flex items-center justify-center space-x-8 pt-8 text-slate-500 text-sm font-medium">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>No Hidden Fees</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Instant Withdrawals</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Secure & Encrypted</span>
          </div>
        </div>
      </section>
    </div>
  );
}

import { LayoutDashboard, HelpCircle, Users } from 'lucide-react';
