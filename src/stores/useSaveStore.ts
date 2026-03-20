import { create } from "zustand";
import { persist } from "zustand/middleware";
import { clearGameSnapshot, readGameSnapshot, saveGameSnapshot } from "../utils/indexedDb";
import { local } from "../utils/storage";
import type { SavedGameState } from "../types/sudoku";

interface SaveStore {
  hasSavedGame: boolean;
  lastSavedAt: number | null;
  savedGame: SavedGameState | null;
  iap: {
    removeAds: boolean;
    hintsPack: number;
    themesUnlocked: boolean;
  };
  hydrateSavedGame: () => Promise<void>;
  saveGame: (state: SavedGameState) => Promise<void>;
  clearSavedGame: () => Promise<void>;
  consumeHintPack: () => boolean;
  buyRemoveAds: () => void;
  buyHintPack: () => void;
  buyThemes: () => void;
}

export const useSaveStore = create<SaveStore>()(
  persist(
    (set, get) => ({
      hasSavedGame: false,
      lastSavedAt: null,
      savedGame: null,
      iap: {
        removeAds: false,
        hintsPack: 0,
        themesUnlocked: false,
      },
      hydrateSavedGame: async () => {
        const snapshot = await readGameSnapshot();
        if (!snapshot) return;
        set({ savedGame: snapshot, hasSavedGame: true });
      },
      saveGame: async (state) => {
        await saveGameSnapshot(state);
        local.set("sudoku-saved-game", state);
        set({ savedGame: state, hasSavedGame: true, lastSavedAt: Date.now() });
      },
      clearSavedGame: async () => {
        await clearGameSnapshot();
        local.remove("sudoku-saved-game");
        set({ savedGame: null, hasSavedGame: false, lastSavedAt: null });
      },
      consumeHintPack: () => {
        const hints = get().iap.hintsPack;
        if (hints <= 0) return false;
        set((state) => ({ iap: { ...state.iap, hintsPack: state.iap.hintsPack - 1 } }));
        return true;
      },
      buyRemoveAds: () => set((s) => ({ iap: { ...s.iap, removeAds: true } })),
      buyHintPack: () => set((s) => ({ iap: { ...s.iap, hintsPack: s.iap.hintsPack + 5 } })),
      buyThemes: () => set((s) => ({ iap: { ...s.iap, themesUnlocked: true } })),
    }),
    {
      name: "sudoku-save-v1",
      partialize: (state) => ({ iap: state.iap }),
    },
  ),
);
