export type GridSize = 3 | 6 | 9;
export type Difficulty = "easy" | "medium" | "hard" | "expert" | "intelligence";
export type ScreenName =
  | "Screen_Splash"
  | "Screen_Home"
  | "Screen_Difficulty"
  | "Screen_Game"
  | "Screen_PausePopup"
  | "Screen_ExitConfirmPopup"
  | "Screen_Complete"
  | "Screen_Challenges"
  | "Screen_Settings"
  | "Screen_Popup_Generic";

export type ThemeMode = "light" | "dark" | "high-contrast" | "ocean";

export interface Cell {
  value: number;
  fixed: boolean;
  notes: number[];
  wrongFlash?: boolean;
}

export interface Puzzle {
  id: string;
  size: GridSize;
  boxRows: number;
  boxCols: number;
  difficulty: Difficulty;
  puzzle: number[][];
  solution: number[][];
}

export interface Move {
  row: number;
  col: number;
  prevValue: number;
  nextValue: number;
  prevNotes: number[];
  nextNotes: number[];
  fromHint?: boolean;
}

export interface SavedGameState {
  puzzleId: string;
  size: GridSize;
  difficulty: Difficulty;
  board: Cell[][];
  solution: number[][];
  elapsedSeconds: number;
  hintsUsed: number;
  mistakes: number;
  paused: boolean;
  startedAtUtc: string;
}

export interface GameStats {
  gamesPlayed: number;
  wins: number;
  bestTimes: Partial<Record<Difficulty, number>>;
  streak: number;
  todayPlayCount: number;
  totalHintsUsed: number;
  totalMistakes: number;
}

export interface ChallengeDay {
  dateUtc: string;
  completed: boolean;
  partial: boolean;
  elapsedSeconds: number;
}
