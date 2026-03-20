import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AudioStore {
  soundEnabled: boolean;
  musicEnabled: boolean;
  vibrationEnabled: boolean;
  toggleSound: () => void;
  toggleMusic: () => void;
  toggleVibration: () => void;
  tap: () => void;
}

export const useAudioStore = create<AudioStore>()(
  persist(
    (set, get) => ({
      soundEnabled: true,
      musicEnabled: false,
      vibrationEnabled: true,
      toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),
      toggleMusic: () => set((s) => ({ musicEnabled: !s.musicEnabled })),
      toggleVibration: () => set((s) => ({ vibrationEnabled: !s.vibrationEnabled })),
      tap: () => {
        if (!get().soundEnabled) return;
        if ("vibrate" in navigator && get().vibrationEnabled) navigator.vibrate(10);
      },
    }),
    { name: "sudoku-audio-v1" },
  ),
);
