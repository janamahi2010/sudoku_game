import { useMemo } from "react";
import { useAdStore } from "../stores/useAdStore";
import { useGameStore } from "../stores/useGameStore";
import { useSaveStore } from "../stores/useSaveStore";
import { useStatsStore } from "../stores/useStatsStore";
import { useSudokuStore } from "../stores/useSudokuStore";
import { useUIStore } from "../stores/useUIStore";
import type { Difficulty, GridSize } from "../types/sudoku";
import { generatePuzzle } from "../utils/sudoku";

export const useGameFlow = () => {
  const setScreen = useUIStore((s) => s.setScreen);
  const startMeta = useGameStore((s) => s.startGameMeta);
  const startTimer = useGameStore((s) => s.startTimer);
  const hydrateTimer = useGameStore((s) => s.hydrateTimer);
  const stats = useStatsStore();
  const initPuzzle = useSudokuStore((s) => s.initializePuzzle);
  const hydrateBoard = useSudokuStore((s) => s.hydrateBoard);
  const savedGame = useSaveStore((s) => s.savedGame);
  const consumeGame = useAdStore((s) => s.consumeGame);
  const showInterstitial = useAdStore((s) => s.showInterstitial);
  const shouldShowInterstitial = useAdStore((s) => s.shouldShowInterstitial);
  const removeAds = useSaveStore((s) => s.iap.removeAds);

  return useMemo(
    () => ({
      startNewGame: (size: GridSize, difficulty: Difficulty) => {
        const puzzle = generatePuzzle(size, difficulty, stats);
        startMeta(size, difficulty);
        initPuzzle(puzzle);
        stats.registerGameStart();
        consumeGame();
        if (!removeAds && shouldShowInterstitial()) showInterstitial();
        setScreen("Screen_Game");
        startTimer();
      },
      resumeSavedGame: () => {
        if (!savedGame) return;
        startMeta(savedGame.size, savedGame.difficulty);
        hydrateBoard({
          puzzleId: savedGame.puzzleId,
          board: savedGame.board,
          solution: savedGame.solution,
          size: savedGame.size,
        });
        hydrateTimer(savedGame.elapsedSeconds, savedGame.paused);
        setScreen("Screen_Game");
        startTimer();
      },
    }),
    [
      consumeGame,
      hydrateBoard,
      hydrateTimer,
      initPuzzle,
      removeAds,
      savedGame,
      setScreen,
      shouldShowInterstitial,
      showInterstitial,
      startMeta,
      startTimer,
      stats,
    ],
  );
};
