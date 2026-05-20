export const COLORS = Object.freeze({
  obsidian: '#080810',
  deepSurface: '#0d0d1a',
  surface: '#1a1a24',
  gold: '#C9A53C',
  goldDim: '#7A6828',
  goldGlow: '#E8C870',
  cream: '#EDE8D8',
  creamDim: '#A09880',
  indigoAccent: 'rgba(100,70,200,0.08)',
} as const);

export const TYPOGRAPHY = Object.freeze({
  family: {
    serif: 'CormorantGaramond_300Light',
    serifItalic: 'CormorantGaramond_300Light_Italic',
    sansLight: 'DMSans_300Light',
    sans: 'DMSans_400Regular',
    sansMedium: 'DMSans_500Medium',
  },
  size: {
    display: 48,
    title: 28,
    body: 16,
    instruction: 22,
    wisdom: 14,
    science: 10,
    label: 10,
    brand: 18,
  },
  letterSpacing: {
    caps: 0.3,
    capsLg: 0.5,
    science: 0.15,
  },
} as const);

export const SPACING = Object.freeze({
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
} as const);

export const ANIMATION = Object.freeze({
  breathRingDurationMs: 8000,
  fadeDurationMs: 500,
  waveformIntervalMs: 110,
  voiceAutoplayDelayMs: 750,
  pressScale: 0.98,
} as const);

export type GuideName = 'Sage' | 'Arjun' | 'Akasha';

export interface Guide {
  id: string;
  name: GuideName;
  voiceId: string;
  personality: string;
  archetype: string;
}

export const GUIDES: readonly Guide[] = Object.freeze([
  {
    id: 'sage',
    name: 'Sage',
    voiceId: 'EXAVITQu4vr4xnSDxMaL',
    archetype: 'Feminine',
    personality: 'Warm, grounding, wise. Like a woman who has always known.',
  },
  {
    id: 'arjun',
    name: 'Arjun',
    voiceId: 'onwK4e9ZLuTAKqWW03F9',
    archetype: 'Masculine',
    personality: 'Deep, steady, authoritative. Like a coach who has no ego.',
  },
  {
    id: 'akasha',
    name: 'Akasha',
    voiceId: 'SAz9YHcvj6GT2YYXdXww',
    archetype: 'Neutral',
    personality: 'Soft, ethereal, genderless. Like the space between thoughts.',
  },
] as const);

export const WELCOME_SCRIPT =
  'Welcome. I am your guide. Take one breath, and let us begin.';

export type DayPhase = 'dawn' | 'morning' | 'midday' | 'afternoon' | 'evening' | 'night';

export function getDayPhase(date = new Date()): DayPhase {
  const h = date.getHours();
  if (h < 5) return 'night';
  if (h < 8) return 'dawn';
  if (h < 11) return 'morning';
  if (h < 14) return 'midday';
  if (h < 18) return 'afternoon';
  if (h < 22) return 'evening';
  return 'night';
}

export const PHASE_ACCENT: Record<DayPhase, string> = {
  dawn: '#E8C870',
  morning: '#E8C870',
  midday: '#C9A53C',
  afternoon: '#C9A53C',
  evening: '#9A86C2',
  night: '#6E5BA8',
};

export const PHASE_LABEL: Record<DayPhase, string> = {
  dawn: 'Dawn',
  morning: 'Morning',
  midday: 'Midday',
  afternoon: 'Afternoon',
  evening: 'Evening',
  night: 'Night',
};

export function recommendedModeForPhase(phase: DayPhase): 'stolen' | 'winddown' {
  return phase === 'evening' || phase === 'night' ? 'winddown' : 'stolen';
}
