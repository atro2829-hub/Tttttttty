import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Wallet, 
  History, 
  Users, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  ShieldCheck,
  Home as HomeIcon,
  HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, auth: true },
    { name: 'Invest', path: '/plans', icon: TrendingUp, auth: true },
    { name: 'Wallet', path: '/wallet', icon: Wallet, auth: true },
    { name: 'History', path: '/history', icon: History, auth: true },
    { name: 'Referrals', path: '/referrals', icon: Users, auth: true },
    { name: 'Support', path: '/support', icon: HelpCircle, auth: false },
    { name: 'Admin', path: '/admin', icon: ShieldCheck, auth: true, adminOnly: true },
  ];

  const filteredNavItems = navItems.filter(item => {
    if (item.adminOnly && user?.role !== 'admin') return false;
    if (item.auth && !user) return false;
    return true;
  });

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                  <TrendingUp className="text-white w-5 h-5" />
                </div>
                <span className="text-xl font-bold text-slate-900 tracking-tight">NexusInvest</span>
              </Link>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <>
                  <div className="mr-4 text-right">
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Balance</p>
                    <p className="text-sm font-bold text-emerald-600">${user.balance.toFixed(2)} USDT</p>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="p-2 text-slate-500 hover:text-red-600 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900">Login</Link>
                  <Link to="/register" className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors">Get Started</Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center md:hidden">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-slate-500"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar (Desktop) */}
        {user && (
          <aside className="hidden md:flex w-64 flex-col bg-white border-r border-slate-200 p-4 space-y-1">
            {filteredNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                  location.pathname === item.path 
                    ? "bg-emerald-50 text-emerald-700 shadow-sm" 
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            ))}
          </aside>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-5xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Mobile Nav (Bottom) */}
      {user && (
        <nav className="md:hidden bg-white border-t border-slate-200 px-4 py-2 flex justify-around items-center sticky bottom-0 z-50">
          {filteredNavItems.slice(0, 5).map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center p-2 rounded-lg transition-colors",
                location.pathname === item.path ? "text-emerald-600" : "text-slate-400"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] mt-1 font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>
      )}

      {/* Footer */}
      {!user && (
        <footer className="bg-white border-t border-slate-200 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                    <TrendingUp className="text-white w-5 h-5" />
                  </div>
                  <span className="text-xl font-bold text-slate-900">NexusInvest</span>
                </div>
                <p className="text-slate-500 text-sm max-w-xs">
                  The world's most trusted digital asset investment platform. Secure, transparent, and high-yielding.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 mb-4">Platform</h4>
                <ul className="space-y-2 text-sm text-slate-500">
                  <li><Link to="/plans" className="hover:text-emerald-600">Investment Plans</Link></li>
                  <li><Link to="/support" className="hover:text-emerald-600">Support Center</Link></li>
                  <li><Link to="/faq" className="hover:text-emerald-600">FAQs</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 mb-4">Legal</h4>
                <ul className="space-y-2 text-sm text-slate-500">
                  <li><Link to="/terms" className="hover:text-emerald-600">Terms of Service</Link></li>
                  <li><Link to="/privacy" className="hover:text-emerald-600">Privacy Policy</Link></li>
                  <li><Link to="/refund" className="hover:text-emerald-600">Refund Policy</Link></li>
                </ul>
              </div>
            </div>
            <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center text-sm text-slate-400">
              <p>© 2026 NexusInvest. All rights reserved.</p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <span>Binance ID Payments</span>
                <span>USDT (TRC20/ERC20/BEP20)</span>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
