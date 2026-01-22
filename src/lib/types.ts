// DreamWeaver AI - Type Definitions

export type Emotion = 'joy' | 'anxiety' | 'fear' | 'calm' | 'sadness' | 'excitement' | 'confusion' | 'peace';

export type DreamTheme = 
  | 'flying' 
  | 'falling' 
  | 'chase' 
  | 'water' 
  | 'death' 
  | 'exam' 
  | 'naked' 
  | 'teeth' 
  | 'animals'
  | 'nature'
  | 'people'
  | 'places'
  | 'other';

export interface Dream {
  id: string;
  userId: string;
  date: Date;
  content: string;
  audioUrl?: string;
  emotions: Emotion[];
  themes: DreamTheme[];
  sleepQuality: number; // 1-10
  interpretation?: string;
  imageUrl?: string;
  createdAt: Date;
}

export interface SleepData {
  id: string;
  userId: string;
  date: Date;
  duration: number; // minutes
  quality: number; // 1-10
  deepSleep: number; // minutes
  lightSleep: number; // minutes
  remSleep: number; // minutes
  awakenings: number;
  heartRate?: number;
  source: 'manual' | 'smartwatch' | 'phone';
  createdAt: Date;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'screen-time' | 'meditation' | 'breathing' | 'routine' | 'exercise' | 'diet';
  duration: number; // days
  difficulty: 'easy' | 'medium' | 'hard';
  icon: string;
  completed: boolean;
  progress: number; // 0-100
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  hasSmartwatch: boolean;
  sleepGoal: number; // hours
  bedtime: string; // HH:mm
  wakeTime: string; // HH:mm
  onboardingCompleted: boolean;
  createdAt: Date;
}

export interface DailyInsight {
  date: Date;
  sleepScore: number; // 0-100
  emotionalState: Emotion[];
  recommendation: string;
  challenge?: Challenge;
}

export interface OnboardingStep {
  step: number;
  title: string;
  description: string;
  completed: boolean;
}
