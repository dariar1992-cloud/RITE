export type Layer = 'Body' | 'Energy' | 'Mind' | 'Soul';
export type Mode = 'stolen' | 'winddown';
export type CheckInState = 'Scattered' | 'Depleted' | 'Wired' | 'Heavy';

export interface Step {
  layer: Layer;
  symbol: string;
  instruction: string;
  science: string;
  wisdom: string;
}

export const STATES: readonly CheckInState[] = [
  'Scattered',
  'Depleted',
  'Wired',
  'Heavy',
] as const;

export const DURATIONS_STOLEN: readonly number[] = [2, 5, 10] as const;
export const DURATIONS_WINDDOWN: readonly number[] = [5, 10, 20] as const;

export const STOLEN_MOMENT_STEPS: readonly Step[] = Object.freeze([
  {
    layer: 'Body',
    symbol: '◯',
    instruction: 'Close your eyes. Feel your feet on the ground.',
    science: 'Activating proprioceptive awareness · Asana preparation',
    wisdom: 'The body is the first temple. Begin there. — Patanjali',
  },
  {
    layer: 'Energy',
    symbol: '∿',
    instruction: 'Inhale 4 counts. Hold 7. Exhale 8. Repeat 3 times.',
    science:
      '4-7-8 activates vagus nerve · shifts to parasympathetic · optimises HRV',
    wisdom:
      'Breath is the bridge between mind and body. — Pranayama Sutras',
  },
  {
    layer: 'Mind',
    symbol: '◈',
    instruction: 'Name one thing you are releasing right now. Just one.',
    science:
      'Prefrontal cortex decluttering · reduces cognitive load · Dharana focus',
    wisdom:
      'Detach from the fruit of action, not from action itself. — Bhagavad Gita',
  },
  {
    layer: 'Soul',
    symbol: '✦',
    instruction: 'Set one intention for the next 90 minutes. One word only.',
    science:
      'RAS activation · primes executive function · Samadhi alignment',
    wisdom:
      'When inspired by great purpose, your mind transcends limitations. — Patanjali',
  },
] as const);

export const WIND_DOWN_STEPS: readonly Step[] = Object.freeze([
  {
    layer: 'Body',
    symbol: '◯',
    instruction: 'Slow your breath to 6 per minute. One full minute. Just this.',
    science:
      '6 BPM maximises HRV · signals nervous system shutdown · Pratyahara begins',
    wisdom:
      'Rest is not the absence of action. It is the presence of self. — Tantra Shastra',
  },
  {
    layer: 'Energy',
    symbol: '∿',
    instruction:
      'Scan from crown to feet. Where is energy still held? Breathe into it.',
    science:
      'Body scan reduces cortisol up to 25% · Shakti redistribution · somatic release',
    wisdom:
      'Prana must be returned to stillness each night. — Tantric texts',
  },
  {
    layer: 'Mind',
    symbol: '◈',
    instruction:
      'Name three things you accomplished today. They need not be large.',
    science:
      'Positive consolidation activates reward circuits · anchors neuroplasticity · Niyama',
    wisdom:
      'The steady-minded one neither rejoices nor grieves. — Bhagavad Gita 2.56',
  },
  {
    layer: 'Soul',
    symbol: '✦',
    instruction:
      'Release tomorrow. It does not exist yet. You have done enough today.',
    science:
      'Temporal decoupling reduces anticipatory cortisol · Sthitaprajna state',
    wisdom: 'Complete each day and be done with it. — Karma Yoga',
  },
] as const);

export function getStepsForMode(mode: Mode): readonly Step[] {
  return mode === 'stolen' ? STOLEN_MOMENT_STEPS : WIND_DOWN_STEPS;
}

export function getDurationsForMode(mode: Mode): readonly number[] {
  return mode === 'stolen' ? DURATIONS_STOLEN : DURATIONS_WINDDOWN;
}

function stripAttribution(wisdom: string): string {
  const idx = wisdom.indexOf(' — ');
  return idx === -1 ? wisdom : wisdom.slice(0, idx);
}

export function getSessionScript(step: Step): string {
  const scienceSpoken = step.science.replace(/·/g, '.');
  const wisdomSpoken = stripAttribution(step.wisdom);
  return `${step.instruction} ... ${scienceSpoken} ... ${wisdomSpoken}`;
}

export const MODE_LABELS: Record<Mode, { title: string; tagline: string; framing: string }> = {
  stolen: {
    title: 'Stolen Moment',
    tagline: 'Mid-day nervous system reset',
    framing: 'System reset. Back at peak.',
  },
  winddown: {
    title: 'Wind Down Rite',
    tagline: 'End-of-day intentional shutdown',
    framing: 'Close the loop. Initiate shutdown protocol.',
  },
};
