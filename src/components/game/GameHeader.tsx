import { useGameStore } from "../../stores/useGameStore";
import { useStatsStore } from "../../stores/useStatsStore";
import { useUIStore } from "../../stores/useUIStore";
import { formatTimer } from "../../utils/time";
import { MotionButton } from "../layout/MotionButton";

export const GameHeader = () => {
  const elapsedSeconds = useGameStore((s) => s.elapsedSeconds);
  const size = useGameStore((s) => s.size);
  const difficulty = useGameStore((s) => s.difficulty);
  const openPause = useUIStore((s) => s.openPause);
  const openExitConfirm = useUIStore((s) => s.openExitConfirm);
  const todayPlayCount = useStatsStore((s) => s.todayPlayCount);

  return (
    <>
      <div className="mb-3 grid grid-cols-3 gap-2">
        <MotionButton variant="secondary" onClick={openPause}>
          Pause
        </MotionButton>
        <div className="flex items-center justify-center rounded-xl bg-[var(--bg-elev)] text-lg font-bold shadow">
          {formatTimer(elapsedSeconds)}
        </div>
        <MotionButton variant="danger" onClick={openExitConfirm}>
          Exit
        </MotionButton>
      </div>
      <div className="mb-4 rounded-xl bg-[var(--bg-elev)] p-3 text-sm text-[var(--muted)] shadow">
        <div className="flex justify-between">
          <span>Grid: {size}x{size}</span>
          <span>Difficulty: {difficulty}</span>
          <span>Today: {todayPlayCount}</span>
        </div>
      </div>
    </>
  );
};
