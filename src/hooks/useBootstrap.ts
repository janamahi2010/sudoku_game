import { useEffect } from "react";
import { useDailyChallengeStore } from "../stores/useDailyChallengeStore";
import { useSaveStore } from "../stores/useSaveStore";
import { useStatsStore } from "../stores/useStatsStore";
import { useThemeStore } from "../stores/useThemeStore";
import { useUIStore } from "../stores/useUIStore";

export const useBootstrap = (): void => {
  const setScreen = useUIStore((s) => s.setScreen);
  const hydrateSave = useSaveStore((s) => s.hydrateSavedGame);
  const hydrateStats = useStatsStore((s) => s.hydrate);
  const hydrateChallenges = useDailyChallengeStore((s) => s.hydrate);
  const hydrateTheme = useThemeStore((s) => s.hydrate);

  useEffect(() => {
    void Promise.all([hydrateSave(), hydrateStats(), hydrateChallenges(), hydrateTheme()]);
    const timer = window.setTimeout(() => setScreen("Screen_Home"), 1500);
    return () => window.clearTimeout(timer);
  }, [hydrateChallenges, hydrateSave, hydrateStats, hydrateTheme, setScreen]);
};
