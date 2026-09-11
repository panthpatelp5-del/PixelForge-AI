import React, { useState } from 'react';
import {
  User as UserIcon,
  Sparkles,
  Zap,
  Image as ImageIcon,
  Heart,
  Bookmark,
  Download,
  Share2,
  Clock,
  Settings,
  ShieldCheck,
  FolderPlus,
} from 'lucide-react';
import { GeneratedImage, PageId, User } from '../types';
import { downloadImage } from '../utils/download';

interface ProfileDashboardPageProps {
  user: User | null;
  savedImages: GeneratedImage[];
  onNavigate: (page: PageId, prefillPrompt?: string) => void;
  onOpenCredits: () => void;
}

export const ProfileDashboardPage: React.FC<ProfileDashboardPageProps> = ({
  user,
  savedImages,
  onNavigate,
  onOpenCredits,
}) => {
  const [activeTab, setActiveTab] = useState<'generations' | 'liked' | 'collections'>('generations');

  const myGenerations = savedImages;
  const likedImages = savedImages.filter((img) => img.likes > 0);

  const promptCollections = [
    {
      id: 'col-1',
      title: 'Cyberpunk & Sci-Fi Masterpieces',
      count: 14,
      cover: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80',
      description: 'Futuristic cities, cybernetic ronins, and neon aesthetics',
    },
    {
      id: 'col-2',
      title: 'Anime Avatars & Portraits',
      count: 8,
      cover: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=80',
      description: 'Expressive characters, cel shading, and magical fantasy avatars',
    },
    {
      id: 'col-3',
      title: 'Cosmic 4K Wallpapers',
      count: 12,
      cover: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
      description: 'Nebulas, deep space exploration, and celestial phenomena',
    },
  ];

  const handleDownload = (imageUrl: string, prompt: string) => {
    downloadImage(imageUrl, `PixelForge_${prompt.slice(0, 20).replace(/\s+/g, '_')}.png`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Profile Header Banner */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-purple-950/50 via-[#101426] to-cyan-950/40 border border-purple-500/25 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-center gap-5 text-center sm:text-left">
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 p-0.5 shadow-xl shadow-purple-900/40">
                <div className="w-full h-full bg-[#0d101e] rounded-[14px] flex items-center justify-center">
                  <UserIcon className="w-10 h-10 text-cyan-400" />
                </div>
              </div>
              {user?.role === 'admin' && (
                <div className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-md bg-amber-500 text-black text-[9px] font-black uppercase tracking-wider flex items-center gap-0.5 shadow-md">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Admin</span>
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2.5">
                <h1 className="text-2xl font-bold font-display text-white">
                  {user?.username || 'Creative Explorer'}
                </h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-medium">
                  {user?.plan || 'Free Plan'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">{user?.email || 'creator@pixelforge.ai'}</p>
              <div className="flex items-center gap-4 mt-3 text-xs text-slate-400 justify-center sm:justify-start">
                <span>Member since Sept 2026</span>
                <span>•</span>
                <span className="text-emerald-400 flex items-center gap-1 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Active
                </span>
              </div>
            </div>
          </div>

          {/* Quick Credit Overview Card */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center gap-4 shrink-0">
            <div>
              <span className="text-xs text-slate-400 block font-medium">Daily Generations</span>
              <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-cyan-300">
                {user?.credits ?? 5} / {user?.maxCredits ?? 5}
              </span>
            </div>
            <button
              onClick={onOpenCredits}
              className="px-3 py-1.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/50 text-xs font-semibold text-purple-200 transition-colors"
            >
              Reset Timer
            </button>
          </div>
        </div>

        {/* STATS STRIP */}
        <div className="grid grid-cols-3 gap-3 sm:gap-6 mt-8 pt-6 border-t border-white/[0.08]">
          <div className="text-center sm:text-left">
            <span className="text-xs text-slate-400 block">Images Created</span>
            <span className="text-xl sm:text-2xl font-bold text-white mt-0.5 block">
              {myGenerations.length}
            </span>
          </div>

          <div className="text-center sm:text-left">
            <span className="text-xs text-slate-400 block">Credits Remaining</span>
            <span className="text-xl sm:text-2xl font-bold text-cyan-300 mt-0.5 block">
              {user?.credits ?? 5}
            </span>
          </div>

          <div className="text-center sm:text-left">
            <span className="text-xs text-slate-400 block">Saved in Library</span>
            <span className="text-xl sm:text-2xl font-bold text-purple-300 mt-0.5 block">
              {myGenerations.length + promptCollections.length}
            </span>
          </div>
        </div>
      </div>

      {/* TABS NAVIGATION */}
      <div className="flex items-center gap-2 border-b border-white/[0.08] pb-1">
        <button
          id="profile-tab-generations"
          onClick={() => setActiveTab('generations')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ${
            activeTab === 'generations'
              ? 'border-purple-500 text-purple-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>My Generations ({myGenerations.length})</span>
        </button>

        <button
          id="profile-tab-liked"
          onClick={() => setActiveTab('liked')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ${
            activeTab === 'liked'
              ? 'border-purple-500 text-purple-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Liked Artwork ({likedImages.length})</span>
        </button>

        <button
          id="profile-tab-collections"
          onClick={() => setActiveTab('collections')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ${
            activeTab === 'collections'
              ? 'border-purple-500 text-purple-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>Prompt Collections ({promptCollections.length})</span>
        </button>
      </div>

      {/* TAB CONTENT: MY GENERATIONS */}
      {activeTab === 'generations' && (
        <div>
          {myGenerations.length === 0 ? (
            <div className="text-center py-16 p-8 rounded-2xl bg-[#0f1220] border border-white/[0.08] space-y-3">
              <ImageIcon className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-white">No images generated yet</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Head over to the AI Studio or any specialized creator to start generating your personal gallery.
              </p>
              <button
                onClick={() => onNavigate('create')}
                className="mt-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/30 transition-all"
              >
                Create Your First Image
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {myGenerations.map((item) => (
                <div
                  key={item.id}
                  className="group rounded-2xl bg-[#0f1220] border border-white/[0.08] hover:border-purple-500/40 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-purple-950/30 flex flex-col justify-between"
                >
                  <div className="relative aspect-square overflow-hidden bg-black/40">
                    <img
                      src={item.imageUrl}
                      alt={item.prompt}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-semibold text-purple-300 border border-white/10">
                        {item.style}
                      </span>
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                      <div className="flex items-center gap-2 w-full">
                        <button
                          onClick={() => onNavigate('create', item.prompt)}
                          className="flex-1 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>Remix</span>
                        </button>
                        <button
                          onClick={() => handleDownload(item.imageUrl, item.prompt)}
                          className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                          title="Download"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      "{item.prompt}"
                    </p>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                      <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                      <span className="text-purple-400 font-medium">Standard Res</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: LIKED IMAGES */}
      {activeTab === 'liked' && (
        <div>
          {likedImages.length === 0 ? (
            <div className="text-center py-16 p-8 rounded-2xl bg-[#0f1220] border border-white/[0.08] space-y-3">
              <Heart className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-white">No liked images yet</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Explore the Community Feed to like and bookmark artwork created by other artists.
              </p>
              <button
                onClick={() => onNavigate('community')}
                className="mt-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition-all"
              >
                Browse Community
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {likedImages.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl bg-[#0f1220] border border-white/[0.08] overflow-hidden"
                >
                  <div className="aspect-square bg-black/40 overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.prompt}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4 space-y-1">
                    <p className="text-xs text-slate-300 line-clamp-2">"{item.prompt}"</p>
                    <span className="text-[11px] text-rose-400 font-semibold flex items-center gap-1">
                      <Heart className="w-3 h-3 fill-current" /> {item.likes} likes
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: COLLECTIONS */}
      {activeTab === 'collections' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {promptCollections.map((col) => (
            <div
              key={col.id}
              className="rounded-2xl bg-[#0f1220] border border-white/[0.08] overflow-hidden hover:border-purple-500/40 transition-all p-4 space-y-3"
            >
              <div className="aspect-video rounded-xl overflow-hidden relative">
                <img
                  src={col.cover}
                  alt={col.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[10px] font-semibold text-white">
                  {col.count} prompts
                </span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">{col.title}</h4>
                <p className="text-xs text-slate-400 mt-1">{col.description}</p>
              </div>
              <button
                onClick={() => onNavigate('prompts')}
                className="w-full py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-semibold text-purple-300 transition-colors"
              >
                Browse Collection
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
