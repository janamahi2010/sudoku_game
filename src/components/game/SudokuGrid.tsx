import { memo, useMemo } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";
import { useSudokuStore } from "../../stores/useSudokuStore";

const CellButton = memo(function CellButton({
  row,
  col,
  value,
  fixed,
  notes,
  selected,
  highlighted,
  wrong,
  boxBorderRight,
  boxBorderBottom,
  borderTopWidth,
  borderLeftWidth,
}: {
  row: number;
  col: number;
  value: number;
  fixed: boolean;
  notes: number[];
  selected: boolean;
  highlighted: boolean;
  wrong: boolean;
  boxBorderRight: boolean;
  boxBorderBottom: boolean;
  borderTopWidth: number;
  borderLeftWidth: number;
}) {
  const selectCell = useSudokuStore((s) => s.selectCell);
  const size = useSudokuStore((s) => s.size);

  return (
    <motion.button
      whileTap={{ scale: 0.92 }}
      onClick={() => selectCell(row, col)}
      className={clsx(
        "relative block aspect-square w-full text-[var(--text)]",
        "appearance-none transition-colors duration-150",
        selected && "z-10 shadow-glow",
        highlighted && !selected && "bg-sky-100/60",
        fixed && "bg-slate-200/70 font-bold",
        wrong && "animate-pulse bg-red-200 text-red-700",
      )}
      style={{
        fontSize: `${Math.max(15, 28 - size)}px`,
        borderStyle: "solid",
        borderColor: "rgba(71, 85, 105, 0.65)",
        borderTopWidth,
        borderLeftWidth,
        borderRightWidth: boxBorderRight ? 3 : 1,
        borderBottomWidth: boxBorderBottom ? 3 : 1,
      }}
      aria-label={`row ${row + 1} col ${col + 1}`}
    >
      {value !== 0 ? (
        <motion.span
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={clsx(!fixed && "text-[var(--primary)]")}
        >
          {value}
        </motion.span>
      ) : (
        <div className="grid h-full grid-cols-3 text-[9px] leading-none text-slate-500">
          {Array.from({ length: 9 }, (_, i) => i + 1).map((n) => (
            <span key={n} className="flex items-center justify-center">
              {notes.includes(n) ? n : ""}
            </span>
          ))}
        </div>
      )}
    </motion.button>
  );
});

export const SudokuGrid = () => {
  const board = useSudokuStore((s) => s.board);
  const selected = useSudokuStore((s) => s.selected);
  const boxRows = useSudokuStore((s) => s.boxRows);
  const boxCols = useSudokuStore((s) => s.boxCols);
  const size = useSudokuStore((s) => s.size);
  const errorHighlight = useSudokuStore((s) => s.errorHighlight);

  const selectedBox = useMemo(() => {
    if (!selected) return null;
    return {
      boxR: Math.floor(selected.row / boxRows),
      boxC: Math.floor(selected.col / boxCols),
    };
  }, [boxCols, boxRows, selected]);

  return (
    <div
      className={clsx(
        "mx-auto grid w-full max-w-[23.5rem] overflow-hidden rounded-2xl border-2 border-slate-700/70 bg-white/70 shadow-xl",
        size === 3 && "max-w-[14rem]",
      )}
      style={{ gridTemplateColumns: `repeat(${size}, minmax(0,1fr))` }}
    >
      {board.flatMap((row, rowIndex) =>
        row.map((cell, colIndex) => {
          const isSelected = selected?.row === rowIndex && selected.col === colIndex;
          const sameRow = selected?.row === rowIndex;
          const sameCol = selected?.col === colIndex;
          const inBox =
            selectedBox &&
            Math.floor(rowIndex / boxRows) === selectedBox.boxR &&
            Math.floor(colIndex / boxCols) === selectedBox.boxC;
          return (
            <CellButton
              key={`${rowIndex}-${colIndex}`}
              row={rowIndex}
              col={colIndex}
              value={cell.value}
              fixed={cell.fixed}
              notes={cell.notes}
              selected={isSelected}
              highlighted={Boolean(sameRow || sameCol || inBox)}
              wrong={Boolean(errorHighlight && cell.wrongFlash)}
              boxBorderRight={(colIndex + 1) % boxCols === 0 && colIndex + 1 !== size}
              boxBorderBottom={(rowIndex + 1) % boxRows === 0 && rowIndex + 1 !== size}
              borderTopWidth={rowIndex === 0 ? 2 : 0}
              borderLeftWidth={colIndex === 0 ? 2 : 0}
            />
          );
        }),
      )}
    </div>
  );
};
