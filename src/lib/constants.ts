// DreamWeaver AI - Constants

export const EMOTIONS = {
  joy: { label: 'Alegria', color: '#FFD700', icon: '😊' },
  anxiety: { label: 'Ansiedade', color: '#FF6B6B', icon: '😰' },
  fear: { label: 'Medo', color: '#8B4789', icon: '😨' },
  calm: { label: 'Calma', color: '#4ECDC4', icon: '😌' },
  sadness: { label: 'Tristeza', color: '#5B7C99', icon: '😢' },
  excitement: { label: 'Empolgação', color: '#FF9F1C', icon: '🤩' },
  confusion: { label: 'Confusão', color: '#A8DADC', icon: '😕' },
  peace: { label: 'Paz', color: '#81B29A', icon: '🕊️' },
} as const;

export const DREAM_THEMES = {
  flying: { label: 'Voar', icon: '🦅' },
  falling: { label: 'Queda', icon: '⬇️' },
  chase: { label: 'Perseguição', icon: '🏃' },
  water: { label: 'Água', icon: '🌊' },
  death: { label: 'Morte', icon: '💀' },
  exam: { label: 'Prova/Teste', icon: '📝' },
  naked: { label: 'Nu em público', icon: '🙈' },
  teeth: { label: 'Dentes caindo', icon: '🦷' },
  animals: { label: 'Animais', icon: '🐾' },
  nature: { label: 'Natureza', icon: '🌿' },
  people: { label: 'Pessoas', icon: '👥' },
  places: { label: 'Lugares', icon: '🏛️' },
  other: { label: 'Outro', icon: '✨' },
} as const;

export const CHALLENGE_TYPES = {
  'screen-time': {
    label: 'Sem Telas',
    description: 'Evite telas 1h antes de dormir',
    icon: '📱',
    color: '#FF6B6B',
  },
  meditation: {
    label: 'Meditação',
    description: 'Pratique meditação guiada',
    icon: '🧘',
    color: '#4ECDC4',
  },
  breathing: {
    label: 'Respiração',
    description: 'Exercícios de respiração profunda',
    icon: '🌬️',
    color: '#81B29A',
  },
  routine: {
    label: 'Rotina',
    description: 'Mantenha horários regulares',
    icon: '⏰',
    color: '#FFD700',
  },
  exercise: {
    label: 'Exercício',
    description: 'Atividade física regular',
    icon: '💪',
    color: '#FF9F1C',
  },
  diet: {
    label: 'Alimentação',
    description: 'Evite cafeína à noite',
    icon: '🥗',
    color: '#A8DADC',
  },
} as const;

export const SLEEP_QUALITY_LABELS = {
  1: 'Péssima',
  2: 'Muito Ruim',
  3: 'Ruim',
  4: 'Abaixo da Média',
  5: 'Média',
  6: 'Acima da Média',
  7: 'Boa',
  8: 'Muito Boa',
  9: 'Excelente',
  10: 'Perfeita',
} as const;

export const ONBOARDING_STEPS = [
  {
    step: 1,
    title: 'Bem-vindo ao DreamWeaver AI',
    description: 'Transforme seus sonhos em dados práticos para dormir melhor',
  },
  {
    step: 2,
    title: 'Configure seu Perfil',
    description: 'Conte-nos sobre seus hábitos de sono',
  },
  {
    step: 3,
    title: 'Pronto para Começar!',
    description: 'Vamos registrar seu primeiro sonho',
  },
] as const;

export const APP_CONFIG = {
  name: 'DreamWeaver AI',
  tagline: 'Use seus sonhos para dormir melhor',
  version: '1.0.0',
  colors: {
    primary: '#6366F1', // Indigo
    secondary: '#8B5CF6', // Purple
    accent: '#EC4899', // Pink
    background: '#0F172A', // Dark blue
    surface: '#1E293B',
    text: '#F1F5F9',
  },
} as const;
