import type { Layer, CheckInState, Mode } from '@/data/sessions';

export interface SessionPreset {
  id: string;
  title: string;
  tagline: string;
  mode: Mode;
  recommendedState: CheckInState;
  recommendedDurationMinutes: number;
  leadLayer: Layer;
  symbol: string;
  context: 'work' | 'sport' | 'evening' | 'travel' | 'recovery';
}

export const PRESETS: readonly SessionPreset[] = Object.freeze([
  {
    id: 'between-meetings',
    title: 'Between Meetings',
    tagline: 'Reset the prefrontal cortex before the next call.',
    mode: 'stolen',
    recommendedState: 'Scattered',
    recommendedDurationMinutes: 2,
    leadLayer: 'Mind',
    symbol: '◯',
    context: 'work',
  },
  {
    id: 'pre-pitch',
    title: 'Pre-Pitch Reset',
    tagline: 'Sharpen presence. Lower amplitude.',
    mode: 'stolen',
    recommendedState: 'Wired',
    recommendedDurationMinutes: 2,
    leadLayer: 'Energy',
    symbol: '∿',
    context: 'work',
  },
  {
    id: 'post-email-spiral',
    title: 'Post-Email Spiral',
    tagline: 'Pull out of the loop. Find the body.',
    mode: 'stolen',
    recommendedState: 'Scattered',
    recommendedDurationMinutes: 5,
    leadLayer: 'Body',
    symbol: '◯',
    context: 'work',
  },
  {
    id: 'locker-room',
    title: 'Locker Room',
    tagline: 'Pre-game activation. State precision.',
    mode: 'stolen',
    recommendedState: 'Wired',
    recommendedDurationMinutes: 5,
    leadLayer: 'Soul',
    symbol: '✦',
    context: 'sport',
  },
  {
    id: 'post-loss',
    title: 'Post-Loss Decompression',
    tagline: 'Release outcome. Restore the operator.',
    mode: 'winddown',
    recommendedState: 'Heavy',
    recommendedDurationMinutes: 10,
    leadLayer: 'Soul',
    symbol: '✦',
    context: 'sport',
  },
  {
    id: 'travel-reset',
    title: 'Travel Reset',
    tagline: 'Recalibrate the nervous system after transit.',
    mode: 'stolen',
    recommendedState: 'Depleted',
    recommendedDurationMinutes: 10,
    leadLayer: 'Body',
    symbol: '◯',
    context: 'travel',
  },
  {
    id: 'shutdown-protocol',
    title: 'Shutdown Protocol',
    tagline: 'Close the loop. Tomorrow does not exist yet.',
    mode: 'winddown',
    recommendedState: 'Heavy',
    recommendedDurationMinutes: 10,
    leadLayer: 'Soul',
    symbol: '✦',
    context: 'evening',
  },
  {
    id: 'sleep-onset',
    title: 'Sleep Onset',
    tagline: '6 BPM cadence. Signal shutdown.',
    mode: 'winddown',
    recommendedState: 'Wired',
    recommendedDurationMinutes: 20,
    leadLayer: 'Energy',
    symbol: '∿',
    context: 'evening',
  },
] as const);

export function getPreset(id: string | undefined): SessionPreset | undefined {
  if (!id) return undefined;
  return PRESETS.find((p) => p.id === id);
}

// Pull the latest hour of the day as a phase hint; returns a sub-list of
// presets that contextually fit the moment. Caller can choose to feature them.
export function presetsForHour(hour: number): readonly SessionPreset[] {
  if (hour >= 6 && hour < 12) {
    // morning — work contexts dominant
    return PRESETS.filter((p) => p.context === 'work' || p.context === 'sport');
  }
  if (hour >= 12 && hour < 18) {
    // afternoon — work + travel
    return PRESETS.filter((p) => p.context === 'work' || p.context === 'travel');
  }
  // evening / night — winddown contexts
  return PRESETS.filter(
    (p) => p.context === 'evening' || p.context === 'recovery' || p.context === 'sport'
  );
}
