import React, { useState } from 'react';
import { HelpCircle, Mail, Phone, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';

export default function Support() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    { q: 'How do I start investing?', a: 'To start investing, create an account, deposit funds via Binance ID or USDT, and choose an investment plan that suits your goals.' },
    { q: 'What is the minimum deposit?', a: 'The minimum deposit depends on the investment plan you choose. Our Starter plan begins at just $10 USDT.' },
    { q: 'How long do withdrawals take?', a: 'Withdrawals are processed manually by our team for security reasons and typically take between 1 to 24 hours.' },
    { q: 'Is my investment secure?', a: 'Yes, we use industry-standard SSL encryption and secure payment gateways. Our platform is built with multiple layers of security to protect your assets.' },
    { q: 'What networks do you support for USDT?', a: 'We support USDT on TRC20, ERC20, and BEP20 networks. Please ensure you use the correct network when making a deposit.' },
  ];

  return (
    <div className="space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">Support Center</h1>
        <p className="text-slate-500 max-w-xl mx-auto">Have questions? We're here to help you 24/7. Contact us through any of the channels below.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: Mail, label: 'Email Support', value: 'support@nexusinvest.com', color: 'bg-blue-50 text-blue-600' },
          { icon: Phone, label: 'Phone Support', value: '+1 (888) NEXUS-INV', color: 'bg-emerald-50 text-emerald-600' },
          { icon: MessageSquare, label: 'Live Chat', value: 'Available 24/7', color: 'bg-purple-50 text-purple-600' },
        ].map((item, i) => (
          <div key={i} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm text-center space-y-4">
            <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center mx-auto`}>
              <item.icon className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium uppercase tracking-wider mb-1">{item.label}</p>
              <p className="text-lg font-bold text-slate-900">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-slate-900">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                <button 
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
                >
                  <span className="font-bold text-slate-900">{faq.q}</span>
                  {openFaq === i ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 text-slate-500 text-sm leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 space-y-6">
          <h2 className="text-2xl font-bold text-slate-900">Send us a Message</h2>
          <form className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Name</label>
                <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none" placeholder="John Doe" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Email</label>
                <input type="email" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none" placeholder="john@example.com" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Subject</label>
              <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none" placeholder="How can we help?" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Message</label>
              <textarea rows={4} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none" placeholder="Describe your issue in detail..."></textarea>
            </div>
            <button className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100">
              Submit Inquiry
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
