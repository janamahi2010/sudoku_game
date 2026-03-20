import { create } from "zustand";
import type { Cell, Move, Puzzle } from "../types/sudoku";
import { getCandidates, isSolved } from "../utils/sudoku";

interface SudokuStore {
  puzzleId: string;
  size: number;
  boxRows: number;
  boxCols: number;
  board: Cell[][];
  solution: number[][];
  selected: { row: number; col: number } | null;
  notesMode: boolean;
  autoNotes: boolean;
  errorHighlight: boolean;
  undoStack: Move[];
  redoStack: Move[];
  completed: boolean;
  initializePuzzle: (puzzle: Puzzle) => void;
  hydrateBoard: (payload: { puzzleId: string; board: Cell[][]; solution: number[][]; size: number }) => void;
  selectCell: (row: number, col: number) => void;
  inputNumber: (value: number) => { valid: boolean; completed: boolean };
  eraseCell: () => void;
  hintCell: () => boolean;
  toggleNotesMode: () => void;
  toggleAutoNotes: () => void;
  toggleErrorHighlight: () => void;
  autoFillNotes: () => void;
  undo: () => void;
  redo: () => void;
  getBoardValues: () => number[][];
}

const cloneBoard = (board: Cell[][]): Cell[][] => board.map((row) => row.map((c) => ({ ...c, notes: [...c.notes] })));

export const useSudokuStore = create<SudokuStore>((set, get) => ({
  puzzleId: "",
  size: 9,
  boxRows: 3,
  boxCols: 3,
  board: [],
  solution: [],
  selected: null,
  notesMode: false,
  autoNotes: false,
  errorHighlight: true,
  undoStack: [],
  redoStack: [],
  completed: false,
  initializePuzzle: (puzzle) => {
    const board: Cell[][] = puzzle.puzzle.map((row) =>
      row.map((value) => ({
        value,
        fixed: value !== 0,
        notes: [],
      })),
    );
    set({
      puzzleId: puzzle.id,
      size: puzzle.size,
      boxRows: puzzle.boxRows,
      boxCols: puzzle.boxCols,
      board,
      solution: puzzle.solution,
      selected: null,
      undoStack: [],
      redoStack: [],
      completed: false,
    });
  },
  hydrateBoard: ({ puzzleId, board, solution, size }) =>
    set({
      puzzleId,
      board,
      solution,
      size,
      boxRows: size === 9 ? 3 : size === 6 ? 2 : 1,
      boxCols: size === 9 ? 3 : 3,
      completed: false,
    }),
  selectCell: (row, col) => set({ selected: { row, col } }),
  inputNumber: (value) => {
    const state = get();
    if (!state.selected) return { valid: true, completed: false };
    const { row, col } = state.selected;
    const current = state.board[row][col];
    if (current.fixed) return { valid: true, completed: false };

    const nextBoard = cloneBoard(state.board);
    const nextCell = nextBoard[row][col];
    if (state.notesMode) {
      const has = nextCell.notes.includes(value);
      nextCell.notes = has ? nextCell.notes.filter((n) => n !== value) : [...nextCell.notes, value].sort((a, b) => a - b);
      set({ board: nextBoard });
      return { valid: true, completed: false };
    }

    const prevValue = nextCell.value;
    const prevNotes = [...nextCell.notes];
    nextCell.value = value;
    nextCell.notes = [];
    nextCell.wrongFlash = false;
    const valid = state.solution[row][col] === value;
    if (!valid) nextCell.wrongFlash = true;

    // Auto-clear same notes on placement.
    for (let r = 0; r < state.size; r += 1) {
      for (let c = 0; c < state.size; c += 1) {
        if (r === row && c === col) continue;
        nextBoard[r][c].notes = nextBoard[r][c].notes.filter((n) => n !== value);
      }
    }

    const nextMove: Move = {
      row,
      col,
      prevValue,
      nextValue: value,
      prevNotes,
      nextNotes: [],
    };
    const values = nextBoard.map((r) => r.map((c) => c.value));
    const completed = isSolved(values, state.solution);
    set({
      board: nextBoard,
      undoStack: [...state.undoStack, nextMove],
      redoStack: [],
      completed,
    });
    return { valid, completed };
  },
  eraseCell: () => {
    const state = get();
    if (!state.selected) return;
    const { row, col } = state.selected;
    const cell = state.board[row][col];
    if (cell.fixed || (cell.value === 0 && cell.notes.length === 0)) return;
    const next = cloneBoard(state.board);
    const prevValue = next[row][col].value;
    const prevNotes = [...next[row][col].notes];
    next[row][col].value = 0;
    next[row][col].notes = [];
    set({
      board: next,
      undoStack: [
        ...state.undoStack,
        { row, col, prevValue, nextValue: 0, prevNotes, nextNotes: [] },
      ],
      redoStack: [],
    });
  },
  hintCell: () => {
    const state = get();
    if (!state.selected) return false;
    const { row, col } = state.selected;
    const cell = state.board[row][col];
    if (cell.fixed || cell.value !== 0) return false;
    const next = cloneBoard(state.board);
    const solvedValue = state.solution[row][col];
    next[row][col].value = solvedValue;
    next[row][col].notes = [];
    const values = next.map((r) => r.map((c) => c.value));
    const completed = isSolved(values, state.solution);
    set({
      board: next,
      completed,
      undoStack: [
        ...state.undoStack,
        { row, col, prevValue: 0, nextValue: solvedValue, prevNotes: cell.notes, nextNotes: [], fromHint: true },
      ],
      redoStack: [],
    });
    return true;
  },
  toggleNotesMode: () => set((s) => ({ notesMode: !s.notesMode })),
  toggleAutoNotes: () => set((s) => ({ autoNotes: !s.autoNotes })),
  toggleErrorHighlight: () => set((s) => ({ errorHighlight: !s.errorHighlight })),
  autoFillNotes: () => {
    const state = get();
    const values = state.board.map((row) => row.map((cell) => cell.value));
    const next = cloneBoard(state.board);
    for (let r = 0; r < state.size; r += 1) {
      for (let c = 0; c < state.size; c += 1) {
        if (next[r][c].fixed || next[r][c].value !== 0) continue;
        next[r][c].notes = getCandidates(values, r, c, state.size, state.boxRows, state.boxCols);
      }
    }
    set({ board: next });
  },
  undo: () => {
    const state = get();
    const move = state.undoStack[state.undoStack.length - 1];
    if (!move) return;
    const next = cloneBoard(state.board);
    next[move.row][move.col].value = move.prevValue;
    next[move.row][move.col].notes = move.prevNotes;
    set({
      board: next,
      undoStack: state.undoStack.slice(0, -1),
      redoStack: [...state.redoStack, move],
      completed: false,
    });
  },
  redo: () => {
    const state = get();
    const move = state.redoStack[state.redoStack.length - 1];
    if (!move) return;
    const next = cloneBoard(state.board);
    next[move.row][move.col].value = move.nextValue;
    next[move.row][move.col].notes = move.nextNotes;
    const values = next.map((r) => r.map((c) => c.value));
    set({
      board: next,
      redoStack: state.redoStack.slice(0, -1),
      undoStack: [...state.undoStack, move],
      completed: isSolved(values, state.solution),
    });
  },
  getBoardValues: () => get().board.map((row) => row.map((cell) => cell.value)),
}));
