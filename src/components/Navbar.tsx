import React from 'react';
import { Sparkles, Wand2, Image as ImageIcon, UserCheck, Shield, Compass, BookOpen, Layers, Flame, Clock } from 'lucide-react';
import { PageId, User } from '../types';

interface NavbarProps {
  currentPage: PageId;
  setCurrentPage: (page: PageId) => void;
  user: User | null;
  msUntilReset: number;
  onOpenCreditsModal: () => void;
  onOpenAuthModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  setCurrentPage,
  user,
  msUntilReset,
  onOpenCreditsModal,
  onOpenAuthModal,
}) => {
  // Format countdown ms to HH:MM:SS
  const formatCountdown = (ms: number) => {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000));
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`;
  };

  const navItems: { id: PageId; label: string; icon: React.ReactNode }[] = [
    { id: 'create', label: 'Studio', icon: <Sparkles className="w-4 h-4 text-purple-400" /> },
    { id: 'editor', label: 'Editor', icon: <Wand2 className="w-4 h-4 text-pink-400" /> },
    { id: 'avatar', label: 'Avatars', icon: <UserCheck className="w-4 h-4 text-cyan-400" /> },
    { id: 'logo', label: 'Logos', icon: <Layers className="w-4 h-4 text-amber-400" /> },
    { id: 'wallpaper', label: 'Wallpapers', icon: <ImageIcon className="w-4 h-4 text-emerald-400" /> },
    { id: 'community', label: 'Community', icon: <Compass className="w-4 h-4 text-rose-400" /> },
    { id: 'prompts', label: 'Prompts', icon: <BookOpen className="w-4 h-4 text-indigo-400" /> },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-[#090b14]/85 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <div
          id="nav-logo"
          onClick={() => setCurrentPage('landing')}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 p-[1.5px] shadow-lg shadow-purple-500/20 group-hover:shadow-purple-500/40 transition-all duration-300">
            <div className="w-full h-full bg-[#0d0f1a] rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform duration-300" />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-display font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                PixelForge
              </span>
              <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-purple-500/20 border border-purple-500/30 text-purple-300 tracking-wider">
                AI
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium tracking-wide">Google AI Studio</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-[#101322]/80 border border-white/[0.06] p-1 rounded-full">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                id={`nav-link-${item.id}`}
                onClick={() => setCurrentPage(item.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-purple-600/30 text-white border border-purple-500/40 shadow-sm shadow-purple-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Section: Credits & User */}
        <div className="flex items-center gap-3">
          {/* Daily Credits Display */}
          <button
            id="nav-credits-badge"
            onClick={onOpenCreditsModal}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-950/40 to-indigo-950/40 border border-purple-500/30 hover:border-purple-500/60 transition-all group"
            title="Click to view daily generation quota and reset timer"
          >
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <div className="flex items-center gap-1.5 text-xs">
              <span className="font-semibold text-purple-200">
                {user ? `${user.credits}/${user.maxCredits || 5}` : '5/5'}
              </span>
              <span className="hidden sm:inline text-slate-400 font-normal">generations left</span>
            </div>
            <div className="hidden md:flex items-center gap-1 pl-1 border-l border-purple-500/20 text-[11px] text-purple-300/80">
              <Clock className="w-3 h-3 text-cyan-400" />
              <span>{formatCountdown(msUntilReset)}</span>
            </div>
          </button>

          {/* Quick Create Button */}
          <button
            id="nav-create-cta"
            onClick={() => setCurrentPage('create')}
            className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/25 hover:shadow-purple-600/40 transition-all active:scale-95"
          >
            <Flame className="w-3.5 h-3.5 text-amber-300" />
            <span>Create AI Art</span>
          </button>

          {/* Profile & Admin */}
          {user ? (
            <div className="flex items-center gap-2">
              <button
                id="nav-profile-btn"
                onClick={() => setCurrentPage('profile')}
                className={`flex items-center gap-2 p-1 rounded-full border transition-all ${
                  currentPage === 'profile'
                    ? 'border-purple-400 ring-2 ring-purple-500/20'
                    : 'border-white/10 hover:border-white/30'
                }`}
              >
                <img
                  src={user.avatarUrl}
                  alt={user.username}
                  className="w-8 h-8 rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </button>

              {user.role === 'admin' && (
                <button
                  id="nav-admin-btn"
                  onClick={() => setCurrentPage('admin')}
                  className={`p-2 rounded-xl border text-xs transition-all ${
                    currentPage === 'admin'
                      ? 'bg-purple-950/60 border-purple-500 text-purple-300'
                      : 'border-white/10 text-slate-400 hover:text-slate-200 hover:bg-white/[0.05]'
                  }`}
                  title="Admin Panel"
                >
                  <Shield className="w-4 h-4 text-cyan-400" />
                </button>
              )}
            </div>
          ) : (
            <button
              id="nav-login-btn"
              onClick={onOpenAuthModal}
              className="px-3.5 py-1.5 rounded-lg border border-white/10 text-xs font-medium text-slate-200 hover:bg-white/[0.06] transition-all"
            >
              Sign In
            </button>
          )}
        </div>
      </div>

      {/* Mobile navigation row */}
      <div className="lg:hidden border-t border-white/[0.04] bg-[#0c0e1a]/95 px-4 py-2 overflow-x-auto flex items-center gap-2 scrollbar-none">
        {navItems.map((item) => (
          <button
            key={item.id}
            id={`nav-mobile-${item.id}`}
            onClick={() => setCurrentPage(item.id)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs whitespace-nowrap transition-all ${
              currentPage === item.id
                ? 'bg-purple-600/30 text-purple-200 border border-purple-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </header>
  );
};
