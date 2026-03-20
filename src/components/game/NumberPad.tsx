import clsx from "clsx";
import { motion } from "framer-motion";
import { useGameStore } from "../../stores/useGameStore";
import { useSudokuStore } from "../../stores/useSudokuStore";

export const NumberPad = () => {
  const size = useSudokuStore((s) => s.size);
  const inputNumber = useSudokuStore((s) => s.inputNumber);
  const addMistake = useGameStore((s) => s.addMistake);
  const completed = useSudokuStore((s) => s.completed);

  const numbers = Array.from({ length: size }, (_, i) => i + 1);

  return (
    <div className={clsx("grid gap-2", size <= 6 ? "grid-cols-3" : "grid-cols-5")}>
      {numbers.map((n) => (
        <motion.button
          key={n}
          whileTap={{ scale: 0.93 }}
          onClick={() => {
            if (completed) return;
            const result = inputNumber(n);
            if (!result.valid) addMistake();
          }}
          className="h-12 rounded-xl bg-[var(--bg-elev)] text-lg font-bold text-[var(--text)] shadow"
        >
          {n}
        </motion.button>
      ))}
    </div>
  );
};
