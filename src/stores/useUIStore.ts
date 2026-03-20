import { create } from "zustand";
import type { ScreenName } from "../types/sudoku";

interface PopupState {
  genericOpen: boolean;
  genericTitle: string;
  genericMessage: string;
}

interface UIStore {
  activeScreen: ScreenName;
  previousScreen: ScreenName;
  pauseOpen: boolean;
  exitConfirmOpen: boolean;
  popup: PopupState;
  setScreen: (screen: ScreenName) => void;
  openPause: () => void;
  closePause: () => void;
  openExitConfirm: () => void;
  closeExitConfirm: () => void;
  openGenericPopup: (title: string, message: string) => void;
  closeGenericPopup: () => void;
}

export const useUIStore = create<UIStore>((set, get) => ({
  activeScreen: "Screen_Splash",
  previousScreen: "Screen_Home",
  pauseOpen: false,
  exitConfirmOpen: false,
  popup: {
    genericOpen: false,
    genericTitle: "",
    genericMessage: "",
  },
  setScreen: (screen) => {
    const prev = get().activeScreen;
    set({ activeScreen: screen, previousScreen: prev });
  },
  openPause: () => set({ pauseOpen: true }),
  closePause: () => set({ pauseOpen: false }),
  openExitConfirm: () => set({ exitConfirmOpen: true }),
  closeExitConfirm: () => set({ exitConfirmOpen: false }),
  openGenericPopup: (title, message) =>
    set({ popup: { genericOpen: true, genericTitle: title, genericMessage: message } }),
  closeGenericPopup: () =>
    set({
      popup: { genericOpen: false, genericTitle: "", genericMessage: "" },
    }),
}));
