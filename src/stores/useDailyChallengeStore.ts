import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ChallengeDay } from "../types/sudoku";
import { readChallenges, saveChallenges } from "../utils/indexedDb";
import { todayUtc } from "../utils/time";

interface DailyChallengeStore {
  days: Record<string, ChallengeDay>;
  hydrate: () => Promise<void>;
  markPartial: (dateUtc: string, elapsedSeconds: number) => void;
  markComplete: (dateUtc: string, elapsedSeconds: number) => void;
  getTodayState: () => ChallengeDay | undefined;
}

export const useDailyChallengeStore = create<DailyChallengeStore>()(
  persist(
    (set, get) => ({
      days: {},
      hydrate: async () => {
        const fromDb = await readChallenges();
        if (fromDb) set({ days: fromDb });
      },
      markPartial: (dateUtc, elapsedSeconds) =>
        set((state) => {
          const next = {
            ...state.days,
            [dateUtc]: { dateUtc, completed: false, partial: true, elapsedSeconds },
          };
          void saveChallenges(next);
          return { days: next };
        }),
      markComplete: (dateUtc, elapsedSeconds) =>
        set((state) => {
          const next = {
            ...state.days,
            [dateUtc]: { dateUtc, completed: true, partial: false, elapsedSeconds },
          };
          void saveChallenges(next);
          return { days: next };
        }),
      getTodayState: () => get().days[todayUtc()],
    }),
    { name: "sudoku-challenges-v1" },
  ),
);
