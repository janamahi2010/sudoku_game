import { BottomNav } from "../components/layout/BottomNav";
import { ScreenShell } from "../components/layout/ScreenShell";
import { useDailyChallengeStore } from "../stores/useDailyChallengeStore";
import { todayUtc } from "../utils/time";

const buildMonth = (): string[] => {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth();
  const days = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  return Array.from({ length: days }, (_, i) => new Date(Date.UTC(year, month, i + 1)).toISOString().slice(0, 10));
};

export const ScreenChallenges = () => {
  const days = useDailyChallengeStore((s) => s.days);
  const monthDays = buildMonth();
  const today = todayUtc();

  return (
    <ScreenShell>
      <h2 className="py-4 text-2xl font-extrabold">Daily Challenges</h2>
      <div className="grid grid-cols-7 gap-2 rounded-2xl bg-[var(--bg-elev)] p-3 shadow">
        {monthDays.map((date) => {
          const entry = days[date];
          const stateClass = entry?.completed
            ? "bg-green-500 text-white"
            : entry?.partial
              ? "bg-gradient-to-r from-amber-400 to-slate-200 text-slate-900"
              : "bg-slate-100 text-slate-700";
          return (
            <div
              key={date}
              className={`aspect-square rounded-lg p-1 text-center text-xs ${stateClass} ${date === today ? "ring-2 ring-sky-400" : ""}`}
              title={date}
            >
              {Number(date.slice(-2))}
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-sm text-[var(--muted)]">UTC-based challenge tracking. Green = complete, mixed = partial.</p>
      <BottomNav />
    </ScreenShell>
  );
};
