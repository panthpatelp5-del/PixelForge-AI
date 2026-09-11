import React, { useState, useEffect } from 'react';
import { PageId, User, GeneratedImage } from './types';
import { Navbar } from './components/Navbar';
import { CreditModal } from './components/CreditModal';
import { AuthModal } from './components/AuthModal';

// Pages
import { LandingPage } from './pages/LandingPage';
import { CreateStudioPage } from './pages/CreateStudioPage';
import { ImageEditorPage } from './pages/ImageEditorPage';
import { AvatarStudioPage } from './pages/AvatarStudioPage';
import { LogoMakerPage } from './pages/LogoMakerPage';
import { WallpaperStudioPage } from './pages/WallpaperStudioPage';
import { CommunityPage } from './pages/CommunityPage';
import { ProfileDashboardPage } from './pages/ProfileDashboardPage';
import { PromptMarketplacePage } from './pages/PromptMarketplacePage';
import { AdminPanelPage } from './pages/AdminPanelPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId>('landing');
  const [prefillPrompt, setPrefillPrompt] = useState<string>('');
  const [editorSourceImage, setEditorSourceImage] = useState<string>('');

  // Default initial demo user
  const [user, setUser] = useState<User>({
    id: 'user-current',
    username: 'CreativeExplorer',
    email: 'creator@pixelforge.ai',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    credits: 5,
    maxCredits: 5,
    role: 'creator',
    plan: 'Free Plan',
  });

  const [savedImages, setSavedImages] = useState<GeneratedImage[]>([]);
  const [isCreditsModalOpen, setIsCreditsModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [msUntilReset, setMsUntilReset] = useState(0);

  // Calculate milliseconds until next midnight UTC
  const calculateMsUntilMidnightUTC = () => {
    const now = new Date();
    const nextMidnightUTC = new Date(Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() + 1,
      0, 0, 0, 0
    ));
    return Math.max(0, nextMidnightUTC.getTime() - now.getTime());
  };

  // Timer tick for daily reset
  useEffect(() => {
    setMsUntilReset(calculateMsUntilMidnightUTC());
    const interval = setInterval(() => {
      setMsUntilReset(calculateMsUntilMidnightUTC());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch initial credits from server
  const refreshCredits = async () => {
    try {
      const res = await fetch(`/api/credits?userId=${user.id}`);
      if (!res.ok) return;
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) return;

      const data = await res.json();
      if (data.credits !== undefined) {
        setUser((prev) => ({
          ...prev,
          credits: data.credits,
          maxCredits: data.maxCredits || 5,
        }));
      }
    } catch {
      // Gracefully silent on transient network/load states
    }
  };

  useEffect(() => {
    refreshCredits();
    // Load persisted user gallery from server
    const fetchUserGallery = async () => {
      try {
        const res = await fetch(`/api/user/gallery?userId=${user.id}`);
        if (res.ok) {
          const data = await res.json();
          if (data.images && Array.isArray(data.images)) {
            setSavedImages(data.images);
          }
        }
      } catch {
        // Fallback gracefully
      }
    };
    fetchUserGallery();
  }, [user.id]);

  const handleNavigate = (page: PageId, param?: string) => {
    if (page === 'create' && param) {
      setPrefillPrompt(param);
    } else if (page === 'editor' && param) {
      setEditorSourceImage(param);
    }
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleImageGenerated = (img: GeneratedImage) => {
    setSavedImages((prev) => [img, ...prev]);
    setUser((prev) => ({
      ...prev,
      credits: Math.max(0, prev.credits - 1),
    }));
  };

  const handleLoginAsAdmin = async () => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'PixelAdmin',
          email: 'admin@pixelforge.ai',
        }),
      });
      const data = await res.json();
      if (data.user) {
        setUser(data.user);
        setCurrentPage('admin');
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-[#070913] text-slate-100 flex flex-col selection:bg-purple-500 selection:text-white">
      {/* Navigation Header */}
      <Navbar
        currentPage={currentPage}
        setCurrentPage={(page) => handleNavigate(page)}
        user={user}
        msUntilReset={msUntilReset}
        onOpenCreditsModal={() => setIsCreditsModalOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      {/* Main View Router */}
      <main className="flex-1 w-full pb-16">
        {currentPage === 'landing' && (
          <LandingPage
            onNavigate={handleNavigate}
            user={user}
            onOpenCredits={() => setIsCreditsModalOpen(true)}
          />
        )}

        {currentPage === 'create' && (
          <CreateStudioPage
            initialPrompt={prefillPrompt}
            user={user}
            onImageGenerated={handleImageGenerated}
            onNavigate={handleNavigate}
            onOpenCredits={() => setIsCreditsModalOpen(true)}
          />
        )}

        {currentPage === 'editor' && (
          <ImageEditorPage
            initialImageSrc={editorSourceImage}
            user={user}
            onImageGenerated={handleImageGenerated}
            onOpenCredits={() => setIsCreditsModalOpen(true)}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'avatar' && (
          <AvatarStudioPage
            user={user}
            onImageGenerated={handleImageGenerated}
            onNavigate={handleNavigate}
            onOpenCredits={() => setIsCreditsModalOpen(true)}
          />
        )}

        {currentPage === 'logo' && (
          <LogoMakerPage
            user={user}
            onImageGenerated={handleImageGenerated}
            onOpenCredits={() => setIsCreditsModalOpen(true)}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'wallpaper' && (
          <WallpaperStudioPage
            user={user}
            onImageGenerated={handleImageGenerated}
            onOpenCredits={() => setIsCreditsModalOpen(true)}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'community' && (
          <CommunityPage
            user={user}
            onNavigate={handleNavigate}
            savedImages={savedImages}
          />
        )}

        {currentPage === 'profile' && (
          <ProfileDashboardPage
            user={user}
            savedImages={savedImages}
            onNavigate={handleNavigate}
            onOpenCredits={() => setIsCreditsModalOpen(true)}
          />
        )}

        {currentPage === 'prompts' && (
          <PromptMarketplacePage
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'admin' && (
          <AdminPanelPage
            user={user}
            onRefreshCredits={refreshCredits}
            onNavigate={handleNavigate}
            onLoginAsAdmin={handleLoginAsAdmin}
          />
        )}
      </main>

      {/* Modals */}
      <CreditModal
        isOpen={isCreditsModalOpen}
        onClose={() => setIsCreditsModalOpen(false)}
        user={user}
        msUntilReset={msUntilReset}
        onRefreshCredits={refreshCredits}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={(newUser) => {
          setUser(newUser);
          refreshCredits();
        }}
      />

      {/* Global Footer */}
      <footer className="border-t border-white/[0.06] bg-[#05070e] py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">PixelForge AI</span>
            <span>•</span>
            <span>Free Creative Platform powered by Google AI Studio</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <button onClick={() => handleNavigate('create')} className="hover:text-slate-300">
              AI Studio
            </button>
            <button onClick={() => handleNavigate('community')} className="hover:text-slate-300">
              Community Gallery
            </button>
            <button onClick={() => handleNavigate('prompts')} className="hover:text-slate-300">
              Prompt Formulas
            </button>
            <button onClick={() => setIsCreditsModalOpen(true)} className="hover:text-purple-400">
              Credit Policy (5/day)
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
