import React, { useState } from 'react';
import {
  Image as ImageIcon,
  Sparkles,
  Download,
  Monitor,
  Smartphone,
  Compass,
  Loader2,
} from 'lucide-react';
import { GeneratedImage, User, PageId } from '../types';
import { downloadImage } from '../utils/download';

interface WallpaperStudioPageProps {
  user: User | null;
  onImageGenerated: (img: GeneratedImage) => void;
  onOpenCredits: () => void;
  onNavigate: (page: PageId, param?: string) => void;
}

export const WallpaperStudioPage: React.FC<WallpaperStudioPageProps> = ({
  user,
  onImageGenerated,
  onOpenCredits,
}) => {
  const [deviceTarget, setDeviceTarget] = useState<'pc' | 'mobile'>('pc');
  const [category, setCategory] = useState<'Gaming' | 'Space' | 'Nature' | 'Cyberpunk' | 'Fantasy'>('Space');
  const [wallpaperPrompt, setWallpaperPrompt] = useState(
    'Vast interstellar nebula with colliding purple-magenta celestial galaxies, crystalline cosmic rings, and distant hyper-detailed stars, 4k wallpaper'
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentWallpaper, setCurrentWallpaper] = useState<GeneratedImage | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const categories = [
    { id: 'Gaming' as const, icon: '🎮', defaultPrompt: 'Epic battle arena in floating sky fortress, neon energy streams, gaming championship stadium backdrop, high octane render' },
    { id: 'Space' as const, icon: '🚀', defaultPrompt: 'Deep interstellar rift, cosmic auroras over obsidian planet, swirling stellar dust clouds, photorealistic astronomy render' },
    { id: 'Nature' as const, icon: '🌿', defaultPrompt: 'Majestic misty mountain peak at sunrise, mirror lake reflection, vibrant autumn golden pines, 8k landscape photography' },
    { id: 'Cyberpunk' as const, icon: '🏙️', defaultPrompt: 'Neo-Tokyo cyber metropolis in heavy monsoon rain, towering holographic advertisements, flying aerodynes, neon reflection puddles' },
    { id: 'Fantasy' as const, icon: '🏰', defaultPrompt: 'Enchanted castle on a cliff overlooking bioluminescent sea, twin crescent moons, cascading waterfalls, Studio Ghibli matte painting' },
  ];

  const handleSelectCategory = (cat: typeof categories[0]) => {
    setCategory(cat.id);
    setWallpaperPrompt(cat.defaultPrompt);
  };

  const handleGenerate = async () => {
    if (!wallpaperPrompt.trim()) return;
    if (user && user.credits <= 0) {
      setErrorMsg('Daily generation credits exhausted (0/5). Check reset timer.');
      onOpenCredits();
      return;
    }

    setIsGenerating(true);
    setErrorMsg(null);

    const fullPrompt = `${wallpaperPrompt}, ${category} theme, ultra-detailed ${deviceTarget === 'pc' ? '16:9 desktop wallpaper' : '9:16 vertical smartphone wallpaper'}, 4k resolution, cinematic lighting, masterwork composition`;

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: fullPrompt,
          style: category === 'Nature' ? 'Realistic' : category === 'Cyberpunk' ? 'Cyberpunk' : category === 'Fantasy' ? 'Fantasy' : 'Cinematic',
          aspectRatio: deviceTarget === 'pc' ? '16:9' : '9:16',
          quality: 'hd',
          lighting: 'Cinematic',
          color: 'Neon',
          category: 'wallpaper',
          userId: user?.id || 'user-current',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Generation failed');

      setCurrentWallpaper(data.image);
      onImageGenerated(data.image);
    } catch (err: any) {
      setErrorMsg(err.message || 'Wallpaper generation failed');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!currentWallpaper) return;
    downloadImage(currentWallpaper.imageUrl, `PixelForge_${deviceTarget.toUpperCase()}_Wallpaper_${category}_${Date.now()}.png`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/[0.08]">
        <div>
          <h1 className="text-2xl font-bold font-display text-white flex items-center gap-2.5">
            <ImageIcon className="w-6 h-6 text-emerald-400" />
            <span>AI Wallpaper Studio</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Generate 4K ultra-wide desktop backdrops and lock-screen mobile wallpapers
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenCredits}
            className="text-xs text-slate-300 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10"
          >
            Credits: <strong className="text-purple-300">{user?.credits ?? 5}/5</strong>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Device Target: PC vs Mobile */}
          <div className="p-4 rounded-2xl bg-[#0f1220] border border-white/[0.08]">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2.5">
              Screen Target & Format
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                id="wallpaper-target-pc"
                onClick={() => setDeviceTarget('pc')}
                className={`p-3 rounded-xl flex items-center gap-2.5 text-xs font-medium transition-all ${
                  deviceTarget === 'pc'
                    ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-200 shadow-sm shadow-emerald-500/20'
                    : 'bg-white/[0.02] border border-white/[0.05] text-slate-400 hover:bg-white/[0.06]'
                }`}
              >
                <Monitor className="w-4 h-4 text-emerald-400" />
                <div className="text-left">
                  <span className="font-semibold block">PC Desktop</span>
                  <span className="text-[10px] text-slate-400">16:9 Ultra-HD (4K)</span>
                </div>
              </button>

              <button
                id="wallpaper-target-mobile"
                onClick={() => setDeviceTarget('mobile')}
                className={`p-3 rounded-xl flex items-center gap-2.5 text-xs font-medium transition-all ${
                  deviceTarget === 'mobile'
                    ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-200 shadow-sm shadow-emerald-500/20'
                    : 'bg-white/[0.02] border border-white/[0.05] text-slate-400 hover:bg-white/[0.06]'
                }`}
              >
                <Smartphone className="w-4 h-4 text-emerald-400" />
                <div className="text-left">
                  <span className="font-semibold block">Mobile Screen</span>
                  <span className="text-[10px] text-slate-400">9:16 Vertical Lock</span>
                </div>
              </button>
            </div>
          </div>

          {/* Wallpaper Categories */}
          <div className="p-4 rounded-2xl bg-[#0f1220] border border-white/[0.08]">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2.5">
              Wallpaper Categories
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  id={`wallpaper-cat-${cat.id.toLowerCase()}`}
                  onClick={() => handleSelectCategory(cat)}
                  className={`p-2 rounded-xl flex flex-col items-center gap-1 text-xs font-medium text-center transition-all ${
                    category === cat.id
                      ? 'bg-emerald-600/20 border border-emerald-500 text-emerald-200'
                      : 'bg-white/[0.02] border border-white/[0.05] text-slate-400 hover:bg-white/[0.06]'
                  }`}
                >
                  <span className="text-sm">{cat.icon}</span>
                  <span className="truncate">{cat.id}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Prompt Details */}
          <div className="p-4 rounded-2xl bg-[#0f1220] border border-white/[0.08] space-y-3.5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Wallpaper Theme & Elements
              </label>
              <textarea
                rows={3}
                value={wallpaperPrompt}
                onChange={(e) => setWallpaperPrompt(e.target.value)}
                className="w-full bg-[#15192d] border border-white/10 focus:border-emerald-500 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none resize-none leading-relaxed"
              />
            </div>

            {errorMsg && (
              <div className="p-2.5 rounded-lg bg-red-950/60 border border-red-500/30 text-xs text-red-300">
                {errorMsg}
              </div>
            )}

            <button
              id="wallpaper-generate-btn"
              onClick={handleGenerate}
              disabled={isGenerating || !wallpaperPrompt.trim()}
              className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-500 hover:brightness-110 active:scale-[0.99] text-white font-semibold text-xs tracking-wide shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Wallpaper...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Render 4K Wallpaper (1 Credit)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Canvas (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-4 sm:p-6 rounded-2xl bg-[#0f1220] border border-white/[0.08] shadow-2xl relative min-h-[460px] flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] text-xs">
              <span className="font-semibold text-slate-300">
                {currentWallpaper ? 'Wallpaper Ready' : 'Screen Stage'}
              </span>
              <span className="text-[11px] text-emerald-400 uppercase font-semibold">
                {deviceTarget === 'pc' ? '16:9 Desktop (1920x1080)' : '9:16 Mobile (1080x1920)'}
              </span>
            </div>

            <div className="my-auto py-4 flex flex-col items-center justify-center">
              {isGenerating ? (
                <div className="flex flex-col items-center space-y-4 p-8">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-500 animate-spin blur-md opacity-70" />
                  <p className="text-xs text-slate-400">Rendering high-resolution cinematic backdrop...</p>
                </div>
              ) : currentWallpaper ? (
                <div className="w-full flex flex-col items-center">
                  <div
                    className={`rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-black ${
                      deviceTarget === 'pc' ? 'aspect-video w-full max-w-xl' : 'aspect-[9/16] max-h-[460px]'
                    }`}
                  >
                    <img
                      src={currentWallpaper.imageUrl}
                      alt="Wallpaper"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center text-center space-y-3 p-8">
                  <div className="w-20 h-20 rounded-2xl border-2 border-dashed border-white/20 flex items-center justify-center bg-white/[0.01]">
                    <Monitor className="w-8 h-8 text-emerald-400/60" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Ultra-HD Wallpaper Canvas</h4>
                    <p className="text-xs text-slate-400 max-w-xs mt-1">
                      Choose your device ratio (Desktop or Phone) and generate custom cinematic backdrops.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {currentWallpaper && (
              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between gap-3">
                <button
                  id="wallpaper-download-btn"
                  onClick={handleDownload}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/30 transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download 4K Wallpaper</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
