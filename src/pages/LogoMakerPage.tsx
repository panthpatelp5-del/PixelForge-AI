import React, { useState } from 'react';
import {
  Layers,
  Sparkles,
  Download,
  Gamepad2,
  Building2,
  Tv,
  Loader2,
  Check,
} from 'lucide-react';
import { GeneratedImage, User, PageId } from '../types';
import { downloadImage } from '../utils/download';

interface LogoMakerPageProps {
  user: User | null;
  onImageGenerated: (img: GeneratedImage) => void;
  onOpenCredits: () => void;
  onNavigate: (page: PageId, param?: string) => void;
}

export const LogoMakerPage: React.FC<LogoMakerPageProps> = ({
  user,
  onImageGenerated,
  onOpenCredits,
}) => {
  const [logoType, setLogoType] = useState<'gaming' | 'business' | 'creator'>('gaming');
  const [brandName, setBrandName] = useState('VORTEX');
  const [tagline, setTagline] = useState('Next-Gen Esports');
  const [motif, setMotif] = useState('Geometric cyber wolf');
  const [logoStyle, setLogoStyle] = useState('Minimalist Vector');
  const [colorTone, setColorTone] = useState('Neon Purple & Cyan');

  const [isGenerating, setIsGenerating] = useState(false);
  const [currentLogo, setCurrentLogo] = useState<GeneratedImage | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const logoTypes = [
    { id: 'gaming' as const, label: 'Gaming Logos', icon: <Gamepad2 className="w-4 h-4 text-cyan-400" /> },
    { id: 'business' as const, label: 'Business Logos', icon: <Building2 className="w-4 h-4 text-amber-400" /> },
    { id: 'creator' as const, label: 'Creator Logos', icon: <Tv className="w-4 h-4 text-pink-400" /> },
  ];

  const handleGenerate = async () => {
    if (!brandName.trim()) return;
    if (user && user.credits <= 0) {
      setErrorMsg('Daily generation credits exhausted (0/5). Check reset timer.');
      onOpenCredits();
      return;
    }

    setIsGenerating(true);
    setErrorMsg(null);

    const fullPrompt = `Professional logo design for brand named "${brandName.trim()}" with motif "${motif}", ${logoStyle} style, ${logoType} branding identity, ${colorTone} color palette, centered clean composition, vector art icon mark, solid dark background, Behance masterpiece`;

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: fullPrompt,
          style: 'Digital Art',
          aspectRatio: '1:1',
          quality: 'hd',
          lighting: 'Studio',
          color: 'Neon',
          category: 'logo',
          userId: user?.id || 'user-current',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Logo generation failed');

      setCurrentLogo(data.image);
      onImageGenerated(data.image);
    } catch (err: any) {
      setErrorMsg(err.message || 'Generation error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!currentLogo) return;
    downloadImage(currentLogo.imageUrl, `PixelForge_Logo_${brandName.replace(/\s+/g, '_')}_${Date.now()}.png`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/[0.08]">
        <div>
          <h1 className="text-2xl font-bold font-display text-white flex items-center gap-2.5">
            <Layers className="w-6 h-6 text-amber-400" />
            <span>AI Logo Maker</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Generate vector icons, esports mascots, and modern corporate identities
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
          {/* Logo Type Selector */}
          <div className="p-4 rounded-2xl bg-[#0f1220] border border-white/[0.08]">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2.5">
              Logo Industry Category
            </label>
            <div className="grid grid-cols-3 gap-2">
              {logoTypes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setLogoType(t.id)}
                  className={`p-2.5 rounded-xl flex flex-col items-center gap-1.5 text-xs font-medium text-center transition-all ${
                    logoType === t.id
                      ? 'bg-amber-500/20 border border-amber-500/50 text-amber-200 shadow-sm shadow-amber-500/20'
                      : 'bg-white/[0.02] border border-white/[0.05] text-slate-400 hover:bg-white/[0.06] hover:text-slate-200'
                  }`}
                >
                  {t.icon}
                  <span className="font-semibold truncate">{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Details Form */}
          <div className="p-4 rounded-2xl bg-[#0f1220] border border-white/[0.08] space-y-3.5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Brand / Team Name
              </label>
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="e.g. PixelForge, Nova, Apex"
                className="w-full bg-[#15192d] border border-white/10 focus:border-amber-500 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Tagline or Niche
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="e.g. Next-Gen Studio, Esports Team"
                className="w-full bg-[#15192d] border border-white/10 focus:border-amber-500 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Icon Symbol / Motif
              </label>
              <input
                type="text"
                value={motif}
                onChange={(e) => setMotif(e.target.value)}
                placeholder="e.g. Geometric falcon, Origami lion, Cybernetic prism"
                className="w-full bg-[#15192d] border border-white/10 focus:border-amber-500 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Logo Style
              </label>
              <div className="flex flex-wrap gap-1.5">
                {['Minimalist Vector', '3D Mascot', 'Emblem & Crest', 'Abstract Geometric', 'Monogram'].map((s) => (
                  <button
                    key={s}
                    onClick={() => setLogoStyle(s)}
                    className={`px-2.5 py-1 rounded-lg text-xs transition-all ${
                      logoStyle === s
                        ? 'bg-amber-500/25 border border-amber-500 text-amber-200'
                        : 'bg-white/[0.02] border border-white/[0.06] text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Color Palette
              </label>
              <div className="flex flex-wrap gap-1.5">
                {['Neon Purple & Cyan', 'Obsidian & Gold', 'Electric Blue & White', 'Crimson & Black'].map((c) => (
                  <button
                    key={c}
                    onClick={() => setColorTone(c)}
                    className={`px-2.5 py-1 rounded-lg text-xs transition-all ${
                      colorTone === c
                        ? 'bg-purple-500/25 border border-purple-500 text-purple-200'
                        : 'bg-white/[0.02] border border-white/[0.06] text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {errorMsg && (
              <div className="p-2.5 rounded-lg bg-red-950/60 border border-red-500/30 text-xs text-red-300">
                {errorMsg}
              </div>
            )}

            <button
              id="logo-generate-btn"
              onClick={handleGenerate}
              disabled={isGenerating || !brandName.trim()}
              className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-purple-600 to-cyan-500 hover:brightness-110 active:scale-[0.99] text-white font-semibold text-xs tracking-wide shadow-lg shadow-amber-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Forging Brand Identity...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate AI Logo (1 Credit)</span>
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
                {currentLogo ? 'Brand Mark Preview' : 'Interactive Logo Canvas'}
              </span>
              <span className="text-[11px] text-amber-400 uppercase font-semibold">{logoStyle}</span>
            </div>

            <div className="my-auto py-6 flex flex-col items-center justify-center">
              {isGenerating ? (
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-500 to-purple-500 animate-spin blur-md opacity-70" />
                  <p className="text-xs text-slate-400">Rendering vector curves and emblem composition...</p>
                </div>
              ) : currentLogo ? (
                <div className="flex flex-col items-center space-y-6">
                  {/* Logo stage box */}
                  <div className="w-72 h-72 rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-[#07080e] flex items-center justify-center p-4">
                    <img
                      src={currentLogo.imageUrl}
                      alt={brandName}
                      referrerPolicy="no-referrer"
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>

                  <div className="text-center">
                    <h3 className="text-xl font-black font-display text-white tracking-wider uppercase">
                      {brandName}
                    </h3>
                    <p className="text-xs text-slate-400 tracking-widest uppercase mt-0.5">
                      {tagline}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center text-center space-y-3 p-8">
                  <div className="w-20 h-20 rounded-2xl border-2 border-dashed border-white/20 flex items-center justify-center bg-white/[0.01]">
                    <Layers className="w-8 h-8 text-amber-400/60" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Custom Brand Logo</h4>
                    <p className="text-xs text-slate-400 max-w-xs mt-1">
                      Enter your brand name and symbol motif to generate vector emblems and esports identities.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {currentLogo && (
              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between gap-3">
                <button
                  id="logo-download-btn"
                  onClick={handleDownload}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow-md shadow-amber-600/30 transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Logo Asset</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
