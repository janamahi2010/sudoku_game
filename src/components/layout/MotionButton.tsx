import { motion, type HTMLMotionProps } from "framer-motion";
import clsx from "clsx";
import type { ReactNode } from "react";

type Props = Omit<HTMLMotionProps<"button">, "children"> & {
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger" | "ghost";
};

export const MotionButton = ({ children, className, variant = "primary", ...rest }: Props) => {
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      whileHover={{ scale: 1.01 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className={clsx(
        "min-h-11 rounded-xl px-4 py-2 text-sm font-semibold",
        "transition-colors duration-200",
        variant === "primary" && "bg-[var(--primary)] text-white",
        variant === "secondary" && "bg-white/70 text-slate-900 backdrop-blur",
        variant === "danger" && "bg-[var(--danger)] text-white",
        variant === "ghost" && "bg-transparent text-[var(--text)] border border-white/20",
        className,
      )}
      {...rest}
    >
      {children}
    </motion.button>
  );
};
