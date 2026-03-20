import { motion } from "framer-motion";
import { BottomNav } from "../components/layout/BottomNav";
import { MotionButton } from "../components/layout/MotionButton";
import { ScreenShell } from "../components/layout/ScreenShell";
import { useSaveStore } from "../stores/useSaveStore";
import { useUIStore } from "../stores/useUIStore";
import { useGameFlow } from "../hooks/useGameFlow";

export const ScreenHome = () => {
  const setScreen = useUIStore((s) => s.setScreen);
  const hasSavedGame = useSaveStore((s) => s.hasSavedGame);
  const { resumeSavedGame } = useGameFlow();

  return (
    <ScreenShell>
      <div className="flex flex-1 flex-col justify-center">
        <motion.h1
          initial={{ y: 18, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8 text-center text-6xl font-black tracking-tight text-[var(--text)]"
        >
          Sudoku
        </motion.h1>

        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.12 }}>
          <MotionButton className="w-full py-4 text-xl" onClick={() => setScreen("Screen_Difficulty")}>
            Play
          </MotionButton>
        </motion.div>

        {hasSavedGame && (
          <MotionButton className="mt-3 w-full" variant="secondary" onClick={resumeSavedGame}>
            Continue Game
          </MotionButton>
        )}
      </div>
      <BottomNav />
    </ScreenShell>
  );
};
