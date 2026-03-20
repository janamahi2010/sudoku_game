import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AdStore {
  gamesSinceInterstitial: number;
  lastInterstitialAt: number;
  rewardReady: boolean;
  consumeGame: () => void;
  shouldShowInterstitial: () => boolean;
  showInterstitial: () => void;
  showReward: () => Promise<boolean>;
}

export const useAdStore = create<AdStore>()(
  persist(
    (set, get) => ({
      gamesSinceInterstitial: 0,
      lastInterstitialAt: 0,
      rewardReady: true,
      consumeGame: () => set((s) => ({ gamesSinceInterstitial: s.gamesSinceInterstitial + 1 })),
      shouldShowInterstitial: () => {
        const state = get();
        const byGames = state.gamesSinceInterstitial >= 2;
        const byTime = Date.now() - state.lastInterstitialAt >= 5 * 60 * 1000;
        return byGames || byTime;
      },
      showInterstitial: () => set({ gamesSinceInterstitial: 0, lastInterstitialAt: Date.now() }),
      showReward: async () => {
        if (!get().rewardReady) return false;
        set({ rewardReady: false });
        await new Promise((resolve) => setTimeout(resolve, 1300));
        set({ rewardReady: true });
        return true;
      },
    }),
    { name: "sudoku-ads-v1" },
  ),
);
