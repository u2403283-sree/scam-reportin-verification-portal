import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShieldAlert, Lock, Mail, ArrowRight, Sparkles, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { useToast } from '../context/ToastContext.tsx';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginAsDemoUser, loginAsDemoAdmin } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const redirectPath = (location.state as any)?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      showToast('Signed in successfully!', 'success');
      navigate(redirectPath);
    } catch (err: any) {
      setError(err.message || 'Invalid credentials. Try using demo quick-fill.');
      showToast(err.message || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoUser = async () => {
    setLoading(true);
    try {
      await loginAsDemoUser();
      showToast('Logged in as Demo Citizen User', 'success');
      navigate(redirectPath);
    } catch (err: any) {
      showToast('Demo login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoAdmin = async () => {
    setLoading(true);
    try {
      await loginAsDemoAdmin();
      showToast('Logged in as Cyber Security Admin', 'success');
      navigate('/admin');
    } catch (err: any) {
      showToast('Admin demo login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Brand */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-2.5 rounded-xl bg-sky-950/80 border border-sky-500/40 text-sky-400">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Sign In to ScamShield
          </h1>
          <p className="text-xs text-slate-400">
            Access your scam reports, track status updates, and verify suspicious contacts.
          </p>
        </div>

        {/* Quick Demo Credentials Panel */}
        <div className="glass-panel p-4 rounded-xl border border-sky-500/30 bg-sky-950/20 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono text-sky-400 font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> One-Click Demo Access
            </span>
            <span className="text-[10px] text-slate-400 font-mono">No typing required</span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={handleDemoUser}
              className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 hover:border-sky-500 text-slate-200 text-xs font-semibold transition-colors flex flex-col items-start cursor-pointer"
            >
              <span className="text-white text-[11px]">Demo Citizen</span>
              <span className="text-[10px] text-sky-400 font-mono">Aarav Sharma</span>
            </button>

            <button
              type="button"
              onClick={handleDemoAdmin}
              className="px-3 py-2 rounded-lg bg-slate-900 border border-purple-800/60 hover:border-purple-500 text-slate-200 text-xs font-semibold transition-colors flex flex-col items-start cursor-pointer"
            >
              <span className="text-white text-[11px]">Demo Admin</span>
              <span className="text-[10px] text-purple-400 font-mono">Security Officer</span>
            </button>
          </div>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
          {error && (
            <div className="p-3 rounded-lg bg-rose-950/50 border border-rose-800/60 text-xs text-rose-300">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@scamshield.demo"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs font-mono focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-10 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs font-mono focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 disabled:bg-slate-800 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-sky-600/30"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <span>Sign In</span>
            )}
          </button>

          <div className="pt-2 text-center text-xs text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-sky-400 hover:underline">
              Register here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
