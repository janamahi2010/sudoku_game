import { create } from "zustand";
import type { Difficulty, GridSize } from "../types/sudoku";

interface GameStore {
  active: boolean;
  paused: boolean;
  elapsedSeconds: number;
  hintsUsed: number;
  mistakes: number;
  size: GridSize;
  difficulty: Difficulty;
  startedAtUtc: string;
  timerId: number | null;
  startGameMeta: (size: GridSize, difficulty: Difficulty) => void;
  tick: () => void;
  startTimer: () => void;
  stopTimer: () => void;
  setPaused: (paused: boolean) => void;
  addHint: () => void;
  addMistake: () => void;
  resetSession: () => void;
  hydrateTimer: (elapsed: number, paused: boolean) => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  active: false,
  paused: false,
  elapsedSeconds: 0,
  hintsUsed: 0,
  mistakes: 0,
  size: 9,
  difficulty: "easy",
  startedAtUtc: new Date().toISOString(),
  timerId: null,
  startGameMeta: (size, difficulty) => {
    get().stopTimer();
    set({
      active: true,
      paused: false,
      elapsedSeconds: 0,
      hintsUsed: 0,
      mistakes: 0,
      size,
      difficulty,
      startedAtUtc: new Date().toISOString(),
    });
  },
  tick: () => set((s) => ({ elapsedSeconds: s.elapsedSeconds + 1 })),
  startTimer: () => {
    if (get().timerId || get().paused || !get().active) return;
    const id = window.setInterval(() => {
      if (!get().paused && get().active) get().tick();
    }, 1000);
    set({ timerId: id });
  },
  stopTimer: () => {
    const timerId = get().timerId;
    if (timerId) window.clearInterval(timerId);
    set({ timerId: null });
  },
  setPaused: (paused) => set({ paused }),
  addHint: () => set((s) => ({ hintsUsed: s.hintsUsed + 1 })),
  addMistake: () => set((s) => ({ mistakes: s.mistakes + 1 })),
  resetSession: () => {
    get().stopTimer();
    set({
      active: false,
      paused: false,
      elapsedSeconds: 0,
      hintsUsed: 0,
      mistakes: 0,
      timerId: null,
    });
  },
  hydrateTimer: (elapsed, paused) => {
    set({ elapsedSeconds: elapsed, paused, active: true });
  },
}));
