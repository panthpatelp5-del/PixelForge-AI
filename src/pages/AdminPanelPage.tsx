import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Zap,
  Users,
  HardDrive,
  AlertTriangle,
  RefreshCw,
  Plus,
  Minus,
  CheckCircle2,
  Activity,
  Server,
  Lock,
} from 'lucide-react';
import { User, PageId } from '../types';

interface AdminPanelPageProps {
  user: User | null;
  onRefreshCredits: () => void;
  onNavigate: (page: PageId) => void;
  onLoginAsAdmin: () => void;
}

export const AdminPanelPage: React.FC<AdminPanelPageProps> = ({
  user,
  onRefreshCredits,
  onNavigate,
  onLoginAsAdmin,
}) => {
  const [stats, setStats] = useState({
    totalGenerations: 1248,
    activeUsers: 86,
    storageUsedMB: 412,
    abuseIncidents: 0,
  });

  const [managedUsers, setManagedUsers] = useState<User[]>([
    {
      id: 'user-admin',
      username: 'PixelAdmin',
      email: 'admin@pixelforge.ai',
      credits: 50,
      maxCredits: 50,
      role: 'admin',
      plan: 'Unlimited Admin',
    },
    {
      id: 'user-creator',
      username: 'CreativePioneer',
      email: 'creator@pixelforge.ai',
      credits: 4,
      maxCredits: 5,
      role: 'creator',
      plan: 'Free Plan',
    },
    {
      id: 'user-kai',
      username: 'AuraDreamer',
      email: 'kai@example.com',
      credits: 2,
      maxCredits: 5,
      role: 'creator',
      plan: 'Free Plan',
    },
    {
      id: 'user-starlight',
      username: 'StarlightNomad',
      email: 'starlight@example.com',
      credits: 5,
      maxCredits: 5,
      role: 'creator',
      plan: 'Free Plan',
    },
  ]);

  const [notification, setNotification] = useState<string | null>(null);

  // Fetch live admin stats
  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      const data = await res.json();
      if (data.stats) {
        setStats(data.stats);
      }
      if (data.users && Array.isArray(data.users) && data.users.length > 0) {
        setManagedUsers(data.users);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleAdjustCredits = async (targetUserId: string, delta: number) => {
    const target = managedUsers.find((u) => u.id === targetUserId);
    if (!target) return;

    const newCredits = Math.max(0, target.credits + delta);

    try {
      await fetch('/api/admin/credits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: targetUserId, credits: newCredits }),
      });

      setManagedUsers((prev) =>
        prev.map((u) => (u.id === targetUserId ? { ...u, credits: newCredits } : u))
      );

      setNotification(`Updated credits for ${target.username} to ${newCredits}`);
      setTimeout(() => setNotification(null), 2500);
      onRefreshCredits();
    } catch (e) {
      console.error(e);
    }
  };

  const handleResetAllDailyCredits = async () => {
    try {
      const res = await fetch('/api/admin/reset-all-credits', {
        method: 'POST',
      });
      if (res.ok) {
        const data = await res.json();
        if (data.users) {
          setManagedUsers(data.users);
        }
      }
    } catch (err) {
      console.error(err);
    }
    setManagedUsers((prev) =>
      prev.map((u) => ({ ...u, credits: u.maxCredits }))
    );
    setNotification('Daily reset triggered for all users (5/5 credits)');
    setTimeout(() => setNotification(null), 2500);
    onRefreshCredits();
  };

  // If user is not admin, show switch toggle
  if (user?.role !== 'admin') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
          <Lock className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-2xl font-bold font-display text-white">Administrator Access Required</h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto mt-1">
            The admin console allows monitoring system generation metrics, daily credit allocations, and rate limits.
          </p>
        </div>

        <button
          id="admin-switch-demo-btn"
          onClick={onLoginAsAdmin}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-purple-600 to-cyan-500 hover:brightness-110 text-white font-semibold text-xs shadow-lg shadow-amber-500/25 transition-all"
        >
          Sign in as Admin Demo (PixelAdmin)
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-white">
              System Admin Console
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
              Admin Mode
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time management for user allowances, generation telemetry, and model health
          </p>
        </div>

        <button
          id="admin-reset-all-btn"
          onClick={handleResetAllDailyCredits}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md shadow-purple-600/30 transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Force Midnight Reset (All Users)</span>
        </button>
      </div>

      {notification && (
        <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* 4 SYSTEM STAT CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 rounded-2xl bg-[#0f1220] border border-white/[0.08] space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total Generations</span>
            <Activity className="w-4 h-4 text-purple-400" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-white block">
            {stats.totalGenerations}
          </span>
          <span className="text-[10px] text-emerald-400 font-medium">99.8% Successful</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#0f1220] border border-white/[0.08] space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Active Creators</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-white block">
            {stats.activeUsers}
          </span>
          <span className="text-[10px] text-slate-400 font-medium">Within last 24h</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#0f1220] border border-white/[0.08] space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Storage Utilized</span>
            <HardDrive className="w-4 h-4 text-amber-400" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-white block">
            {stats.storageUsedMB} MB
          </span>
          <span className="text-[10px] text-slate-400 font-medium">JSON + Base64 cache</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#0f1220] border border-white/[0.08] space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Abuse Incidents</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-rose-300 block">
            {stats.abuseIncidents}
          </span>
          <span className="text-[10px] text-slate-400 font-medium">Rate limiter active</span>
        </div>
      </div>

      {/* AI BACKEND HEALTH STATUS */}
      <div className="p-6 rounded-2xl bg-[#0f1220] border border-white/[0.08] space-y-4">
        <h3 className="text-sm font-bold font-display text-white uppercase tracking-wider">
          AI Model Runtime Health
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <Server className="w-4 h-4 text-purple-400" />
              <div>
                <span className="font-semibold text-white block">Gemini 3.8 Flash</span>
                <span className="text-[10px] text-slate-400">Prompt Enhancement</span>
              </div>
            </div>
            <span className="text-[11px] font-bold text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              Operational
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <Server className="w-4 h-4 text-cyan-400" />
              <div>
                <span className="font-semibold text-white block">Imagen 3 Model</span>
                <span className="text-[10px] text-slate-400">Text-to-Image Synth</span>
              </div>
            </div>
            <span className="text-[11px] font-bold text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              Operational
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <Server className="w-4 h-4 text-pink-400" />
              <div>
                <span className="font-semibold text-white block">Gemini Multimodal</span>
                <span className="text-[10px] text-slate-400">Image Editor & Vision</span>
              </div>
            </div>
            <span className="text-[11px] font-bold text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              Operational
            </span>
          </div>
        </div>
      </div>

      {/* USER MANAGEMENT TABLE */}
      <div className="p-6 rounded-2xl bg-[#0f1220] border border-white/[0.08] space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold font-display text-white uppercase tracking-wider">
            User Account & Credit Management
          </h3>
          <span className="text-xs text-slate-400">{managedUsers.length} Users Listed</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-white/[0.08] text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="pb-3 px-2">User</th>
                <th className="pb-3 px-2">Role</th>
                <th className="pb-3 px-2">Tier</th>
                <th className="pb-3 px-2">Daily Credits</th>
                <th className="pb-3 px-2 text-right">Quick Credit Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {managedUsers.map((u) => (
                <tr key={u.id} className="hover:bg-white/[0.02]">
                  <td className="py-3 px-2">
                    <span className="font-semibold text-white block">{u.username}</span>
                    <span className="text-[10px] text-slate-500">{u.email}</span>
                  </td>
                  <td className="py-3 px-2">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                        u.role === 'admin'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-white/[0.04] text-slate-300'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-slate-400">{u.plan || 'Free'}</td>
                  <td className="py-3 px-2">
                    <span className="font-bold text-cyan-300">
                      {u.credits} / {u.maxCredits}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        id={`credit-minus-${u.id}`}
                        onClick={() => handleAdjustCredits(u.id, -1)}
                        className="p-1 rounded-md bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 transition-colors"
                        title="Deduct 1 credit"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <button
                        id={`credit-plus-${u.id}`}
                        onClick={() => handleAdjustCredits(u.id, 1)}
                        className="p-1 rounded-md bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 transition-colors"
                        title="Add 1 credit"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                      <button
                        id={`credit-topup5-${u.id}`}
                        onClick={() => handleAdjustCredits(u.id, 5)}
                        className="px-2 py-1 rounded-md bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-[10px] font-semibold text-purple-200 transition-colors"
                      >
                        +5 Grant
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
