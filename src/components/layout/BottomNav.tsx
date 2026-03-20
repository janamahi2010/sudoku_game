import { motion } from "framer-motion";
import { useUIStore } from "../../stores/useUIStore";
import { MotionButton } from "./MotionButton";

export const BottomNav = () => {
  const active = useUIStore((s) => s.activeScreen);
  const setScreen = useUIStore((s) => s.setScreen);

  return (
    <motion.nav
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky bottom-3 mt-auto grid grid-cols-3 gap-2 rounded-2xl bg-[var(--bg-elev)] p-2 shadow-lg backdrop-blur"
    >
      <MotionButton
        variant={active === "Screen_Challenges" ? "primary" : "secondary"}
        onClick={() => setScreen("Screen_Challenges")}
      >
        Challenges
      </MotionButton>
      <MotionButton variant={active === "Screen_Home" ? "primary" : "secondary"} onClick={() => setScreen("Screen_Home")}>
        Home
      </MotionButton>
      <MotionButton
        variant={active === "Screen_Settings" ? "primary" : "secondary"}
        onClick={() => setScreen("Screen_Settings")}
      >
        Settings
      </MotionButton>
    </motion.nav>
  );
};
