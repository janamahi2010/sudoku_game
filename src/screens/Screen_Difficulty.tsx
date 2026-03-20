import { DIFFICULTY_LABELS, GRID_OPTIONS } from "../constants/game";
import { useGameFlow } from "../hooks/useGameFlow";
import { useUIStore } from "../stores/useUIStore";
import type { Difficulty, GridSize } from "../types/sudoku";
import { MotionButton } from "../components/layout/MotionButton";
import { ScreenShell } from "../components/layout/ScreenShell";
import { useState } from "react";

export const ScreenDifficulty = () => {
  const setScreen = useUIStore((s) => s.setScreen);
  const { startNewGame } = useGameFlow();
  const [size, setSize] = useState<GridSize>(9);
  const difficulties: Difficulty[] = ["easy", "medium", "hard", "expert", "intelligence"];

  return (
    <ScreenShell>
      <div className="flex items-center justify-between py-4">
        <h2 className="text-2xl font-extrabold">Choose Difficulty</h2>
        <MotionButton variant="ghost" onClick={() => setScreen("Screen_Home")}>
          Back
        </MotionButton>
      </div>
      <p className="mb-4 text-sm text-[var(--muted)]">Grid Size</p>
      <div className="mb-6 grid grid-cols-3 gap-2">
        {GRID_OPTIONS.map((option) => (
          <MotionButton
            key={option}
            variant={size === option ? "primary" : "secondary"}
            onClick={() => setSize(option)}
          >
            {option}x{option}
          </MotionButton>
        ))}
      </div>
      <div className="space-y-2">
        {difficulties.map((difficulty) => (
          <MotionButton
            className="w-full py-3 text-left text-base"
            key={difficulty}
            variant="secondary"
            onClick={() => startNewGame(size, difficulty)}
          >
            {DIFFICULTY_LABELS[difficulty]}
          </MotionButton>
        ))}
      </div>
    </ScreenShell>
  );
};
