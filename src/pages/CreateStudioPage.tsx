import React, { useState } from 'react';
import {
  Sparkles,
  Wand2,
  Dice5,
  Download,
  Share2,
  Heart,
  Copy,
  Check,
  Zap,
  Sliders,
  Maximize2,
  Info,
  Loader2,
  Compass,
  Cpu,
} from 'lucide-react';
import { GeneratedImage, User, PageId } from '../types';
import { downloadImage } from '../utils/download';

interface CreateStudioPageProps {
  initialPrompt?: string;
  user: User | null;
  onImageGenerated: (img: GeneratedImage) => void;
  onNavigate: (page: PageId, param?: string) => void;
  onOpenCredits: () => void;
}

export const CreateStudioPage: React.FC<CreateStudioPageProps> = ({
  initialPrompt = '',
  user,
  onImageGenerated,
  onNavigate,
  onOpenCredits,
}) => {
  const [prompt, setPrompt] = useState(
    initialPrompt || 'Futuristic cybernetic samurai standing on a rain-slicked neon street, glowing katana, volumetric fog, cinematic lighting'
  );
  const [style, setStyle] = useState('Realistic');
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '3:4' | '16:9' | '9:16'>('1:1');
  const [quality, setQuality] = useState<'fast' | 'standard' | 'hd'>('standard');
  const [lighting, setLighting] = useState('Cinematic');
  const [color, setColor] = useState('Neon');
  const [selectedModel, setSelectedModel] = useState<'flux' | 'turbo' | 'gemini'>('flux');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // States
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isRandomizing, setIsRandomizing] = useState(false);
  const [currentImage, setCurrentImage] = useState<GeneratedImage | null>(null);
  const [recentHistory, setRecentHistory] = useState<GeneratedImage[]>([]);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [sharedNotice, setSharedNotice] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const stylesList = [
    { id: 'Realistic', label: 'Realistic', icon: '📸' },
    { id: 'Anime', label: 'Anime', icon: '✨' },
    { id: 'Cyberpunk', label: 'Cyberpunk', icon: '🤖' },
    { id: 'Fantasy', label: 'Fantasy', icon: '🐉' },
    { id: '3D', label: '3D', icon: '🧊' },
    { id: 'Gaming', label: 'Gaming', icon: '🎮' },
    { id: 'Cinematic', label: 'Cinematic', icon: '🎬' },
    { id: 'Horror', label: 'Horror', icon: '🦇' },
    { id: 'Architecture', label: 'Architecture', icon: '🏛️' },
    { id: 'Digital Art', label: 'Digital Art', icon: '🎨' },
  ];

  const aspectRatios = [
    { id: '1:1', label: 'Square (1:1)', shape: 'w-5 h-5' },
    { id: '3:4', label: 'Portrait (3:4)', shape: 'w-4 h-5' },
    { id: '16:9', label: 'Landscape (16:9)', shape: 'w-6 h-3.5' },
    { id: '9:16', label: 'Wallpaper (9:16)', shape: 'w-3.5 h-6' },
  ];

  const lightings = ['Studio', 'Neon', 'Sunset', 'Dark', 'Cinematic'];
  const colors = ['Warm', 'Cold', 'Neon', 'Pastel'];

  // 1. GENERATE
  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    if (user && user.credits <= 0) {
      setErrorMsg('Daily generation credits exhausted (0/5). Check reset timer in credits menu.');
      onOpenCredits();
      return;
    }

    setIsGenerating(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt.trim(),
          style,
          aspectRatio,
          quality,
          lighting,
          color,
          category: 'general',
          model: selectedModel,
          userId: user?.id || 'user-current',
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Generation failed');
      }

      setCurrentImage(data.image);
      setRecentHistory((prev) => [data.image, ...prev.slice(0, 5)]);
      onImageGenerated(data.image);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error communicating with AI engine');
    } finally {
      setIsGenerating(false);
    }
  };

  // 2. IMPROVE PROMPT VIA GEMINI
  const handleImprovePrompt = async () => {
    if (!prompt.trim()) return;
    setIsEnhancing(true);
    try {
      const res = await fetch('/api/prompt/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, style, lighting, color }),
      });
      const data = await res.json();
      if (data.enhancedPrompt) {
        setPrompt(data.enhancedPrompt);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsEnhancing(false);
    }
  };

  // 3. RANDOM IDEA
  const handleRandomIdea = async () => {
    setIsRandomizing(true);
    try {
      const res = await fetch('/api/prompt/random');
      const data = await res.json();
      if (data.prompt) {
        setPrompt(data.prompt);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsRandomizing(false);
    }
  };

  const handleDownload = () => {
    if (!currentImage) return;
    downloadImage(currentImage.imageUrl, `PixelForge_${style}_${Date.now()}.png`);
  };

  const handleCopyPrompt = () => {
    if (!currentImage) return;
    navigator.clipboard.writeText(currentImage.prompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const handleShareToCommunity = () => {
    setSharedNotice(true);
    setTimeout(() => setSharedNotice(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Studio Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/[0.08]">
        <div>
          <h1 className="text-2xl font-bold font-display text-white flex items-center gap-2.5">
            <span>AI Creative Studio</span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
              v3.8
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            High-fidelity generative image synthesis with Google AI Studio
          </p>
        </div>

        {/* Remaining credits status bar */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenCredits}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-slate-300 hover:border-purple-500/40 transition-colors"
          >
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>Credits: <strong className="text-purple-300">{user?.credits ?? 5}/5</strong></span>
          </button>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: CONTROLS (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Prompt Box Container */}
          <div className="p-4 rounded-2xl bg-[#0f1220] border border-purple-500/20 shadow-xl shadow-purple-950/20">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>Prompt Input</span>
              </label>
              <div className="flex items-center gap-1.5">
                <button
                  id="studio-improve-btn"
                  onClick={handleImprovePrompt}
                  disabled={isEnhancing || !prompt.trim()}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-[11px] font-medium text-purple-300 transition-colors disabled:opacity-50"
                  title="Enhance prompt with Gemini AI"
                >
                  {isEnhancing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />}
                  <span>Improve Prompt</span>
                </button>

                <button
                  id="studio-random-btn"
                  onClick={handleRandomIdea}
                  disabled={isRandomizing}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-[11px] font-medium text-slate-300 transition-colors"
                  title="Get inspiration prompt"
                >
                  <Dice5 className={`w-3 h-3 text-cyan-400 ${isRandomizing ? 'animate-spin' : ''}`} />
                  <span>Random</span>
                </button>
              </div>
            </div>

            <textarea
              id="studio-prompt-textarea"
              rows={4}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your imagination in detail..."
              className="w-full bg-[#15192d] border border-white/10 focus:border-purple-500 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500 leading-relaxed resize-none transition-all"
            />

            {errorMsg && (
              <div className="mt-2 p-2.5 rounded-lg bg-red-950/60 border border-red-500/30 text-xs text-red-300 flex items-center justify-between">
                <span>{errorMsg}</span>
                <button onClick={() => setErrorMsg(null)} className="text-red-400 hover:text-red-200">×</button>
              </div>
            )}

            {/* GENERATE PRIMARY BUTTON */}
            <button
              id="studio-generate-btn"
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="w-full mt-3 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:brightness-110 active:scale-[0.99] text-white font-semibold text-xs tracking-wide shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Synthesizing Artwork with AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-cyan-200" />
                  <span>Generate AI Image (1 Credit)</span>
                </>
              )}
            </button>
          </div>

          {/* AI MODEL SELECTOR */}
          <div className="p-4 rounded-2xl bg-[#0f1220] border border-white/[0.08] space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                <span>AI Generation Model</span>
              </label>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                Free & Unlimited
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                id="model-flux"
                onClick={() => setSelectedModel('flux')}
                className={`p-2.5 rounded-xl text-left border transition-all ${
                  selectedModel === 'flux'
                    ? 'bg-purple-600/20 border-purple-500 text-white shadow-sm shadow-purple-500/20'
                    : 'bg-white/[0.02] border-white/5 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">FLUX.1</span>
                  <span className="text-[9px] uppercase font-bold bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded">Free</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1 leading-tight">High Fidelity Open AI</p>
              </button>

              <button
                type="button"
                id="model-turbo"
                onClick={() => setSelectedModel('turbo')}
                className={`p-2.5 rounded-xl text-left border transition-all ${
                  selectedModel === 'turbo'
                    ? 'bg-purple-600/20 border-purple-500 text-white shadow-sm shadow-purple-500/20'
                    : 'bg-white/[0.02] border-white/5 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">FLUX Turbo</span>
                  <span className="text-[9px] uppercase font-bold bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded">Fast</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1 leading-tight">1-Step Fast Generation</p>
              </button>

              <button
                type="button"
                id="model-gemini"
                onClick={() => setSelectedModel('gemini')}
                className={`p-2.5 rounded-xl text-left border transition-all ${
                  selectedModel === 'gemini'
                    ? 'bg-purple-600/20 border-purple-500 text-white shadow-sm shadow-purple-500/20'
                    : 'bg-white/[0.02] border-white/5 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Gemini 3.1</span>
                  <span className="text-[9px] uppercase font-bold bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded">Google</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1 leading-tight">AI Studio Studio Engine</p>
              </button>
            </div>

            <p className="text-[10px] text-slate-400/90 leading-normal flex items-start gap-1.5 pt-1">
              <Info className="w-3 h-3 text-cyan-400 shrink-0 mt-0.5" />
              <span>
                <strong>Note on Claude:</strong> Anthropic Claude is a language model and does not provide an image generation API. FLUX.1 delivers state-of-the-art open diffusion image generation directly for free.
              </span>
            </p>
          </div>

          {/* STYLE SELECTOR */}
          <div className="p-4 rounded-2xl bg-[#0f1220] border border-white/[0.08]">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2.5">
              Style Preset ({stylesList.length})
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
              {stylesList.map((item) => {
                const isSelected = style === item.id;
                return (
                  <button
                    key={item.id}
                    id={`studio-style-${item.id}`}
                    onClick={() => setStyle(item.id)}
                    className={`flex items-center gap-1.5 p-2 rounded-xl text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-purple-600/30 text-purple-200 border border-purple-500 shadow-sm shadow-purple-500/30'
                        : 'bg-white/[0.02] text-slate-400 border border-white/[0.05] hover:bg-white/[0.06] hover:text-slate-200'
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ASPECT RATIO & QUALITY */}
          <div className="p-4 rounded-2xl bg-[#0f1220] border border-white/[0.08] space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Aspect Ratio
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {aspectRatios.map((ar) => (
                  <button
                    key={ar.id}
                    id={`studio-ar-${ar.id}`}
                    onClick={() => setAspectRatio(ar.id as any)}
                    className={`flex items-center gap-2 p-2 rounded-xl text-xs font-medium transition-all ${
                      aspectRatio === ar.id
                        ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/40 shadow-sm shadow-cyan-500/20'
                        : 'bg-white/[0.02] text-slate-400 border border-white/[0.05] hover:bg-white/[0.05] hover:text-slate-200'
                    }`}
                  >
                    <div className={`border border-current rounded-sm ${ar.shape}`} />
                    <span className="truncate">{ar.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Render Quality
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['fast', 'standard', 'hd'] as const).map((q) => (
                  <button
                    key={q}
                    id={`studio-quality-${q}`}
                    onClick={() => setQuality(q)}
                    className={`py-1.5 px-3 rounded-xl text-xs font-medium capitalize transition-all ${
                      quality === q
                        ? 'bg-purple-600/30 text-purple-200 border border-purple-500/40'
                        : 'bg-white/[0.02] text-slate-400 border border-white/[0.05] hover:bg-white/[0.05]'
                    }`}
                  >
                    {q} {q === 'hd' ? '🌟' : ''}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* LIGHTING & COLOR CONTROLS */}
          <div className="p-4 rounded-2xl bg-[#0f1220] border border-white/[0.08] space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Lighting Atmosphere
              </label>
              <div className="flex flex-wrap gap-1.5">
                {lightings.map((lit) => (
                  <button
                    key={lit}
                    id={`studio-lighting-${lit}`}
                    onClick={() => setLighting(lit)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      lighting === lit
                        ? 'bg-amber-500/20 text-amber-200 border border-amber-500/40'
                        : 'bg-white/[0.02] text-slate-400 border border-white/[0.05] hover:bg-white/[0.05]'
                    }`}
                  >
                    {lit}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Color Palette Tone
              </label>
              <div className="flex flex-wrap gap-1.5">
                {colors.map((c) => (
                  <button
                    key={c}
                    id={`studio-color-${c}`}
                    onClick={() => setColor(c)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      color === c
                        ? 'bg-pink-500/20 text-pink-200 border border-pink-500/40'
                        : 'bg-white/[0.02] text-slate-400 border border-white/[0.05] hover:bg-white/[0.05]'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Advanced Toggle */}
            <div className="pt-2 border-t border-white/[0.06]">
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>{showAdvanced ? 'Hide Advanced Options' : 'Show Advanced Negative Prompt'}</span>
              </button>
              {showAdvanced && (
                <div className="mt-3">
                  <input
                    type="text"
                    value={negativePrompt}
                    onChange={(e) => setNegativePrompt(e.target.value)}
                    placeholder="Negative elements (e.g. blurry, watermark, distortion)"
                    className="w-full bg-[#15192d] border border-white/10 focus:border-purple-500 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: CANVAS & GENERATED ARTWORK (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-4 sm:p-6 rounded-2xl bg-[#0f1220] border border-purple-500/20 shadow-2xl shadow-purple-950/20 relative min-h-[460px] flex flex-col justify-between overflow-hidden">
            {/* Ambient canvas glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

            {/* Canvas Header info */}
            <div className="flex items-center justify-between gap-2 pb-3 border-b border-white/[0.06] z-10 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-semibold text-slate-200">
                  {currentImage ? 'Render Complete' : 'Interactive Canvas Stage'}
                </span>
                {currentImage?.engine && (
                  <span className="hidden sm:inline-block text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    {currentImage.engine}
                  </span>
                )}
              </div>
              <span className="text-[11px] text-slate-400">
                Resolution: {aspectRatio === '16:9' ? '1920x1080' : aspectRatio === '9:16' ? '1080x1920' : '1024x1024'} • {style}
              </span>
            </div>

            {/* Canvas Body */}
            <div className="my-auto py-4 flex items-center justify-center z-10">
              {isGenerating ? (
                <div className="flex flex-col items-center justify-center p-12 text-center space-y-4">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-purple-600 to-cyan-400 animate-spin blur-md opacity-70" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Sparkles className="w-8 h-8 text-white animate-pulse" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      Synthesizing with {selectedModel === 'turbo' ? 'FLUX Turbo Free AI' : selectedModel === 'gemini' ? 'Google AI Studio Engine' : 'FLUX.1 Diffusion Model'}
                    </h3>
                    <p className="text-xs text-slate-400 max-w-xs mt-1">
                      Applying {style} style, {lighting} lighting, and ultra-detailed neural refinement...
                    </p>
                  </div>
                </div>
              ) : currentImage ? (
                <div className="w-full flex flex-col items-center">
                  <div
                    className={`relative rounded-2xl overflow-hidden border border-white/15 shadow-2xl shadow-purple-950/40 group max-w-full ${
                      aspectRatio === '16:9' ? 'aspect-video w-full' : aspectRatio === '9:16' ? 'aspect-[9/16] max-h-[500px]' : 'aspect-square max-h-[480px]'
                    }`}
                  >
                    <img
                      src={currentImage.imageUrl}
                      alt={currentImage.prompt}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                  </div>

                  {/* Prompt badge below image */}
                  <div className="mt-4 p-3 rounded-xl bg-[#14182b] border border-white/[0.06] w-full text-xs text-slate-300 flex items-center justify-between gap-3">
                    <p className="line-clamp-2 italic text-slate-300 font-normal">"{currentImage.prompt}"</p>
                    <button
                      onClick={handleCopyPrompt}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition-colors shrink-0"
                      title="Copy Prompt"
                    >
                      {copiedPrompt ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-10 text-center space-y-3">
                  <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-purple-400/80" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white font-display">Ready for Generation</h3>
                    <p className="text-xs text-slate-400 max-w-sm mt-1">
                      Type your imagination prompt on the left and click <strong>Generate</strong> to forge a new AI masterpiece.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Canvas Actions Footer */}
            {currentImage && (
              <div className="pt-3 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-2 z-10">
                <div className="flex items-center gap-2">
                  <button
                    id="studio-download-btn"
                    onClick={handleDownload}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md shadow-purple-600/30 transition-all active:scale-95"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download HD</span>
                  </button>

                  <button
                    id="studio-edit-btn"
                    onClick={() => onNavigate('editor', currentImage.imageUrl)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.09] text-slate-200 text-xs font-medium border border-white/10 transition-colors"
                  >
                    <Wand2 className="w-3.5 h-3.5 text-pink-400" />
                    <span>Edit in AI Studio</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    id="studio-share-btn"
                    onClick={handleShareToCommunity}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.09] text-slate-200 text-xs font-medium border border-white/10 transition-colors"
                  >
                    <Share2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{sharedNotice ? 'Added to Feed!' : 'Share to Community'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* RECENT SESSION GENERATIONS STRIP */}
          {recentHistory.length > 0 && (
            <div className="p-4 rounded-2xl bg-[#0f1220] border border-white/[0.08]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Session History ({recentHistory.length})
                </span>
                <span className="text-[11px] text-slate-500">Click to preview</span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {recentHistory.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setCurrentImage(item)}
                    className={`aspect-square rounded-xl overflow-hidden border transition-all ${
                      currentImage?.id === item.id ? 'border-purple-400 ring-2 ring-purple-500/30 scale-105' : 'border-white/10 hover:border-white/30'
                    }`}
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.prompt}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
