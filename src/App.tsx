import { AnimatePresence, motion } from "framer-motion";
import { useAutoSave } from "./hooks/useAutoSave";
import { useBootstrap } from "./hooks/useBootstrap";
import { useNativeBackButton } from "./hooks/useNativeBackButton";
import { useUIStore } from "./stores/useUIStore";
import { ScreenChallenges } from "./screens/Screen_Challenges";
import { ScreenComplete } from "./screens/Screen_Complete";
import { ScreenDifficulty } from "./screens/Screen_Difficulty";
import { ScreenExitConfirmPopup } from "./screens/Screen_ExitConfirmPopup";
import { ScreenGame } from "./screens/Screen_Game";
import { ScreenHome } from "./screens/Screen_Home";
import { ScreenPausePopup } from "./screens/Screen_PausePopup";
import { ScreenPopupGeneric } from "./screens/Screen_Popup_Generic";
import { ScreenSettings } from "./screens/Screen_Settings";
import { ScreenSplash } from "./screens/Screen_Splash";

const transition = { duration: 0.16, ease: "easeOut" as const };

function ActiveScreen() {
  const active = useUIStore((s) => s.activeScreen);
  switch (active) {
    case "Screen_Splash":
      return <ScreenSplash />;
    case "Screen_Home":
      return <ScreenHome />;
    case "Screen_Difficulty":
      return <ScreenDifficulty />;
    case "Screen_Game":
      return <ScreenGame />;
    case "Screen_Complete":
      return <ScreenComplete />;
    case "Screen_Challenges":
      return <ScreenChallenges />;
    case "Screen_Settings":
      return <ScreenSettings />;
    default:
      return <ScreenHome />;
  }
}

export default function App() {
  useBootstrap();
  useAutoSave();
  useNativeBackButton();
  const active = useUIStore((s) => s.activeScreen);

  return (
    <>
      <main className="mx-auto min-h-screen w-full max-w-lg overflow-x-hidden">
      <AnimatePresence initial={false} mode="sync">
        <motion.div
          key={active}
          initial={{ opacity: 0, scale: 0.995 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.005 }}
          transition={transition}
          className="will-change-[opacity,transform]"
        >
          <ActiveScreen />
        </motion.div>
      </AnimatePresence>
      </main>
      <ScreenPausePopup />
      <ScreenExitConfirmPopup />
      <ScreenPopupGeneric />
    </>
  );
}
