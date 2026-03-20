import { BottomNav } from "../components/layout/BottomNav";
import { MotionButton } from "../components/layout/MotionButton";
import { ScreenShell } from "../components/layout/ScreenShell";
import { useAudioStore } from "../stores/useAudioStore";
import { useSaveStore } from "../stores/useSaveStore";
import { useStatsStore } from "../stores/useStatsStore";
import { useThemeStore } from "../stores/useThemeStore";

const SettingRow = ({ label, value }: { label: string; value: string | number }) => (
  <div className="flex justify-between rounded-lg bg-slate-100 p-2 text-sm">
    <span>{label}</span>
    <span className="font-semibold">{value}</span>
  </div>
);

export const ScreenSettings = () => {
  const audio = useAudioStore();
  const theme = useThemeStore();
  const stats = useStatsStore();
  const save = useSaveStore();

  return (
    <ScreenShell>
      <h2 className="py-4 text-2xl font-extrabold">Settings</h2>

      <section className="space-y-2 rounded-2xl bg-[var(--bg-elev)] p-3 shadow">
        <h3 className="font-semibold">Audio</h3>
        <div className="grid grid-cols-3 gap-2">
          <MotionButton variant={audio.soundEnabled ? "primary" : "secondary"} onClick={audio.toggleSound}>
            Sound
          </MotionButton>
          <MotionButton variant={audio.musicEnabled ? "primary" : "secondary"} onClick={audio.toggleMusic}>
            Music
          </MotionButton>
          <MotionButton variant={audio.vibrationEnabled ? "primary" : "secondary"} onClick={audio.toggleVibration}>
            Vibration
          </MotionButton>
        </div>
      </section>

      <section className="mt-3 space-y-2 rounded-2xl bg-[var(--bg-elev)] p-3 shadow">
        <h3 className="font-semibold">Theme & Accessibility</h3>
        <div className="grid grid-cols-2 gap-2">
          <MotionButton variant={theme.theme === "light" ? "primary" : "secondary"} onClick={() => theme.setTheme("light")}>
            Light
          </MotionButton>
          <MotionButton variant={theme.theme === "dark" ? "primary" : "secondary"} onClick={() => theme.setTheme("dark")}>
            Dark
          </MotionButton>
          <MotionButton
            variant={theme.theme === "high-contrast" ? "primary" : "secondary"}
            onClick={() => theme.setTheme("high-contrast")}
          >
            High Contrast
          </MotionButton>
          <MotionButton variant={theme.theme === "ocean" ? "primary" : "secondary"} onClick={() => theme.setTheme("ocean")}>
            Ocean
          </MotionButton>
        </div>
      </section>

      <section className="mt-3 space-y-2 rounded-2xl bg-[var(--bg-elev)] p-3 shadow">
        <h3 className="font-semibold">Stats</h3>
        <SettingRow label="Games Played" value={stats.gamesPlayed} />
        <SettingRow label="Wins" value={stats.wins} />
        <SettingRow label="Streak" value={stats.streak} />
        <SettingRow label="Best Easy" value={stats.bestTimes.easy ?? "-"} />
      </section>

      <section className="mt-3 space-y-2 rounded-2xl bg-[var(--bg-elev)] p-3 shadow">
        <h3 className="font-semibold">Saved Game</h3>
        <div className="flex items-center justify-between text-sm">
          <span>{save.hasSavedGame ? "Saved game available" : "No saved game"}</span>
          {save.hasSavedGame && (
            <MotionButton variant="danger" onClick={() => void save.clearSavedGame()}>
              Delete
            </MotionButton>
          )}
        </div>
      </section>

      <section className="mt-3 space-y-2 rounded-2xl bg-[var(--bg-elev)] p-3 shadow">
        <h3 className="font-semibold">IAP Simulation</h3>
        <div className="grid grid-cols-3 gap-2">
          <MotionButton variant={save.iap.removeAds ? "primary" : "secondary"} onClick={save.buyRemoveAds}>
            Remove Ads
          </MotionButton>
          <MotionButton variant="secondary" onClick={save.buyHintPack}>
            +5 Hints
          </MotionButton>
          <MotionButton variant={save.iap.themesUnlocked ? "primary" : "secondary"} onClick={save.buyThemes}>
            Themes
          </MotionButton>
        </div>
      </section>

      <section className="mt-3 rounded-2xl bg-[var(--bg-elev)] p-3 text-sm text-[var(--muted)] shadow">
        Feedback: sudoku-team@example.app • v1.0.0
      </section>
      <BottomNav />
    </ScreenShell>
  );
};
