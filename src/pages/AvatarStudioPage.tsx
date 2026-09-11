import React, { useState } from 'react';
import {
  UserCheck,
  Sparkles,
  Download,
  Share2,
  Gamepad2,
  Smile,
  Briefcase,
  Crown,
  Loader2,
  Check,
} from 'lucide-react';
import { GeneratedImage, User, PageId } from '../types';
import { downloadImage } from '../utils/download';

interface AvatarStudioPageProps {
  user: User | null;
  onImageGenerated: (img: GeneratedImage) => void;
  onNavigate: (page: PageId, param?: string) => void;
  onOpenCredits: () => void;
}

export const AvatarStudioPage: React.FC<AvatarStudioPageProps> = ({
  user,
  onImageGenerated,
  onOpenCredits,
}) => {
  const [category, setCategory] = useState<'gaming' | 'anime' | 'professional' | 'fantasy'>('gaming');
  const [avatarPrompt, setAvatarPrompt] = useState('Cyberpunk rogue esports player with glowing violet eye visor, sleek black tactical headset, neon city rain reflections');
  const [accessory, setAccessory] = useState('Cyber Visor');
  const [genderArchetype, setGenderArchetype] = useState('Androgynous / Heroic');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentAvatar, setCurrentAvatar] = useState<GeneratedImage | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const categories = [
    { id: 'gaming' as const, label: 'Gaming Avatars', icon: <Gamepad2 className="w-4 h-4 text-cyan-400" />, defaultPrompt: 'Elite esports pro gamer wearing high-tech glowing LED headset and black jersey, intense gaze, futuristic neon arena arena bokeh' },
    { id: 'anime' as const, label: 'Anime Avatars', icon: <Smile className="w-4 h-4 text-pink-400" />, defaultPrompt: 'Anime hero with glowing silver hair, piercing amber eyes, mystical runic floating glyphs, Studio Ufotable aesthetic' },
    { id: 'professional' as const, label: 'Professional Portraits', icon: <Briefcase className="w-4 h-4 text-amber-400" />, defaultPrompt: 'Distinguished tech founder in modern obsidian blazer, soft studio rim lighting, neutral bokeh, 85mm portrait photography' },
    { id: 'fantasy' as const, label: 'Fantasy Characters', icon: <Crown className="w-4 h-4 text-purple-400" />, defaultPrompt: 'Regal elven archmage wearing silver filigree tiara with radiant emerald gemstones, enchanted forest background' },
  ];

  const handleSelectCategory = (cat: typeof categories[0]) => {
    setCategory(cat.id);
    setAvatarPrompt(cat.defaultPrompt);
  };

  const handleGenerate = async () => {
    if (!avatarPrompt.trim()) return;
    if (user && user.credits <= 0) {
      setErrorMsg('Daily generation credits exhausted (0/5). Check reset timer.');
      onOpenCredits();
      return;
    }

    setIsGenerating(true);
    setErrorMsg(null);

    const fullPrompt = `${avatarPrompt}, ${category} avatar style, ${accessory ? `with ${accessory}` : ''}, ${genderArchetype}, centered portrait composition, icon quality, masterpiece`;

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: fullPrompt,
          style: category === 'anime' ? 'Anime' : category === 'gaming' ? 'Gaming' : category === 'fantasy' ? 'Fantasy' : 'Realistic',
          aspectRatio: '1:1',
          quality: 'hd',
          lighting: 'Studio',
          color: 'Neon',
          category: 'avatar',
          userId: user?.id || 'user-current',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Generation failed');
      }

      setCurrentAvatar(data.image);
      onImageGenerated(data.image);
    } catch (err: any) {
      setErrorMsg(err.message || 'Avatar generation failed');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!currentAvatar) return;
    downloadImage(currentAvatar.imageUrl, `PixelForge_Avatar_${category}_${Date.now()}.png`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/[0.08]">
        <div>
          <h1 className="text-2xl font-bold font-display text-white flex items-center gap-2.5">
            <UserCheck className="w-6 h-6 text-cyan-400" />
            <span>AI Avatar Studio</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Generate gaming personas, anime characters, and professional headshots
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
          {/* Avatar Categories */}
          <div className="p-4 rounded-2xl bg-[#0f1220] border border-white/[0.08]">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2.5">
              Avatar Category
            </label>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  id={`avatar-cat-${cat.id}`}
                  onClick={() => handleSelectCategory(cat)}
                  className={`p-3 rounded-xl flex items-center gap-2.5 text-xs font-medium text-left transition-all ${
                    category === cat.id
                      ? 'bg-cyan-600/20 border border-cyan-500/50 text-cyan-200 shadow-sm shadow-cyan-500/20'
                      : 'bg-white/[0.02] border border-white/[0.05] text-slate-400 hover:bg-white/[0.06] hover:text-slate-200'
                  }`}
                >
                  {cat.icon}
                  <span className="font-semibold truncate">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Customization Details */}
          <div className="p-4 rounded-2xl bg-[#0f1220] border border-white/[0.08] space-y-3.5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Character Persona Prompt
              </label>
              <textarea
                rows={3}
                value={avatarPrompt}
                onChange={(e) => setAvatarPrompt(e.target.value)}
                className="w-full bg-[#15192d] border border-white/10 focus:border-cyan-500 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none resize-none leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Accessory / Equipment
              </label>
              <div className="flex flex-wrap gap-1.5">
                {['Cyber Visor', 'LED Headset', 'Crown / Tiara', 'Glowing Eyes', 'Neon Mask', 'Minimalist'].map((acc) => (
                  <button
                    key={acc}
                    onClick={() => setAccessory(acc)}
                    className={`px-2.5 py-1 rounded-lg text-xs transition-all ${
                      accessory === acc
                        ? 'bg-cyan-500/25 border border-cyan-500 text-cyan-200'
                        : 'bg-white/[0.02] border border-white/[0.06] text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {acc}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Archetype & Demographics
              </label>
              <div className="flex flex-wrap gap-1.5">
                {['Female Hero', 'Male Warrior', 'Androgynous / Heroic', 'Futuristic AI Entity', 'Fantasy Mage'].map((g) => (
                  <button
                    key={g}
                    onClick={() => setGenderArchetype(g)}
                    className={`px-2.5 py-1 rounded-lg text-xs transition-all ${
                      genderArchetype === g
                        ? 'bg-purple-500/25 border border-purple-500 text-purple-200'
                        : 'bg-white/[0.02] border border-white/[0.06] text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {g}
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
              id="avatar-generate-btn"
              onClick={handleGenerate}
              disabled={isGenerating || !avatarPrompt.trim()}
              className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 hover:brightness-110 active:scale-[0.99] text-white font-semibold text-xs tracking-wide shadow-lg shadow-cyan-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Avatar...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Forge AI Avatar (1 Credit)</span>
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
                {currentAvatar ? 'Avatar Generated' : 'Profile Avatar Preview'}
              </span>
              <span className="text-[11px] text-cyan-400 uppercase font-semibold">{category}</span>
            </div>

            <div className="my-auto py-6 flex flex-col items-center justify-center">
              {isGenerating ? (
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-500 animate-spin blur-md opacity-70" />
                  <p className="text-xs text-slate-400">Rendering high-resolution avatar with neural shading...</p>
                </div>
              ) : currentAvatar ? (
                <div className="flex flex-col items-center space-y-6">
                  {/* Circular profile preview */}
                  <div className="relative">
                    <div className="w-56 h-56 rounded-full overflow-hidden border-4 border-cyan-500/60 shadow-2xl shadow-cyan-950/60 ring-4 ring-purple-500/20">
                      <img
                        src={currentAvatar.imageUrl}
                        alt="Avatar"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute bottom-2 right-4 w-7 h-7 rounded-full bg-emerald-500 border-2 border-[#0f1220] flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  </div>

                  {/* Gamer tag preview card */}
                  <div className="px-6 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-center">
                    <span className="text-sm font-bold text-white font-display block">
                      {user?.username || 'CyberPioneer'}
                    </span>
                    <span className="text-[11px] text-cyan-400 font-mono">
                      LVL 99 • {category.toUpperCase()}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center text-center space-y-3 p-8">
                  <div className="w-24 h-24 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center bg-white/[0.01]">
                    <UserCheck className="w-10 h-10 text-cyan-400/60" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Custom Profile Avatar</h4>
                    <p className="text-xs text-slate-400 max-w-xs mt-1">
                      Choose an avatar category and click <strong>Forge AI Avatar</strong> to create your next profile picture.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {currentAvatar && (
              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between gap-3">
                <button
                  id="avatar-download-btn"
                  onClick={handleDownload}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-md shadow-cyan-600/30 transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Avatar PNG</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
