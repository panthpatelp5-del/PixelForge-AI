import React, { useState, useEffect } from 'react';
import {
  Heart,
  Copy,
  Check,
  Sparkles,
  Download,
  Share2,
  Compass,
  Filter,
  Search,
  MessageSquare,
  Tag,
} from 'lucide-react';
import { GeneratedImage, PageId, User } from '../types';
import { downloadImage } from '../utils/download';

interface CommunityPageProps {
  user: User | null;
  onNavigate: (page: PageId, prefillPrompt?: string) => void;
  savedImages: GeneratedImage[];
}

export const CommunityPage: React.FC<CommunityPageProps> = ({
  user,
  onNavigate,
  savedImages,
}) => {
  const [feedImages, setFeedImages] = useState<GeneratedImage[]>([]);
  const [filterStyle, setFilterStyle] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());

  // Default seed images if none fetched yet
  const defaultSeeds: GeneratedImage[] = [
    {
      id: 'comm-1',
      userId: 'user-kai',
      prompt: 'Cyberpunk ronin with glowing amethyst plasma katana walking through Neo-Kyoto in heavy rain, volumetric purple mist, octane render 8k',
      style: 'Cyberpunk',
      aspectRatio: '1:1',
      imageUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      likes: 642,
      isPublic: true,
      authorName: 'AuraDreamer',
      tags: ['cyberpunk', 'ronin', 'neon', 'katana'],
    },
    {
      id: 'comm-2',
      userId: 'user-elena',
      prompt: 'Enchanted anime forest spirit guardian with bioluminescent crystal antlers, hovering fairy fireflies, high fantasy masterpiece',
      style: 'Anime',
      aspectRatio: '1:1',
      imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
      createdAt: new Date(Date.now() - 7200000).toISOString(),
      likes: 512,
      isPublic: true,
      authorName: 'KaiVortex',
      tags: ['anime', 'fantasy', 'spirit', 'forest'],
    },
    {
      id: 'comm-3',
      userId: 'user-marcus',
      prompt: 'Interstellar planetary nebula ring colliding with stellar cosmic auroras, cinematic IMAX 70mm astronomy photo',
      style: 'Realistic',
      aspectRatio: '16:9',
      imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
      createdAt: new Date(Date.now() - 10800000).toISOString(),
      likes: 830,
      isPublic: true,
      authorName: 'StarlightNomad',
      tags: ['space', 'cosmic', 'nebula', 'wallpaper'],
    },
    {
      id: 'comm-4',
      userId: 'user-sophia',
      prompt: 'Minimalist origami fox logo with neon violet and cyan glowing outline, pitch black backdrop, vector emblem',
      style: 'Digital Art',
      aspectRatio: '1:1',
      imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
      createdAt: new Date(Date.now() - 14400000).toISOString(),
      likes: 388,
      isPublic: true,
      authorName: 'ZenithDesign',
      tags: ['logo', 'minimalist', 'vector', 'origami'],
    },
    {
      id: 'comm-5',
      userId: 'user-lucas',
      prompt: 'Cybernetic executive portrait with sleek titanium neural visor, ambient violet rim light, 85mm portrait studio',
      style: 'Realistic',
      aspectRatio: '1:1',
      imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=80',
      createdAt: new Date(Date.now() - 18000000).toISOString(),
      likes: 476,
      isPublic: true,
      authorName: 'NexusCreator',
      tags: ['avatar', 'portrait', 'cyber', 'tech'],
    },
    {
      id: 'comm-6',
      userId: 'user-chloe',
      prompt: 'Gothic fantasy citadel engulfed in floating arcane sigils, deep emerald aurora, dramatic clouds, Unreal Engine 5 render',
      style: 'Fantasy',
      aspectRatio: '16:9',
      imageUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=800&auto=format&fit=crop&q=80',
      createdAt: new Date(Date.now() - 21600000).toISOString(),
      likes: 721,
      isPublic: true,
      authorName: 'ArcaneWanderer',
      tags: ['fantasy', 'castle', 'magic', 'unreal'],
    },
  ];

  useEffect(() => {
    let isMounted = true;
    const loadCommunityFeed = async () => {
      try {
        const res = await fetch('/api/community?category=all&filter=trending');
        if (res.ok) {
          const data = await res.json();
          if (data.images && Array.isArray(data.images) && data.images.length > 0) {
            if (!isMounted) return;
            // Merge with local session saved images, deduplicating by ID
            const map = new Map<string, GeneratedImage>();
            for (const img of savedImages) {
              map.set(img.id, img);
            }
            for (const img of data.images) {
              if (!map.has(img.id)) map.set(img.id, img);
            }
            for (const img of defaultSeeds) {
              if (!map.has(img.id)) map.set(img.id, img);
            }
            setFeedImages(Array.from(map.values()));
            return;
          }
        }
      } catch (err) {
        console.warn('Could not fetch community feed:', err);
      }
      if (isMounted) {
        setFeedImages([...savedImages, ...defaultSeeds]);
      }
    };
    loadCommunityFeed();
    return () => {
      isMounted = false;
    };
  }, [savedImages]);

  const handleToggleLike = async (id: string) => {
    const isLiked = likedIds.has(id);
    const newLiked = new Set(likedIds);
    if (isLiked) {
      newLiked.delete(id);
    } else {
      newLiked.add(id);
    }
    setLikedIds(newLiked);

    setFeedImages((prev) =>
      prev.map((img) =>
        img.id === id ? { ...img, likes: img.likes + (isLiked ? -1 : 1) } : img
      )
    );

    try {
      await fetch(`/api/community/like/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.id || 'user-current' }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleCopyPrompt = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownload = (imageUrl: string, prompt: string) => {
    downloadImage(imageUrl, `PixelForge_${prompt.slice(0, 20).replace(/\s+/g, '_')}.png`);
  };

  const filteredImages = feedImages.filter((img) => {
    const matchesStyle = filterStyle === 'All' || img.style === filterStyle;
    const matchesSearch =
      searchQuery === '' ||
      img.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (img.authorName && img.authorName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (img.tags && img.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesStyle && matchesSearch;
  });

  const styles = ['All', 'Realistic', 'Anime', 'Cyberpunk', 'Fantasy', 'Digital Art'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/[0.08]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-white flex items-center gap-2.5">
            <Compass className="w-7 h-7 text-purple-400" />
            <span>Community Feed</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Discover prompts and generations shared by creators around the world. Copy or remix with 1-click.
          </p>
        </div>

        {/* Search bar */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            id="community-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search prompts, authors, tags..."
            className="w-full bg-[#121526] border border-white/10 focus:border-purple-500 rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6">
        <Filter className="w-3.5 h-3.5 text-slate-500 shrink-0" />
        {styles.map((s) => (
          <button
            key={s}
            id={`community-filter-${s.toLowerCase().replace(/\s+/g, '-')}`}
            onClick={() => setFilterStyle(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              filterStyle === s
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'bg-white/[0.03] text-slate-400 hover:bg-white/[0.08] hover:text-slate-200 border border-white/[0.06]'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* MASONRY / GRID DISPLAY */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredImages.map((item) => {
          const isLiked = likedIds.has(item.id);
          return (
            <div
              key={item.id}
              className="group rounded-2xl bg-[#0f1220] border border-white/[0.08] hover:border-purple-500/40 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-purple-950/30 flex flex-col justify-between"
            >
              {/* Image Preview Container */}
              <div className="relative aspect-square overflow-hidden bg-black/40">
                <img
                  src={item.imageUrl}
                  alt={item.prompt}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Top badges */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-semibold text-purple-300 border border-white/10">
                    {item.style}
                  </span>
                </div>

                {/* Like button on top-right */}
                <button
                  id={`like-btn-${item.id}`}
                  onClick={() => handleToggleLike(item.id)}
                  className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all ${
                    isLiked
                      ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/40'
                      : 'bg-black/50 text-white hover:bg-black/80'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                </button>

                {/* Overlay with Quick Actions on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                  <div className="flex items-center gap-2">
                    <button
                      id={`remix-btn-${item.id}`}
                      onClick={() => onNavigate('create', item.prompt)}
                      className="flex-1 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md shadow-purple-600/30 transition-all"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Remix in Studio</span>
                    </button>

                    <button
                      id={`copy-btn-${item.id}`}
                      onClick={() => handleCopyPrompt(item.id, item.prompt)}
                      className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                      title="Copy Prompt"
                    >
                      {copiedId === item.id ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>

                    <button
                      id={`download-feed-btn-${item.id}`}
                      onClick={() => handleDownload(item.imageUrl, item.prompt)}
                      className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                      title="Download"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Card Footer Details */}
              <div className="p-4 space-y-3">
                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed font-normal">
                  "{item.prompt}"
                </p>

                {/* Author and stats */}
                <div className="flex items-center justify-between pt-2 border-t border-white/[0.06] text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-purple-500 to-cyan-400 flex items-center justify-center text-[10px] font-bold text-white uppercase">
                      {(item.authorName || 'Creator')[0]}
                    </div>
                    <span className="text-slate-300 font-medium text-xs">
                      {item.authorName || 'Creator'}
                    </span>
                  </div>

                  <span className="text-xs text-purple-300 font-semibold flex items-center gap-1">
                    <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current text-rose-400' : 'text-slate-400'}`} />
                    {item.likes}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
