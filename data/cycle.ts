import type { Mode } from '@/data/sessions';

export type CyclePhase = 'menstrual' | 'follicular' | 'ovulatory' | 'luteal';

export const PHASE_ORDER: readonly CyclePhase[] = [
  'menstrual',
  'follicular',
  'ovulatory',
  'luteal',
] as const;

export interface PhaseInfo {
  key: CyclePhase;
  label: string;
  short: string;
  accent: string; // hex
  description: string;
  recommendedMode: Mode;
  opener: string;
}

export const PHASES: Record<CyclePhase, PhaseInfo> = {
  menstrual: {
    key: 'menstrual',
    label: 'Menstrual',
    short: 'Menstrual phase',
    accent: '#B85C5C',
    description:
      'Many experience lower energy and higher recovery need. Track your own response.',
    recommendedMode: 'winddown',
    opener: 'Your body is shedding. We will move slowly. We will not push.',
  },
  follicular: {
    key: 'follicular',
    label: 'Follicular',
    short: 'Follicular phase',
    accent: '#C9A53C',
    description:
      'Rising estradiol is linked to working-memory and verbal-fluency gains. Often a good window for sharpening.',
    recommendedMode: 'stolen',
    opener: 'Estrogen is rising. Strength is returning. We will channel it.',
  },
  ovulatory: {
    key: 'ovulatory',
    label: 'Ovulatory',
    short: 'Ovulatory phase',
    accent: '#E8C870',
    description:
      'Peak estrogen for a brief window. Some report high output; evidence is mixed and individual.',
    recommendedMode: 'stolen',
    opener: 'You are at peak. We will sharpen, not strain.',
  },
  luteal: {
    key: 'luteal',
    label: 'Luteal',
    short: 'Luteal phase',
    accent: '#9A86C2',
    description:
      'Higher progesterone and perceived effort for many. Premenstrual fatigue is common.',
    recommendedMode: 'winddown',
    opener: 'The world feels heavier this week. We will honor that.',
  },
};

export interface CycleState {
  cycleDay: number; // 1-based
  phase: CyclePhase;
  daysUntilNextPeriod: number;
  nextPeriodDate: string; // YYYY-MM-DD
  cycleLengthDays: number;
  periodLengthDays: number;
}

function parseLocalDate(yyyyMmDd: string): Date {
  const [y, m, d] = yyyyMmDd.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function formatLocalDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const da = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${da}`;
}

function diffDays(a: Date, b: Date): number {
  const ms = 24 * 60 * 60 * 1000;
  const aMid = new Date(a.getFullYear(), a.getMonth(), a.getDate()).getTime();
  const bMid = new Date(b.getFullYear(), b.getMonth(), b.getDate()).getTime();
  return Math.round((aMid - bMid) / ms);
}

export function computeCycleState(args: {
  lastPeriodStart: string;
  cycleLengthDays: number;
  periodLengthDays: number;
  today?: Date;
}): CycleState | null {
  const today = args.today ?? new Date();
  const last = parseLocalDate(args.lastPeriodStart);
  let daysSince = diffDays(today, last);
  if (daysSince < 0) return null;

  // Roll forward if the user hasn't logged a recent period
  while (daysSince >= args.cycleLengthDays) {
    last.setDate(last.getDate() + args.cycleLengthDays);
    daysSince -= args.cycleLengthDays;
  }
  const cycleDay = daysSince + 1; // 1-based

  const phase = phaseForCycleDay(
    cycleDay,
    args.cycleLengthDays,
    args.periodLengthDays
  );

  const next = new Date(last);
  next.setDate(last.getDate() + args.cycleLengthDays);
  const daysUntil = diffDays(next, today);

  return {
    cycleDay,
    phase,
    daysUntilNextPeriod: daysUntil,
    nextPeriodDate: formatLocalDate(next),
    cycleLengthDays: args.cycleLengthDays,
    periodLengthDays: args.periodLengthDays,
  };
}

export function phaseForCycleDay(
  cycleDay: number,
  cycleLengthDays: number,
  periodLengthDays: number
): CyclePhase {
  // Scaled around a nominal 28-day cycle: menstrual 1..periodLen,
  // follicular ends ~day 13, ovulatory ~14-16, luteal until end.
  const periodEnd = periodLengthDays;
  const follicularEnd = Math.round(cycleLengthDays * (13 / 28));
  const ovulatoryEnd = Math.round(cycleLengthDays * (16 / 28));

  if (cycleDay <= periodEnd) return 'menstrual';
  if (cycleDay <= follicularEnd) return 'follicular';
  if (cycleDay <= ovulatoryEnd) return 'ovulatory';
  return 'luteal';
}

// Fertile window: typically days 11–17 in a 28-day cycle (5 days before
// + day of + 1 day after ovulation, ovulation ≈ cycleLen − 14).
export function isFertileDay(cycleDay: number, cycleLengthDays: number): boolean {
  const ovulation = cycleLengthDays - 14;
  return cycleDay >= ovulation - 5 && cycleDay <= ovulation + 1;
}

// PMS window: typically the last 5 days before period.
export function isPmsDay(cycleDay: number, cycleLengthDays: number): boolean {
  return cycleDay > cycleLengthDays - 5 && cycleDay <= cycleLengthDays;
}

// Project a cycle day for any date, including dates BEFORE the anchor period.
// Returns null for dates more than one cycle before the anchor.
export function projectCycleDay(
  daysFromAnchor: number,
  cycleLengthDays: number
): number | null {
  if (daysFromAnchor >= 0) {
    return (daysFromAnchor % cycleLengthDays) + 1;
  }
  // For dates before the anchor: reverse-project assuming consistent length.
  // Only project back up to 3 cycles (≈3 months) to avoid showing made-up data.
  if (daysFromAnchor < -cycleLengthDays * 3) return null;
  const rem = ((daysFromAnchor % cycleLengthDays) + cycleLengthDays) % cycleLengthDays;
  return rem + 1;
}

export const DEFAULT_CYCLE_LENGTH = 28;
export const DEFAULT_PERIOD_LENGTH = 5;
export const MIN_CYCLE_LENGTH = 21;
export const MAX_CYCLE_LENGTH = 40;
export const MIN_PERIOD_LENGTH = 2;
export const MAX_PERIOD_LENGTH = 10;
