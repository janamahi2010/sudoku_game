import { create } from "zustand";
import { persist } from "zustand/middleware";
import { readStats, saveStats } from "../utils/indexedDb";
import { local } from "../utils/storage";
import { todayUtc } from "../utils/time";
import type { Difficulty, GameStats } from "../types/sudoku";

const defaultStats: GameStats = {
  gamesPlayed: 0,
  wins: 0,
  bestTimes: {},
  streak: 0,
  todayPlayCount: 0,
  totalHintsUsed: 0,
  totalMistakes: 0,
};

interface StatsStore extends GameStats {
  hydrate: () => Promise<void>;
  registerGameStart: () => void;
  registerWin: (difficulty: Difficulty, seconds: number) => void;
  registerHint: () => void;
  registerMistake: () => void;
}

const LOCAL_KEY = "sudoku-stats-v1";

export const useStatsStore = create<StatsStore>()(
  persist(
    (set) => ({
      ...defaultStats,
      hydrate: async () => {
        const fromDb = await readStats();
        if (!fromDb) return;
        set({ ...fromDb });
      },
      registerGameStart: () => {
        const currentDay = todayUtc();
        const savedDay = local.get("sudoku-last-play-day", "");
        const sameDay = savedDay === currentDay;
        local.set("sudoku-last-play-day", currentDay);
        set((state) => {
          const next = {
            gamesPlayed: state.gamesPlayed + 1,
            todayPlayCount: sameDay ? state.todayPlayCount + 1 : 1,
          };
          void saveStats({ ...state, ...next });
          return next;
        });
      },
      registerWin: (difficulty, seconds) =>
        set((state) => {
          const currentBest = state.bestTimes[difficulty];
          const nextBest = currentBest ? Math.min(currentBest, seconds) : seconds;
          const next = {
            wins: state.wins + 1,
            streak: state.streak + 1,
            bestTimes: { ...state.bestTimes, [difficulty]: nextBest },
          };
          void saveStats({ ...state, ...next });
          return next;
        }),
      registerHint: () =>
        set((state) => {
          const next = { totalHintsUsed: state.totalHintsUsed + 1 };
          void saveStats({ ...state, ...next });
          return next;
        }),
      registerMistake: () =>
        set((state) => {
          const next = { totalMistakes: state.totalMistakes + 1, streak: 0 };
          void saveStats({ ...state, ...next });
          return next;
        }),
    }),
    {
      name: LOCAL_KEY,
      partialize: (state) => ({
        gamesPlayed: state.gamesPlayed,
        wins: state.wins,
        bestTimes: state.bestTimes,
        streak: state.streak,
        todayPlayCount: state.todayPlayCount,
        totalHintsUsed: state.totalHintsUsed,
        totalMistakes: state.totalMistakes,
      }),
    },
  ),
);

export const selectStatsForDifficulty = (): Difficulty => {
  const state = useStatsStore.getState();
  const played = Math.max(state.gamesPlayed, 1);
  const winRate = state.wins / played;
  if (winRate > 0.8 && state.totalMistakes / played < 1) return "expert";
  if (winRate > 0.6) return "hard";
  if (winRate > 0.4) return "medium";
  return "easy";
};
