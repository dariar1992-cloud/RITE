import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { CheckInState, Mode } from '@/data/sessions';
import type { GuideName } from '@/constants/design';

export interface SessionRecord {
  id: string;
  mode: Mode;
  state: CheckInState;
  durationMinutes: number;
  chargeBefore: number | null;
  chargeAfter: number | null;
  delta: number | null;
  completedAt: string; // ISO
}

interface UserPreferences {
  selectedVoiceId: string | null;
  selectedGuideName: GuideName | null;
  streakCount: number;
  lastSessionDate: string | null; // YYYY-MM-DD local
  totalSessions: number;
  onboarded: boolean;
  history: SessionRecord[]; // capped at 30, newest first
  lastChargeDelta: number | null;
}

interface CurrentSession {
  mode: Mode | null;
  currentState: CheckInState | null;
  durationMinutes: number | null;
  stepIndex: number;
  chargeBefore: number | null;
  chargeAfter: number | null;
}

interface RiteActions {
  setGuide: (name: GuideName, voiceId: string) => void;
  completeOnboarding: () => void;
  startSession: (
    mode: Mode,
    state: CheckInState,
    durationMinutes: number,
    chargeBefore: number | null
  ) => void;
  advanceStep: () => void;
  resetSession: () => void;
  setChargeAfter: (n: number) => void;
  completeSession: () => SessionRecord | null;
}

type RiteStore = UserPreferences & {
  current: CurrentSession;
} & RiteActions;

const initialPreferences: UserPreferences = {
  selectedVoiceId: null,
  selectedGuideName: null,
  streakCount: 0,
  lastSessionDate: null,
  totalSessions: 0,
  onboarded: false,
  history: [],
  lastChargeDelta: null,
};

const initialCurrent: CurrentSession = {
  mode: null,
  currentState: null,
  durationMinutes: null,
  stepIndex: 0,
  chargeBefore: null,
  chargeAfter: null,
};

function formatLocalDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function yesterdayOf(today: string): string {
  const [y, m, d] = today.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() - 1);
  return formatLocalDate(dt);
}

const webStorage = {
  getItem: (name: string) => {
    try {
      return globalThis.localStorage?.getItem(name) ?? null;
    } catch {
      return null;
    }
  },
  setItem: (name: string, value: string) => {
    try {
      globalThis.localStorage?.setItem(name, value);
    } catch {}
  },
  removeItem: (name: string) => {
    try {
      globalThis.localStorage?.removeItem(name);
    } catch {}
  },
};

const storage = createJSONStorage(() =>
  Platform.OS === 'web' ? webStorage : AsyncStorage
);

export const useRiteStore = create<RiteStore>()(
  persist(
    (set, get) => ({
      ...initialPreferences,
      current: initialCurrent,

      setGuide: (name, voiceId) =>
        set({ selectedGuideName: name, selectedVoiceId: voiceId }),

      completeOnboarding: () => set({ onboarded: true }),

      startSession: (mode, currentState, durationMinutes, chargeBefore) =>
        set({
          current: {
            mode,
            currentState,
            durationMinutes,
            stepIndex: 0,
            chargeBefore,
            chargeAfter: null,
          },
        }),

      advanceStep: () =>
        set((s) => ({
          current: { ...s.current, stepIndex: s.current.stepIndex + 1 },
        })),

      resetSession: () => set({ current: initialCurrent }),

      setChargeAfter: (n) =>
        set((s) => ({ current: { ...s.current, chargeAfter: n } })),

      completeSession: () => {
        const today = formatLocalDate(new Date());
        const state = get();
        const { lastSessionDate, streakCount, current, history } = state;
        let nextStreak = streakCount;
        if (lastSessionDate === today) {
          // already counted today
        } else if (lastSessionDate && lastSessionDate === yesterdayOf(today)) {
          nextStreak = streakCount + 1;
        } else {
          nextStreak = 1;
        }
        if (!current.mode || !current.currentState || !current.durationMinutes) {
          return null;
        }
        const delta =
          current.chargeBefore != null && current.chargeAfter != null
            ? current.chargeAfter - current.chargeBefore
            : null;
        const record: SessionRecord = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          mode: current.mode,
          state: current.currentState,
          durationMinutes: current.durationMinutes,
          chargeBefore: current.chargeBefore,
          chargeAfter: current.chargeAfter,
          delta,
          completedAt: new Date().toISOString(),
        };
        set((s) => ({
          streakCount: nextStreak,
          lastSessionDate: today,
          totalSessions: s.totalSessions + 1,
          history: [record, ...s.history].slice(0, 30),
          lastChargeDelta: delta ?? s.lastChargeDelta,
        }));
        return record;
      },
    }),
    {
      name: 'rite-store',
      version: 2,
      storage,
      partialize: (s) => ({
        selectedVoiceId: s.selectedVoiceId,
        selectedGuideName: s.selectedGuideName,
        streakCount: s.streakCount,
        lastSessionDate: s.lastSessionDate,
        totalSessions: s.totalSessions,
        onboarded: s.onboarded,
        history: s.history,
        lastChargeDelta: s.lastChargeDelta,
      }),
      migrate: (persistedState: unknown, version) => {
        if (version < 2 && persistedState && typeof persistedState === 'object') {
          return {
            ...(persistedState as object),
            history: [],
            lastChargeDelta: null,
          };
        }
        return persistedState as RiteStore;
      },
    }
  )
);

// ---------- selectors / derived helpers ----------

export function computeReadiness(args: {
  streakCount: number;
  lastSessionDate: string | null;
  lastChargeDelta: number | null;
  now?: Date;
}): number {
  const now = args.now ?? new Date();
  const today = formatLocalDate(now);
  let base = 50;

  if (args.lastSessionDate === today) base += 25;
  else if (args.lastSessionDate === yesterdayOf(today)) base += 15;
  else base -= 5;

  if (args.streakCount >= 7) base += 15;
  else if (args.streakCount >= 3) base += 8;
  else if (args.streakCount >= 1) base += 3;

  if (args.lastChargeDelta != null) {
    base += Math.max(-10, Math.min(10, args.lastChargeDelta));
  }

  return Math.max(10, Math.min(99, Math.round(base)));
}

export function readinessLabel(score: number): string {
  if (score >= 85) return 'Primed';
  if (score >= 70) return 'Ready';
  if (score >= 55) return 'Steady';
  if (score >= 40) return 'Depleted';
  return 'Reset needed';
}
