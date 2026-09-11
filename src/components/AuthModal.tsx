import React, { useState } from 'react';
import { X, Sparkles, User, Mail, ShieldCheck } from 'lucide-react';
import { User as UserType } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserType) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.trim() || 'Creator',
          email: email.trim() || `${username.toLowerCase() || 'creator'}@pixelforge.ai`,
        }),
      });
      const data = await res.json();
      if (data.user) {
        onLoginSuccess(data.user);
        onClose();
      } else {
        setError(data.error || 'Authentication failed');
      }
    } catch (err: any) {
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (role: 'creator' | 'admin') => {
    setLoading(true);
    try {
      const demoUser = role === 'admin'
        ? { username: 'PixelAdmin', email: 'admin@pixelforge.ai' }
        : { username: 'CreativePioneer', email: 'creator@pixelforge.ai' };

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(demoUser),
      });
      const data = await res.json();
      if (data.user) {
        onLoginSuccess(data.user);
        onClose();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div
        id="auth-modal-card"
        className="w-full max-w-md bg-[#0f1220] border border-purple-500/30 rounded-2xl p-6 sm:p-8 relative shadow-2xl shadow-purple-950/50 overflow-hidden"
      >
        <button
          id="close-auth-modal-btn"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-cyan-400 p-0.5 flex items-center justify-center">
            <div className="w-full h-full bg-[#111422] rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold font-display text-white">
              {mode === 'signin' ? 'Welcome back to PixelForge' : 'Create PixelForge Account'}
            </h3>
            <p className="text-xs text-slate-400">Claim your 5 daily AI image generation credits</p>
          </div>
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-xl bg-red-950/50 border border-red-500/30 text-xs text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 mb-5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Username</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                id="auth-username-input"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. CyberArtist"
                className="w-full bg-[#161a2b] border border-white/10 focus:border-purple-500 rounded-xl py-2.5 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                id="auth-email-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="artist@example.com"
                className="w-full bg-[#161a2b] border border-white/10 focus:border-purple-500 rounded-xl py-2.5 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all"
                required
              />
            </div>
          </div>

          <button
            id="auth-submit-btn"
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/30 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : mode === 'signin' ? 'Sign In & Get Credits' : 'Create Free Account'}
          </button>
        </form>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/[0.08]" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase">
            <span className="bg-[#0f1220] px-2 text-slate-500 font-semibold tracking-wider">Demo Accounts</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            id="auth-demo-creator-btn"
            type="button"
            onClick={() => handleQuickDemo('creator')}
            className="p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 text-xs text-slate-300 text-center transition-colors"
          >
            <span className="font-semibold text-purple-300 block">Creator Demo</span>
            <span className="text-[10px] text-slate-400">Standard Tier</span>
          </button>

          <button
            id="auth-demo-admin-btn"
            type="button"
            onClick={() => handleQuickDemo('admin')}
            className="p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 text-xs text-slate-300 text-center transition-colors"
          >
            <div className="flex items-center justify-center gap-1 font-semibold text-cyan-300">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Demo</span>
            </div>
            <span className="text-[10px] text-slate-400">Full Controls</span>
          </button>
        </div>

        <div className="text-center mt-5">
          <button
            type="button"
            onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
            className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
          >
            {mode === 'signin' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
};
