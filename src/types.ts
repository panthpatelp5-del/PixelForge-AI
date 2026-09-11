export interface User {
  id: string;
  username: string;
  email: string;
  avatarUrl?: string;
  role: 'user' | 'creator' | 'admin';
  credits: number;
  maxCredits: number;
  plan?: string;
  lastResetDate?: string;
  createdAt?: string;
}

export interface GeneratedImage {
  id: string;
  userId: string;
  username?: string;
  userAvatar?: string;
  authorName?: string;
  prompt: string;
  enhancedPrompt?: string;
  style: string;
  aspectRatio: string;
  quality?: string;
  lighting?: string;
  color?: string;
  imageUrl: string;
  createdAt: string;
  likes: number;
  likedBy?: string[];
  commentsCount?: number;
  category?: 'general' | 'avatar' | 'logo' | 'wallpaper' | 'editor';
  engine?: string;
  isPublic?: boolean;
  isFavorite?: boolean;
  tags?: string[];
}

export interface CommunityComment {
  id: string;
  imageId: string;
  userId: string;
  username: string;
  userAvatar: string;
  text: string;
  createdAt: string;
}

export interface PromptItem {
  id: string;
  title: string;
  prompt: string;
  category: string;
  tags: string[];
  imageUrl?: string;
  previewUrl?: string;
  likes: number;
  copies?: number;
}

export type PageId =
  | 'landing'
  | 'create'
  | 'editor'
  | 'avatar'
  | 'logo'
  | 'wallpaper'
  | 'community'
  | 'profile'
  | 'prompts'
  | 'admin';

export interface GenerationConfig {
  prompt: string;
  style: string;
  aspectRatio: '1:1' | '3:4' | '16:9' | '9:16';
  quality: 'fast' | 'standard' | 'hd';
  lighting: string;
  color: string;
  category?: 'general' | 'avatar' | 'logo' | 'wallpaper' | 'editor';
  model?: 'flux' | 'turbo' | 'gemini';
}
