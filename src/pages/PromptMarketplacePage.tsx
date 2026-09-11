import React, { useState } from 'react';
import {
  Sparkles,
  Copy,
  Check,
  Zap,
  ArrowRight,
  Flame,
  Search,
  Filter,
  Wand2,
  Loader2,
} from 'lucide-react';
import { PromptItem, PageId } from '../types';

interface PromptMarketplacePageProps {
  onNavigate: (page: PageId, prefillPrompt?: string) => void;
}

export const PromptMarketplacePage: React.FC<PromptMarketplacePageProps> = ({
  onNavigate,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Gemini assistant prompt expander
  const [assistantInput, setAssistantInput] = useState('');
  const [expandedPrompt, setExpandedPrompt] = useState<string | null>(null);
  const [isExpanding, setIsExpanding] = useState(false);

  const categories = [
    'All',
    'Photorealistic',
    'Anime',
    'Concept Art',
    'Logos',
    '3D Renders',
  ];

  const marketplacePrompts: PromptItem[] = [
    {
      id: 'p-1',
      title: 'Neon Ronin In Kyoto Rain',
      prompt: 'Cyberpunk ronin with glowing amethyst plasma katana walking through Neo-Kyoto in heavy rain, volumetric purple mist, octane render 8k, cinematic ray tracing',
      category: 'Concept Art',
      tags: ['cyberpunk', 'ronin', 'rain', 'lighting'],
      likes: 890,
      copies: 1420,
      previewUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80',
    },
    {
      id: 'p-2',
      title: 'Celestial Elven Sovereign',
      prompt: 'High fantasy anime elven empress with crystalline tiara, floating iridescent glyphs, Studio Ghibli cinematic lighting, highly detailed cel shading',
      category: 'Anime',
      tags: ['anime', 'fantasy', 'empress', 'cel-shaded'],
      likes: 745,
      copies: 980,
      previewUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    },
    {
      id: 'p-3',
      title: 'Interstellar Nebula Cosmic Rift',
      prompt: 'Deep interstellar nebula portal with colliding purple-magenta celestial galaxies, crystalline cosmic rings, IMAX 70mm astronomy photography',
      category: 'Photorealistic',
      tags: ['space', 'nebula', 'astronomy', '4k'],
      likes: 1205,
      copies: 2310,
      previewUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
    },
    {
      id: 'p-4',
      title: 'Origami Fox Cyber Brand Mark',
      prompt: 'Minimalist geometric origami fox logo with neon violet and cyan glowing gradients, pitch black background, vector mark, Behance showcase',
      category: 'Logos',
      tags: ['logo', 'origami', 'minimalist', 'branding'],
      likes: 620,
      copies: 890,
      previewUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    },
    {
      id: 'p-5',
      title: 'Futuristic Cybernetic Executive',
      prompt: 'Studio portrait of a visionary tech founder with sleek titanium neural headset, soft rim lighting, shallow depth of field, 85mm portrait lens, Hasselblad 8k',
      category: 'Photorealistic',
      tags: ['portrait', 'cyber', 'studio', 'hasselblad'],
      likes: 530,
      copies: 670,
      previewUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=80',
    },
    {
      id: 'p-6',
      title: 'Floating Isometric Crystal City',
      prompt: '3D isometric miniature city floating in the sky, translucent glass skyscrapers, neon monorails, lush cascading waterfalls, Blender 3D render, clay style',
      category: '3D Renders',
      tags: ['isometric', '3d', 'blender', 'miniature'],
      likes: 910,
      copies: 1150,
      previewUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=800&auto=format&fit=crop&q=80',
    },
  ];

  const handleCopyPrompt = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExpandWithGemini = async () => {
    if (!assistantInput.trim()) return;
    setIsExpanding(true);
    setExpandedPrompt(null);
    try {
      const res = await fetch('/api/prompt/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: assistantInput.trim(),
          style: 'Cinematic',
          lighting: 'Neon',
          color: 'Warm',
        }),
      });
      const data = await res.json();
      if (data.enhancedPrompt) {
        setExpandedPrompt(data.enhancedPrompt);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsExpanding(false);
    }
  };

  const filtered = marketplacePrompts.filter((p) => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesQuery =
      searchQuery === '' ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesQuery;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-white flex items-center gap-2.5">
            <Zap className="w-7 h-7 text-indigo-400" />
            <span>Prompt Marketplace & Formula Vault</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Proven prompt blueprints tested across Gemini and Imagen models. Copy formulas or try with 1 click.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            id="prompt-market-search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search prompt blueprints..."
            className="w-full bg-[#121526] border border-white/10 focus:border-indigo-500 rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none"
          />
        </div>
      </div>

      {/* GEMINI PROMPT CRAFTER ASSISTANT */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-950/40 via-[#111425] to-purple-950/30 border border-indigo-500/25 shadow-xl space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/30">
            <Wand2 className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-base font-bold font-display text-white">
              Gemini AI Prompt Expander
            </h3>
            <p className="text-xs text-slate-400">
              Transform a simple rough thought into a high-octane production prompt
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            id="assistant-prompt-input"
            type="text"
            value={assistantInput}
            onChange={(e) => setAssistantInput(e.target.value)}
            placeholder="e.g. A cybernetic dragon flying over neon city"
            className="flex-1 bg-[#161a2e] border border-white/10 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none"
          />
          <button
            id="assistant-expand-btn"
            onClick={handleExpandWithGemini}
            disabled={isExpanding || !assistantInput.trim()}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:brightness-110 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 flex items-center justify-center gap-1.5 transition-all disabled:opacity-50 shrink-0"
          >
            {isExpanding ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Expanding...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Supercharge Prompt</span>
              </>
            )}
          </button>
        </div>

        {expandedPrompt && (
          <div className="p-4 rounded-2xl bg-[#14182b] border border-indigo-500/30 text-xs space-y-3">
            <div className="flex items-center justify-between text-indigo-300 font-semibold text-[11px]">
              <span>Optimized Production Prompt:</span>
              <span className="text-emerald-400">Gemini 3.8 Refined</span>
            </div>
            <p className="text-slate-200 leading-relaxed font-mono text-[11px] bg-black/30 p-3 rounded-xl border border-white/5">
              {expandedPrompt}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate('create', expandedPrompt)}
                className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Try in Studio</span>
              </button>
              <button
                onClick={() => handleCopyPrompt('assistant', expandedPrompt)}
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-medium transition-colors"
              >
                {copiedId === 'assistant' ? 'Copied!' : 'Copy to Clipboard'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <Filter className="w-3.5 h-3.5 text-slate-500 shrink-0" />
        {categories.map((cat) => (
          <button
            key={cat}
            id={`prompt-cat-${cat.toLowerCase().replace(/\s+/g, '-')}`}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-white/[0.03] text-slate-400 hover:bg-white/[0.08] hover:text-slate-200 border border-white/[0.06]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* MARKETPLACE PROMPT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="group rounded-2xl bg-[#0f1220] border border-white/[0.08] hover:border-indigo-500/40 p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-indigo-950/30 space-y-4"
          >
            <div>
              {/* Image Preview & Category Badge */}
              <div className="relative aspect-video rounded-xl overflow-hidden mb-3 border border-white/[0.06]">
                <img
                  src={item.previewUrl}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-semibold text-indigo-300 border border-white/10">
                  {item.category}
                </span>
              </div>

              <h3 className="text-sm font-bold font-display text-white mb-2 group-hover:text-indigo-300 transition-colors">
                {item.title}
              </h3>

              {/* Prompt Text Box */}
              <div className="p-3 rounded-xl bg-[#14182b] border border-white/[0.05] text-[11px] text-slate-300 font-mono leading-relaxed line-clamp-3">
                "{item.prompt}"
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mt-2.5">
                {item.tags.map((t) => (
                  <span
                    key={t}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-white/[0.03] text-slate-400 border border-white/[0.04]"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            {/* Card Action Buttons */}
            <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between gap-2">
              <button
                id={`try-prompt-btn-${item.id}`}
                onClick={() => onNavigate('create', item.prompt)}
                className="flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/30 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Try Prompt</span>
              </button>

              <button
                id={`copy-market-btn-${item.id}`}
                onClick={() => handleCopyPrompt(item.id, item.prompt)}
                className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 border border-white/10 transition-colors"
                title="Copy Prompt"
              >
                {copiedId === item.id ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
