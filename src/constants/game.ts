import type { Difficulty, GridSize } from "../types/sudoku";

export const MAX_MISTAKES = 3;
export const DEFAULT_SIZE: GridSize = 9;

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
  expert: "Expert",
  intelligence: "Intelligence",
};

export const GRID_OPTIONS: GridSize[] = [3, 6, 9];
