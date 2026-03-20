import { create } from "zustand";
import { persist } from "zustand/middleware";
import { readSettings, saveSettings } from "../utils/indexedDb";
import type { ThemeMode } from "../types/sudoku";
import { useAudioStore } from "./useAudioStore";
import { useSaveStore } from "./useSaveStore";

interface ThemeStore {
  theme: ThemeMode;
  colorBlindMode: boolean;
  setTheme: (theme: ThemeMode) => void;
  toggleColorBlind: () => void;
  hydrate: () => Promise<void>;
}

const applyTheme = (theme: ThemeMode): void => {
  if (theme === "ocean") {
    document.documentElement.setAttribute("data-theme", "light");
    document.documentElement.style.setProperty("--primary", "#0369a1");
    document.documentElement.style.setProperty("--accent", "#14b8a6");
    return;
  }
  document.documentElement.setAttribute("data-theme", theme);
  document.documentElement.style.removeProperty("--primary");
  document.documentElement.style.removeProperty("--accent");
};

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: "light",
      colorBlindMode: false,
      setTheme: (theme) => {
        applyTheme(theme);
        set({ theme });
        const settings = useSaveSettingsSnapshot();
        void saveSettings(settings);
      },
      toggleColorBlind: () => {
        set((state) => ({ colorBlindMode: !state.colorBlindMode }));
        const settings = useSaveSettingsSnapshot();
        void saveSettings(settings);
      },
      hydrate: async () => {
        const settings = await readSettings();
        if (!settings) {
          applyTheme(get().theme);
          return;
        }
        applyTheme(settings.theme);
        set({ theme: settings.theme });
      },
    }),
    { name: "sudoku-theme-v1" },
  ),
);

const useSaveSettingsSnapshot = () => {
  const theme = useThemeStore.getState().theme;
  const audio = useAudioStore.getState();
  const save = useSaveStore.getState();
  return {
    sound: audio.soundEnabled,
    music: audio.musicEnabled,
    vibration: audio.vibrationEnabled,
    theme,
    removeAds: save.iap.removeAds,
    hintPack: save.iap.hintsPack,
  };
};
