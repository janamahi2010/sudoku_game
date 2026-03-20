import { useEffect } from "react";
import { useGameStore } from "../stores/useGameStore";
import { useSaveStore } from "../stores/useSaveStore";
import { useSudokuStore } from "../stores/useSudokuStore";
import type { SavedGameState } from "../types/sudoku";

const buildSnapshot = (): SavedGameState | null => {
  const game = useGameStore.getState();
  const sudoku = useSudokuStore.getState();
  if (!game.active || !sudoku.puzzleId) return null;
  return {
    puzzleId: sudoku.puzzleId,
    size: game.size,
    difficulty: game.difficulty,
    board: sudoku.board,
    solution: sudoku.solution,
    elapsedSeconds: game.elapsedSeconds,
    hintsUsed: game.hintsUsed,
    mistakes: game.mistakes,
    paused: game.paused,
    startedAtUtc: game.startedAtUtc,
  };
};

export const useAutoSave = (): void => {
  const active = useGameStore((s) => s.active);
  const paused = useGameStore((s) => s.paused);
  const elapsed = useGameStore((s) => s.elapsedSeconds);
  const board = useSudokuStore((s) => s.board);
  const save = useSaveStore((s) => s.saveGame);

  useEffect(() => {
    const snapshot = buildSnapshot();
    if (!snapshot) return;
    void save(snapshot);
  }, [paused, elapsed, board, save]);

  useEffect(() => {
    const onVisibilityOrClose = () => {
      if (!active) return;
      const snapshot = buildSnapshot();
      if (!snapshot) return;
      void save(snapshot);
    };
    window.addEventListener("beforeunload", onVisibilityOrClose);
    document.addEventListener("visibilitychange", onVisibilityOrClose);
    return () => {
      window.removeEventListener("beforeunload", onVisibilityOrClose);
      document.removeEventListener("visibilitychange", onVisibilityOrClose);
    };
  }, [active, save]);
};
