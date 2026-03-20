import { AnimatePresence, motion } from "framer-motion";
import { useAutoSave } from "./hooks/useAutoSave";
import { useBootstrap } from "./hooks/useBootstrap";
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

const transition = { duration: 0.22 };

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
  const active = useUIStore((s) => s.activeScreen);

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={transition}
        >
          <ActiveScreen />
        </motion.div>
      </AnimatePresence>
      <ScreenPausePopup />
      <ScreenExitConfirmPopup />
      <ScreenPopupGeneric />
    </>
  );
}
