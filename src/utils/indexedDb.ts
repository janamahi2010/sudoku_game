import { openDB } from "idb";
import type { ChallengeDay, GameStats, SavedGameState, ThemeMode } from "../types/sudoku";

interface SudokuDB {
  snapshots: {
    key: string;
    value: {
      id: string;
      type: "game" | "settings" | "stats" | "challenges";
      payload: unknown;
      updatedAt: number;
    };
    indexes: {
      "by-type": string;
    };
  };
}

const DB_NAME = "sudoku-premium-db";
const DB_VERSION = 1;

const dbPromise = openDB<SudokuDB>(DB_NAME, DB_VERSION, {
  upgrade(db) {
    const store = db.createObjectStore("snapshots", { keyPath: "id" });
    store.createIndex("by-type", "type");
  },
});

const saveSnapshot = async (id: string, type: SudokuDB["snapshots"]["value"]["type"], payload: unknown): Promise<void> => {
  const db = await dbPromise;
  await db.put("snapshots", { id, type, payload, updatedAt: Date.now() });
};

export const saveGameSnapshot = async (game: SavedGameState): Promise<void> => {
  await saveSnapshot("active-game", "game", game);
};

export const readGameSnapshot = async (): Promise<SavedGameState | null> => {
  const db = await dbPromise;
  const data = await db.get("snapshots", "active-game");
  return (data?.payload as SavedGameState | undefined) ?? null;
};

export const clearGameSnapshot = async (): Promise<void> => {
  const db = await dbPromise;
  await db.delete("snapshots", "active-game");
};

export interface SettingsPayload {
  sound: boolean;
  music: boolean;
  vibration: boolean;
  theme: ThemeMode;
  removeAds: boolean;
  hintPack: number;
}

export const saveSettings = async (payload: SettingsPayload): Promise<void> => {
  await saveSnapshot("settings", "settings", payload);
};

export const readSettings = async (): Promise<SettingsPayload | null> => {
  const db = await dbPromise;
  const data = await db.get("snapshots", "settings");
  return (data?.payload as SettingsPayload | undefined) ?? null;
};

export const saveStats = async (stats: GameStats): Promise<void> => {
  await saveSnapshot("stats", "stats", stats);
};

export const readStats = async (): Promise<GameStats | null> => {
  const db = await dbPromise;
  const data = await db.get("snapshots", "stats");
  return (data?.payload as GameStats | undefined) ?? null;
};

export const saveChallenges = async (days: Record<string, ChallengeDay>): Promise<void> => {
  await saveSnapshot("challenges", "challenges", days);
};

export const readChallenges = async (): Promise<Record<string, ChallengeDay> | null> => {
  const db = await dbPromise;
  const data = await db.get("snapshots", "challenges");
  return (data?.payload as Record<string, ChallengeDay> | undefined) ?? null;
};
