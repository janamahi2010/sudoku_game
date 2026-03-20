import type { Difficulty, GameStats, GridSize, Puzzle } from "../types/sudoku";

const randomInt = (max: number): number => Math.floor(Math.random() * max);

const shuffle = <T,>(items: T[]): T[] => {
  const clone = [...items];
  for (let i = clone.length - 1; i > 0; i -= 1) {
    const j = randomInt(i + 1);
    [clone[i], clone[j]] = [clone[j], clone[i]];
  }
  return clone;
};

export const getBoxShape = (size: GridSize): { boxRows: number; boxCols: number } => {
  if (size === 9) return { boxRows: 3, boxCols: 3 };
  if (size === 6) return { boxRows: 2, boxCols: 3 };
  return { boxRows: 1, boxCols: 3 };
};

const sequence = (size: number): number[] => Array.from({ length: size }, (_, i) => i + 1);

const cloneGrid = (grid: number[][]): number[][] => grid.map((row) => [...row]);

const patternValue = (row: number, col: number, size: number, boxRows: number, boxCols: number): number => {
  return ((boxCols * (row % boxRows) + Math.floor(row / boxRows) + col) % size) + 1;
};

export const isValidPlacement = (
  grid: number[][],
  row: number,
  col: number,
  value: number,
  size: number,
  boxRows: number,
  boxCols: number,
): boolean => {
  for (let i = 0; i < size; i += 1) {
    if (i !== col && grid[row][i] === value) return false;
    if (i !== row && grid[i][col] === value) return false;
  }

  const startRow = Math.floor(row / boxRows) * boxRows;
  const startCol = Math.floor(col / boxCols) * boxCols;
  for (let r = startRow; r < startRow + boxRows; r += 1) {
    for (let c = startCol; c < startCol + boxCols; c += 1) {
      if ((r !== row || c !== col) && grid[r][c] === value) return false;
    }
  }
  return true;
};

const findNextEmpty = (grid: number[][]): [number, number] | null => {
  for (let r = 0; r < grid.length; r += 1) {
    for (let c = 0; c < grid.length; c += 1) {
      if (grid[r][c] === 0) return [r, c];
    }
  }
  return null;
};

export const solveSudoku = (
  grid: number[][],
  size: number,
  boxRows: number,
  boxCols: number,
): number[][] | null => {
  const board = cloneGrid(grid);

  const run = (): boolean => {
    const empty = findNextEmpty(board);
    if (!empty) return true;
    const [row, col] = empty;
    for (const value of shuffle(sequence(size))) {
      if (!isValidPlacement(board, row, col, value, size, boxRows, boxCols)) continue;
      board[row][col] = value;
      if (run()) return true;
      board[row][col] = 0;
    }
    return false;
  };

  return run() ? board : null;
};

export const countSolutions = (
  grid: number[][],
  size: number,
  boxRows: number,
  boxCols: number,
  stopAt = 2,
): number => {
  const board = cloneGrid(grid);
  let count = 0;

  const run = (): void => {
    if (count >= stopAt) return;
    const empty = findNextEmpty(board);
    if (!empty) {
      count += 1;
      return;
    }
    const [row, col] = empty;
    for (let value = 1; value <= size; value += 1) {
      if (!isValidPlacement(board, row, col, value, size, boxRows, boxCols)) continue;
      board[row][col] = value;
      run();
      board[row][col] = 0;
    }
  };

  run();
  return count;
};

export const getCandidates = (
  grid: number[][],
  row: number,
  col: number,
  size: number,
  boxRows: number,
  boxCols: number,
): number[] => {
  if (grid[row][col] !== 0) return [];
  const out: number[] = [];
  for (let value = 1; value <= size; value += 1) {
    if (isValidPlacement(grid, row, col, value, size, boxRows, boxCols)) out.push(value);
  }
  return out;
};

const createSolvedGrid = (size: GridSize): number[][] => {
  const { boxRows, boxCols } = getBoxShape(size);
  const rows = shuffle(
    sequence(size).map((v) => {
      const n = v - 1;
      return boxRows * (n % Math.ceil(size / boxRows)) + Math.floor(n / Math.ceil(size / boxRows));
    }),
  );
  const cols = shuffle(
    sequence(size).map((v) => {
      const n = v - 1;
      return boxCols * (n % Math.ceil(size / boxCols)) + Math.floor(n / Math.ceil(size / boxCols));
    }),
  );
  const symbols = shuffle(sequence(size));

  return rows.map((r) => cols.map((c) => symbols[patternValue(r, c, size, boxRows, boxCols) - 1]));
};

const holesByDifficulty = (size: GridSize, difficulty: Exclude<Difficulty, "intelligence">): number => {
  const total = size * size;
  const ratioMap = {
    easy: 0.4,
    medium: 0.52,
    hard: 0.6,
    expert: 0.67,
  } as const;
  return Math.floor(total * ratioMap[difficulty]);
};

export const resolveIntelligenceDifficulty = (stats: GameStats): Exclude<Difficulty, "intelligence"> => {
  const played = Math.max(stats.gamesPlayed, 1);
  const winRate = stats.wins / played;
  const avgMistakes = stats.totalMistakes / played;
  if (winRate > 0.8 && avgMistakes < 1) return "expert";
  if (winRate > 0.65 && avgMistakes < 1.5) return "hard";
  if (winRate > 0.45) return "medium";
  return "easy";
};

const carvePuzzle = (
  solved: number[][],
  size: GridSize,
  difficulty: Exclude<Difficulty, "intelligence">,
): number[][] => {
  const { boxRows, boxCols } = getBoxShape(size);
  const puzzle = cloneGrid(solved);
  const targetHoles = holesByDifficulty(size, difficulty);
  const cells = shuffle(sequence(size * size).map((i) => i - 1));
  let holes = 0;

  for (const cell of cells) {
    if (holes >= targetHoles) break;
    const row = Math.floor(cell / size);
    const col = cell % size;
    const backup = puzzle[row][col];
    puzzle[row][col] = 0;
    const solutions = countSolutions(puzzle, size, boxRows, boxCols, 2);
    if (solutions !== 1) {
      puzzle[row][col] = backup;
      continue;
    }
    holes += 1;
  }
  return puzzle;
};

export const generatePuzzle = (size: GridSize, difficulty: Difficulty, stats: GameStats): Puzzle => {
  const normalized = difficulty === "intelligence" ? resolveIntelligenceDifficulty(stats) : difficulty;
  const { boxRows, boxCols } = getBoxShape(size);
  const solution = createSolvedGrid(size);
  const puzzle = carvePuzzle(solution, size, normalized);
  const stamp = Date.now().toString(36);
  return {
    id: `${size}-${normalized}-${stamp}`,
    size,
    boxRows,
    boxCols,
    difficulty,
    puzzle,
    solution,
  };
};

export const isSolved = (board: number[][], solution: number[][]): boolean => {
  for (let r = 0; r < board.length; r += 1) {
    for (let c = 0; c < board.length; c += 1) {
      if (board[r][c] !== solution[r][c]) return false;
    }
  }
  return true;
};
