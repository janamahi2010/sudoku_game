import confetti from "canvas-confetti";
import { useEffect } from "react";
import { MotionButton } from "../components/layout/MotionButton";
import { ScreenShell } from "../components/layout/ScreenShell";
import { useGameFlow } from "../hooks/useGameFlow";
import { useGameStore } from "../stores/useGameStore";
import { useSudokuStore } from "../stores/useSudokuStore";
import { useUIStore } from "../stores/useUIStore";
import { downloadSudokuScreenshot } from "../utils/screenshot";
import { formatTimer } from "../utils/time";

export const ScreenComplete = () => {
  const elapsed = useGameStore((s) => s.elapsedSeconds);
  const difficulty = useGameStore((s) => s.difficulty);
  const hintsUsed = useGameStore((s) => s.hintsUsed);
  const values = useSudokuStore((s) => s.getBoardValues());
  const setScreen = useUIStore((s) => s.setScreen);
  const { startNewGame } = useGameFlow();
  const size = useGameStore((s) => s.size);

  useEffect(() => {
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
  }, []);

  return (
    <ScreenShell>
      <div className="flex flex-1 flex-col justify-center rounded-3xl bg-[var(--bg-elev)] p-6 shadow-2xl">
        <h2 className="text-center text-4xl font-black">Puzzle Complete</h2>
        <p className="mt-1 text-center text-sm text-[var(--muted)]">Great focus. Keep the streak alive.</p>
        <div className="mt-6 space-y-2 rounded-2xl bg-sky-50 p-4 text-sm text-slate-700">
          <div className="flex justify-between">
            <span>Time</span>
            <span className="font-bold">{formatTimer(elapsed)}</span>
          </div>
          <div className="flex justify-between">
            <span>Difficulty</span>
            <span className="font-bold">{difficulty}</span>
          </div>
          <div className="flex justify-between">
            <span>Hints Used</span>
            <span className="font-bold">{hintsUsed}</span>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-2">
          <MotionButton variant="secondary" onClick={() => downloadSudokuScreenshot(values, difficulty, elapsed)}>
            Share
          </MotionButton>
          <MotionButton onClick={() => startNewGame(size, difficulty)}>Next</MotionButton>
          <MotionButton variant="ghost" onClick={() => setScreen("Screen_Home")}>
            Home
          </MotionButton>
        </div>
      </div>
    </ScreenShell>
  );
};
