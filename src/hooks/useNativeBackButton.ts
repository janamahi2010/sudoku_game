import { useEffect, useRef } from "react";
import { Capacitor } from "@capacitor/core";
import { App as CapApp } from "@capacitor/app";
import { StatusBar, Style } from "@capacitor/status-bar";
import { useGameStore } from "../stores/useGameStore";
import { useUIStore } from "../stores/useUIStore";

export const useNativeBackButton = (): void => {
  const exitTapRef = useRef(0);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    void StatusBar.setOverlaysWebView({ overlay: false });
    void StatusBar.setStyle({ style: Style.Dark });
    void StatusBar.setBackgroundColor({ color: "#f8fafc" });

    const removePromise = CapApp.addListener("backButton", () => {
      const ui = useUIStore.getState();
      const game = useGameStore.getState();

      if (ui.popup.genericOpen) {
        ui.closeGenericPopup();
        return;
      }
      if (ui.exitConfirmOpen) {
        ui.closeExitConfirm();
        return;
      }
      if (ui.pauseOpen) {
        ui.closePause();
        game.setPaused(false);
        return;
      }

      if (ui.activeScreen === "Screen_Game") {
        ui.openExitConfirm();
        return;
      }

      if (ui.activeScreen === "Screen_Difficulty" || ui.activeScreen === "Screen_Challenges" || ui.activeScreen === "Screen_Settings" || ui.activeScreen === "Screen_Complete") {
        ui.setScreen("Screen_Home");
        return;
      }

      if (ui.activeScreen === "Screen_Splash") {
        ui.setScreen("Screen_Home");
        return;
      }

      if (ui.activeScreen === "Screen_Home") {
        const now = Date.now();
        if (now - exitTapRef.current < 1200) {
          CapApp.exitApp();
          return;
        }
        exitTapRef.current = now;
        ui.openGenericPopup("Exit App", "Press back again to close.");
      }
    });

    return () => {
      void removePromise.then((handle) => handle.remove());
    };
  }, []);
};
