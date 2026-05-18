import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { CheckInState, Mode } from '@/data/sessions';
import type { GuideName } from '@/constants/design';

interface UserPreferences {
  selectedVoiceId: string | null;
  selectedGuideName: GuideName | null;
  streakCount: number;
  lastSessionDate: string | null; // YYYY-MM-DD local
  totalSessions: number;
  onboarded: boolean;
}

interface CurrentSession {
  mode: Mode | null;
  currentState: CheckInState | null;
  durationMinutes: number | null;
  stepIndex: number;
}

interface RiteActions {
  setGuide: (name: GuideName, voiceId: string) => void;
  completeOnboarding: () => void;
  startSession: (
    mode: Mode,
    state: CheckInState,
    durationMinutes: number
  ) => void;
  advanceStep: () => void;
  resetSession: () => void;
  completeSession: () => void;
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
};

const initialCurrent: CurrentSession = {
  mode: null,
  currentState: null,
  durationMinutes: null,
  stepIndex: 0,
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

      startSession: (mode, currentState, durationMinutes) =>
        set({
          current: { mode, currentState, durationMinutes, stepIndex: 0 },
        }),

      advanceStep: () =>
        set((s) => ({
          current: { ...s.current, stepIndex: s.current.stepIndex + 1 },
        })),

      resetSession: () => set({ current: initialCurrent }),

      completeSession: () => {
        const today = formatLocalDate(new Date());
        const { lastSessionDate, streakCount } = get();
        let nextStreak = streakCount;
        if (lastSessionDate === today) {
          // already counted today
        } else if (lastSessionDate && lastSessionDate === yesterdayOf(today)) {
          nextStreak = streakCount + 1;
        } else {
          nextStreak = 1;
        }
        set((s) => ({
          streakCount: nextStreak,
          lastSessionDate: today,
          totalSessions: s.totalSessions + 1,
        }));
      },
    }),
    {
      name: 'rite-store',
      version: 1,
      storage,
      partialize: (s) => ({
        selectedVoiceId: s.selectedVoiceId,
        selectedGuideName: s.selectedGuideName,
        streakCount: s.streakCount,
        lastSessionDate: s.lastSessionDate,
        totalSessions: s.totalSessions,
        onboarded: s.onboarded,
      }),
    }
  )
);
