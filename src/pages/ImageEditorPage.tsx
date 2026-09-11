import React, { useState, useRef } from 'react';
import {
  Upload,
  Wand2,
  Sparkles,
  Download,
  Image as ImageIcon,
  ArrowRight,
  Eye,
  RefreshCw,
  Loader2,
  CheckCircle2,
  SlidersHorizontal,
} from 'lucide-react';
import { GeneratedImage, User, PageId } from '../types';
import { downloadImage } from '../utils/download';

interface ImageEditorPageProps {
  initialImageSrc?: string;
  user: User | null;
  onImageGenerated: (img: GeneratedImage) => void;
  onOpenCredits: () => void;
  onNavigate: (page: PageId, param?: string) => void;
}

export const ImageEditorPage: React.FC<ImageEditorPageProps> = ({
  initialImageSrc,
  user,
  onImageGenerated,
  onOpenCredits,
}) => {
  const [sourceImage, setSourceImage] = useState<string>(
    initialImageSrc || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=80'
  );
  const [activeInstruction, setActiveInstruction] = useState('Make this anime');
  const [customPrompt, setCustomPrompt] = useState('');
  const [isTransforming, setIsTransforming] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{
    description?: string;
    suggestedPrompt?: string;
    suggestedStyle?: string;
  } | null>(null);

  const [transformedImage, setTransformedImage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const quickPresets = [
    { label: 'Make this anime', icon: '✨', prompt: 'Convert into beautiful Japanese anime art style with vibrant cel shading and expressive eyes' },
    { label: 'Change background', icon: '🌆', prompt: 'Replace the background with a futuristic cyberpunk cityscape at night with neon holographic billboards' },
    { label: 'Add effects', icon: '⚡', prompt: 'Add cinematic volumetric lighting, glowing mystical energy particles, and dramatic rim light reflections' },
    { label: 'Improve quality', icon: '💎', prompt: 'Enhance image fidelity, sharpen fine micro-textures, 8k resolution, and studio HDR clarity' },
    { label: 'Change style', icon: '🎨', prompt: 'Transform this artwork into an oil painting on canvas with rich impasto brush strokes and impressionist color grading' },
  ];

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setSourceImage(reader.result);
        setTransformedImage(null);
        setAnalysisResult(null);
      }
    };
    reader.readAsDataURL(file);
  };

  // Drag and drop handlers
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setSourceImage(reader.result);
          setTransformedImage(null);
          setAnalysisResult(null);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Execute AI Transformation
  const handleTransform = async () => {
    if (!sourceImage) return;
    if (user && user.credits <= 0) {
      setErrorMsg('Daily generation credits exhausted (0/5). Check reset timer.');
      onOpenCredits();
      return;
    }

    setIsTransforming(true);
    setErrorMsg(null);

    const chosenPreset = quickPresets.find((p) => p.label === activeInstruction);
    const instructionText = customPrompt.trim()
      ? `${activeInstruction}: ${customPrompt.trim()}`
      : chosenPreset?.prompt || activeInstruction;

    try {
      const res = await fetch('/api/edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: sourceImage,
          instruction: activeInstruction,
          customPrompt: instructionText,
          userId: user?.id || 'user-current',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Edit operation failed');
      }

      setTransformedImage(data.image.imageUrl);
      onImageGenerated(data.image);
    } catch (err: any) {
      setErrorMsg(err.message || 'Transformation failed');
    } finally {
      setIsTransforming(false);
    }
  };

  // AI Reverse-engineer / Describe
  const handleAnalyzeImage = async () => {
    if (!sourceImage) return;
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/prompt/describe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: sourceImage }),
      });
      const data = await res.json();
      setAnalysisResult(data);
      if (data.suggestedPrompt) {
        setCustomPrompt(data.suggestedPrompt);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDownloadResult = () => {
    if (!transformedImage) return;
    downloadImage(transformedImage, `PixelForge_Edited_${Date.now()}.png`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/[0.08]">
        <div>
          <h1 className="text-2xl font-bold font-display text-white flex items-center gap-2.5">
            <Wand2 className="w-6 h-6 text-pink-400" />
            <span>AI Image Editor & Modifier</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Modify backgrounds, convert to anime, add visual effects, and elevate quality
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
        {/* LEFT COLUMN: UPLOAD & MOD CONTROLS (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* UPLOAD BOX */}
          <div className="p-4 rounded-2xl bg-[#0f1220] border border-white/[0.08]">
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Source Image
              </label>
              <button
                type="button"
                onClick={handleAnalyzeImage}
                disabled={isAnalyzing}
                className="flex items-center gap-1 text-[11px] font-medium text-cyan-400 hover:text-cyan-300 transition-colors disabled:opacity-50"
              >
                {isAnalyzing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Eye className="w-3 h-3" />}
                <span>AI Describe Image</span>
              </button>
            </div>

            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-white/15 hover:border-purple-500/50 rounded-xl p-4 text-center cursor-pointer transition-colors bg-white/[0.01] hover:bg-purple-500/[0.02]"
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              <Upload className="w-6 h-6 text-purple-400 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-200">
                Drag & drop or click to upload photo
              </p>
              <p className="text-[10px] text-slate-500 mt-1">
                PNG, JPG, WebP up to 25MB
              </p>
            </div>

            {/* Analysis Box if available */}
            {analysisResult && (
              <div className="mt-3 p-3 rounded-xl bg-purple-950/30 border border-purple-500/20 text-xs text-slate-300 space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-purple-300 font-semibold">
                  <span>Gemini Vision Analysis</span>
                  <span className="px-2 py-0.5 rounded bg-purple-500/20">{analysisResult.suggestedStyle}</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">{analysisResult.description}</p>
              </div>
            )}
          </div>

          {/* PRESET MODIFICATIONS */}
          <div className="p-4 rounded-2xl bg-[#0f1220] border border-white/[0.08]">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2.5">
              AI Modifications
            </label>
            <div className="space-y-2">
              {quickPresets.map((preset) => {
                const isSelected = activeInstruction === preset.label;
                return (
                  <button
                    key={preset.label}
                    id={`editor-preset-${preset.label.toLowerCase().replace(/\s+/g, '-')}`}
                    onClick={() => setActiveInstruction(preset.label)}
                    className={`w-full text-left p-3 rounded-xl flex items-center justify-between text-xs transition-all ${
                      isSelected
                        ? 'bg-pink-600/20 border border-pink-500/50 text-white shadow-sm shadow-pink-500/20'
                        : 'bg-white/[0.02] border border-white/[0.05] text-slate-400 hover:bg-white/[0.06] hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base">{preset.icon}</span>
                      <div>
                        <span className="font-semibold block">{preset.label}</span>
                        <span className="text-[10px] text-slate-400 line-clamp-1">{preset.prompt}</span>
                      </div>
                    </div>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-pink-400 shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Custom Edit Instructions */}
            <div className="mt-4 pt-3 border-t border-white/[0.06]">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Custom Edit Prompt (Optional)
              </label>
              <textarea
                rows={2}
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Add specific details (e.g. add purple neon visor, change weather to blizzard)"
                className="w-full bg-[#15192d] border border-white/10 focus:border-pink-500 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none resize-none"
              />
            </div>

            {errorMsg && (
              <div className="mt-3 p-2.5 rounded-lg bg-red-950/60 border border-red-500/30 text-xs text-red-300">
                {errorMsg}
              </div>
            )}

            {/* ACTION BUTTON */}
            <button
              id="editor-transform-btn"
              onClick={handleTransform}
              disabled={isTransforming || !sourceImage}
              className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-500 hover:brightness-110 active:scale-[0.99] text-white font-semibold text-xs shadow-lg shadow-pink-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {isTransforming ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Transforming Artwork...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  <span>Apply AI Transformation (1 Credit)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: BEFORE & AFTER COMPARISON (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-4 sm:p-6 rounded-2xl bg-[#0f1220] border border-white/[0.08] shadow-2xl relative min-h-[460px] flex flex-col justify-between">
            {/* Header info */}
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] text-xs">
              <span className="font-semibold text-slate-300">
                {transformedImage ? 'Transformed Result' : 'Original Source vs AI Preview'}
              </span>
              <span className="text-[11px] text-pink-400 font-medium">Mode: {activeInstruction}</span>
            </div>

            {/* Canvas Display */}
            <div className="my-auto py-4">
              {isTransforming ? (
                <div className="flex flex-col items-center justify-center p-12 text-center space-y-3">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-pink-600 to-purple-600 animate-pulse flex items-center justify-center">
                    <Wand2 className="w-8 h-8 text-white animate-spin" />
                  </div>
                  <h4 className="text-sm font-bold text-white">Applying Neural Transformation</h4>
                  <p className="text-xs text-slate-400">Processing multimodal modification with Google AI Studio...</p>
                </div>
              ) : transformedImage ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-semibold text-slate-400 block text-center">Original</span>
                      <div className="aspect-square rounded-xl overflow-hidden border border-white/10 bg-black/40">
                        <img
                          src={sourceImage}
                          alt="Original"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[11px] font-semibold text-pink-400 block text-center">AI Transformed</span>
                      <div className="aspect-square rounded-xl overflow-hidden border border-pink-500/40 ring-2 ring-pink-500/20 bg-black/40 shadow-xl shadow-pink-950/40">
                        <img
                          src={transformedImage}
                          alt="Transformed"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#14182b] border border-white/[0.06] text-xs text-slate-300">
                    <span className="font-semibold text-pink-300 block mb-0.5">Applied Transformation:</span>
                    <span>{activeInstruction}</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="max-w-md w-full aspect-square rounded-2xl overflow-hidden border border-white/15 relative">
                    <img
                      src={sourceImage}
                      alt="Source"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] text-white border border-white/10">
                      Original Uploaded Image
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer buttons */}
            {transformedImage && (
              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between gap-3">
                <button
                  id="editor-download-btn"
                  onClick={handleDownloadResult}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-semibold shadow-md shadow-pink-600/30 transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Transformed Image</span>
                </button>

                <button
                  onClick={() => {
                    setSourceImage(transformedImage);
                    setTransformedImage(null);
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.09] text-xs text-slate-300 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Use as New Source</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
