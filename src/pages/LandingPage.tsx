import React, { useState } from 'react';
import {
  Sparkles,
  Wand2,
  Image as ImageIcon,
  UserCheck,
  Layers,
  Compass,
  ArrowRight,
  Zap,
  Flame,
  Shield,
  Clock,
  Copy,
  Check,
} from 'lucide-react';
import { PageId, User } from '../types';

interface LandingPageProps {
  onNavigate: (page: PageId, prefillPrompt?: string) => void;
  user: User | null;
  onOpenCredits: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigate,
  user,
  onOpenCredits,
}) => {
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);
  const [quickPrompt, setQuickPrompt] = useState('An ethereal cybernetic dragon coiled around a crystalline skyscraper, neon purple auroras, 8k');

  const handleCopyPrompt = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPromptId(id);
    setTimeout(() => setCopiedPromptId(null), 2000);
  };

  const featureCards = [
    {
      id: 'create' as PageId,
      title: 'AI Image Generator',
      description: 'Render photorealistic, anime, 3D, and cyberpunk masterpieces from simple descriptive ideas.',
      icon: <Sparkles className="w-6 h-6 text-purple-400" />,
      tag: 'Core Studio',
      badgeColor: 'border-purple-500/30 text-purple-300 bg-purple-500/10',
      image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80',
    },
    {
      id: 'avatar' as PageId,
      title: 'AI Avatar Creator',
      description: 'Craft custom gaming avatars, stylized anime personas, and executive studio portraits.',
      icon: <UserCheck className="w-6 h-6 text-cyan-400" />,
      tag: 'Portraits & Gaming',
      badgeColor: 'border-cyan-500/30 text-cyan-300 bg-cyan-500/10',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=80',
    },
    {
      id: 'logo' as PageId,
      title: 'AI Logo Maker',
      description: 'Generate high-contrast vector symbols, esports mascots, and modern startup brand marks.',
      icon: <Layers className="w-6 h-6 text-amber-400" />,
      tag: 'Vector & Branding',
      badgeColor: 'border-amber-500/30 text-amber-300 bg-amber-500/10',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    },
    {
      id: 'wallpaper' as PageId,
      title: 'AI Wallpaper Creator',
      description: 'Generate cinematic 16:9 ultra-wide desktop backdrops and 9:16 vertical smartphone wallpapers.',
      icon: <ImageIcon className="w-6 h-6 text-emerald-400" />,
      tag: 'Ultra-HD Screens',
      badgeColor: 'border-emerald-500/30 text-emerald-300 bg-emerald-500/10',
      image: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=800&auto=format&fit=crop&q=80',
    },
    {
      id: 'editor' as PageId,
      title: 'AI Image Editor & Modifier',
      description: 'Upload your photos and magically transform them: anime style, new backgrounds, effects, and upscaling.',
      icon: <Wand2 className="w-6 h-6 text-pink-400" />,
      tag: 'Multimodal AI',
      badgeColor: 'border-pink-500/30 text-pink-300 bg-pink-500/10',
      image: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=800&auto=format&fit=crop&q=80',
    },
    {
      id: 'prompts' as PageId,
      title: 'AI Prompt Assistant & Marketplace',
      description: 'Enhance your imagination with Gemini flash reasoning, creative suggestions, and trending prompt formulas.',
      icon: <Zap className="w-6 h-6 text-indigo-400" />,
      tag: 'Gemini 3.8 Intelligence',
      badgeColor: 'border-indigo-500/30 text-indigo-300 bg-indigo-500/10',
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
    },
  ];

  const showcaseArt = [
    {
      id: 'art-1',
      title: 'Celestial Ronin',
      author: 'AuraDreamer',
      prompt: 'Cyberpunk ronin with violet plasma blade standing in Neo Kyoto rain, volumetric mist, octane 8k',
      image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80',
      likes: 582,
    },
    {
      id: 'art-2',
      title: 'Bioluminescent Sanctuary',
      author: 'KaiVortex',
      prompt: 'Magical forest glade with glowing mushrooms, floating particles, hyper-detailed anime fantasy style',
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
      likes: 421,
    },
    {
      id: 'art-3',
      title: 'Cosmic Nebula Odyssey',
      author: 'StarlightNomad',
      prompt: 'Deep interstellar nebula portal with crystalline asteroids, cinematic lighting, IMAX 70mm',
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
      likes: 719,
    },
    {
      id: 'art-4',
      title: 'Neon Origami Cyber Fox',
      author: 'ZenithDesign',
      prompt: 'Origami fox logo with vibrant violet and cyan gradient highlights, pitch black background, minimalist vector',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
      likes: 310,
    },
  ];

  return (
    <div className="w-full relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-gradient-to-b from-purple-600/15 via-indigo-600/10 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-60 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-96 left-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-16">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs font-medium text-purple-300">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>Powered by Google AI Studio & Gemini Image Models</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold font-display tracking-tight text-white leading-[1.1]">
            Create Anything With{' '}
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Artificial Intelligence
            </span>
          </h1>

          {/* Subtext */}
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            PixelForge AI turns your thoughts into breathtaking artwork, avatars, branding logos, and 4K wallpapers. Every user receives 5 free generations daily.
          </p>

          {/* Interactive Prompt Box in Hero */}
          <div className="max-w-2xl mx-auto pt-2">
            <div className="relative p-2 sm:p-2.5 rounded-2xl bg-[#0f1222]/90 border border-purple-500/30 shadow-2xl shadow-purple-950/60 backdrop-blur-xl">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <input
                  id="hero-prompt-input"
                  type="text"
                  value={quickPrompt}
                  onChange={(e) => setQuickPrompt(e.target.value)}
                  placeholder="Describe your imagination..."
                  className="flex-1 bg-transparent px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none"
                />
                <button
                  id="hero-generate-cta"
                  onClick={() => onNavigate('create', quickPrompt)}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:brightness-110 text-white font-semibold text-xs tracking-wide shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 active:scale-95 transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Now</span>
                </button>
              </div>
            </div>

            {/* Quick Suggestions */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 mt-3 text-xs text-slate-400">
              <span className="text-slate-500 font-medium">Try:</span>
              {[
                'Cyberpunk cat in neon alley',
                'Futuristic glass hypercar',
                'Anime forest spirit with antlers',
                'Minimalist geometric logo',
              ].map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => setQuickPrompt(suggestion)}
                  className="px-2.5 py-1 rounded-full bg-white/[0.03] hover:bg-white/[0.08] text-slate-300 text-[11px] border border-white/[0.06] transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          {/* Credit Callout banner */}
          <div className="pt-4 flex items-center justify-center gap-4 text-xs text-slate-400">
            <button
              onClick={onOpenCredits}
              className="flex items-center gap-1.5 text-purple-300 hover:text-purple-200 font-medium transition-colors"
            >
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>{user ? `${user.credits}/5 generations remaining today` : '5 free generations every day'}</span>
            </button>
            <span className="text-slate-600">•</span>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>Auto daily reset at midnight UTC</span>
            </div>
          </div>
        </div>

        {/* Floating artwork display cards */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {showcaseArt.map((art) => (
            <div
              key={art.id}
              className="group relative rounded-2xl overflow-hidden bg-[#121524] border border-white/[0.08] hover:border-purple-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-purple-900/30"
            >
              <div className="aspect-square w-full overflow-hidden relative">
                <img
                  src={art.image}
                  alt={art.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                  <span className="text-xs font-bold text-white mb-1">{art.title}</span>
                  <p className="text-[11px] text-slate-300 line-clamp-2 mb-3">{art.prompt}</p>
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => onNavigate('create', art.prompt)}
                      className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-[10px] font-semibold flex items-center gap-1 transition-colors"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Remix</span>
                    </button>
                    <button
                      onClick={() => handleCopyPrompt(art.id, art.prompt)}
                      className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 transition-colors"
                      title="Copy Prompt"
                    >
                      {copiedPromptId === art.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-3 flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium truncate">{art.title}</span>
                <span className="text-purple-400 font-semibold text-[11px]">♥ {art.likes}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTIONS: PLATFORM FEATURES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-white/[0.06]">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Everything You Need</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white">
            Specialized Creative Studios
          </h2>
          <p className="text-sm text-slate-400">
            Tailored interfaces engineered for character design, brand assets, wallpaper resolutions, and photorealistic art.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureCards.map((card) => (
            <div
              key={card.id}
              onClick={() => onNavigate(card.id)}
              className="group cursor-pointer rounded-2xl bg-[#0f1222]/80 border border-white/[0.08] hover:border-purple-500/40 p-6 flex flex-col justify-between hover:bg-[#13172b] transition-all duration-300 hover:shadow-xl hover:shadow-purple-950/40 relative overflow-hidden"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] group-hover:scale-110 transition-transform">
                    {card.icon}
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${card.badgeColor}`}>
                    {card.tag}
                  </span>
                </div>
                <h3 className="text-lg font-bold font-display text-white mb-2 group-hover:text-purple-300 transition-colors">
                  {card.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-5">
                  {card.description}
                </p>
              </div>

              <div className="relative rounded-xl overflow-hidden aspect-[16/9] mb-4 border border-white/[0.06]">
                <img
                  src={card.image}
                  alt={card.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="flex items-center text-xs font-semibold text-cyan-400 group-hover:text-cyan-300 transition-colors pt-2">
                <span>Launch Studio</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* COMMUNITY TEASER SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-white/[0.06]">
        <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-[#0c0e1a] border border-purple-500/25 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold">
              <Compass className="w-3.5 h-3.5" />
              <span>Community Showcase</span>
            </div>
            <h2 className="text-3xl font-extrabold font-display text-white">
              Explore Millions of Prompts & Masterpieces
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Join thousands of creators sharing their best prompts, upvoting favorite generations, and remixing concepts in real-time.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <button
                id="landing-browse-community-btn"
                onClick={() => onNavigate('community')}
                className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/30 transition-all"
              >
                Browse Community
              </button>
              <button
                id="landing-view-prompts-btn"
                onClick={() => onNavigate('prompts')}
                className="px-6 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-xs font-semibold transition-all"
              >
                Prompt Library
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 w-full md:w-auto shrink-0">
            <div className="space-y-3">
              <img
                src="https://images.unsplash.com/photo-1563089145-599997674d42?w=300&auto=format&fit=crop&q=80"
                alt="Community Art"
                referrerPolicy="no-referrer"
                className="w-36 sm:w-44 h-36 sm:h-44 object-cover rounded-2xl border border-white/10"
              />
              <img
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80"
                alt="Community Art"
                referrerPolicy="no-referrer"
                className="w-36 sm:w-44 h-36 sm:h-44 object-cover rounded-2xl border border-white/10"
              />
            </div>
            <div className="space-y-3 pt-6">
              <img
                src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&auto=format&fit=crop&q=80"
                alt="Community Art"
                referrerPolicy="no-referrer"
                className="w-36 sm:w-44 h-36 sm:h-44 object-cover rounded-2xl border border-white/10"
              />
              <img
                src="https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=300&auto=format&fit=crop&q=80"
                alt="Community Art"
                referrerPolicy="no-referrer"
                className="w-36 sm:w-44 h-36 sm:h-44 object-cover rounded-2xl border border-white/10"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
