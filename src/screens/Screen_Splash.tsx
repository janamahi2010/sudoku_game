import { motion } from "framer-motion";
import { ScreenShell } from "../components/layout/ScreenShell";

export const ScreenSplash = () => {
  return (
    <ScreenShell>
      <div className="flex flex-1 items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45 }}
          className="rounded-3xl bg-[var(--bg-elev)] px-10 py-12 shadow-2xl"
        >
          <h1 className="text-center text-5xl font-black tracking-tight text-[var(--text)]">Sudoku</h1>
          <p className="mt-3 text-center text-sm text-[var(--muted)]">Premium Brain Workout</p>
        </motion.div>
      </div>
    </ScreenShell>
  );
};
