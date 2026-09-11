import React from 'react';
import { X, Sparkles, Clock, CheckCircle2, Zap, RefreshCw } from 'lucide-react';
import { User } from '../types';

interface CreditModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  msUntilReset: number;
  onRefreshCredits: () => void;
}

export const CreditModal: React.FC<CreditModalProps> = ({
  isOpen,
  onClose,
  user,
  msUntilReset,
  onRefreshCredits,
}) => {
  if (!isOpen) return null;

  const formatCountdown = (ms: number) => {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000));
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`;
  };

  const credits = user?.credits ?? 5;
  const maxCredits = user?.maxCredits ?? 5;
  const percentage = Math.round((credits / maxCredits) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div
        id="credit-modal-card"
        className="w-full max-w-lg bg-[#0f1220] border border-purple-500/30 rounded-2xl p-6 sm:p-8 relative shadow-2xl shadow-purple-900/40 overflow-hidden"
      >
        {/* Background glow effects */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close button */}
        <button
          id="close-credits-modal-btn"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-purple-600 to-cyan-500 p-0.5 flex items-center justify-center">
            <div className="w-full h-full bg-[#121626] rounded-[10px] flex items-center justify-center">
              <Zap className="w-6 h-6 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold font-display text-white">Daily Credit Allowance</h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30">
                Free Plan
              </span>
            </div>
            <p className="text-xs text-slate-400">Generations reset every 24 hours at midnight UTC</p>
          </div>
        </div>

        {/* Credit Gauge Card */}
        <div className="p-5 rounded-xl bg-[#14182b]/80 border border-white/10 mb-6">
          <div className="flex justify-between items-end mb-2">
            <div>
              <span className="text-3xl font-extrabold font-display text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-white to-cyan-300">
                {credits} / {maxCredits}
              </span>
              <span className="text-xs text-slate-400 block mt-0.5">generations remaining today</span>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1.5 text-xs text-purple-300 font-medium bg-purple-950/50 px-2.5 py-1 rounded-lg border border-purple-500/20">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>{formatCountdown(msUntilReset)}</span>
              </div>
              <span className="text-[10px] text-slate-500 block mt-1">until midnight UTC reset</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-800/80 rounded-full h-2.5 overflow-hidden p-0.5 border border-white/5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* Plan perks breakdown */}
        <div className="space-y-2.5 mb-6">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Included in Free Plan</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2 text-slate-300 bg-white/[0.02] p-2 rounded-lg border border-white/[0.04]">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>5 daily image generations</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300 bg-white/[0.02] p-2 rounded-lg border border-white/[0.04]">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Standard & HD resolution</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300 bg-white/[0.02] p-2 rounded-lg border border-white/[0.04]">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Access to all 10+ art styles</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300 bg-white/[0.02] p-2 rounded-lg border border-white/[0.04]">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Personal gallery & favorites</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300 bg-white/[0.02] p-2 rounded-lg border border-white/[0.04]">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Gemini AI Prompt Enhancer</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300 bg-white/[0.02] p-2 rounded-lg border border-white/[0.04]">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Prompt marketplace & community</span>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between gap-3 pt-4 border-t border-white/10">
          <button
            id="refresh-credits-btn"
            onClick={onRefreshCredits}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
            <span>Check Status</span>
          </button>

          <button
            id="close-credits-done-btn"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/30 hover:brightness-110 active:scale-95 transition-all"
          >
            Start Creating
          </button>
        </div>
      </div>
    </div>
  );
};
