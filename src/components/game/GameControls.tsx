import { useGameStore } from "../../stores/useGameStore";
import { useSaveStore } from "../../stores/useSaveStore";
import { useStatsStore } from "../../stores/useStatsStore";
import { useSudokuStore } from "../../stores/useSudokuStore";
import { useUIStore } from "../../stores/useUIStore";
import { MotionButton } from "../layout/MotionButton";

export const GameControls = () => {
  const notesMode = useSudokuStore((s) => s.notesMode);
  const autoNotes = useSudokuStore((s) => s.autoNotes);
  const toggleNotesMode = useSudokuStore((s) => s.toggleNotesMode);
  const toggleAutoNotes = useSudokuStore((s) => s.toggleAutoNotes);
  const autoFillNotes = useSudokuStore((s) => s.autoFillNotes);
  const hintCell = useSudokuStore((s) => s.hintCell);
  const eraseCell = useSudokuStore((s) => s.eraseCell);
  const undo = useSudokuStore((s) => s.undo);
  const redo = useSudokuStore((s) => s.redo);
  const addHint = useGameStore((s) => s.addHint);
  const registerHint = useStatsStore((s) => s.registerHint);
  const consumeHintPack = useSaveStore((s) => s.consumeHintPack);
  const openPopup = useUIStore((s) => s.openGenericPopup);

  return (
    <div className="mt-4 grid grid-cols-3 gap-2">
      <MotionButton variant={notesMode ? "primary" : "secondary"} onClick={toggleNotesMode}>
        Pencil
      </MotionButton>
      <MotionButton
        variant="secondary"
        onClick={() => {
          if (hintCell() || consumeHintPack()) {
            addHint();
            registerHint();
          } else {
            openPopup("No Hint", "Select an empty cell first or buy hint pack in settings.");
          }
        }}
      >
        Hint
      </MotionButton>
      <MotionButton variant="secondary" onClick={eraseCell}>
        Erase
      </MotionButton>
      <MotionButton variant="secondary" onClick={undo}>
        Undo
      </MotionButton>
      <MotionButton variant="secondary" onClick={redo}>
        Redo
      </MotionButton>
      <MotionButton
        variant={autoNotes ? "primary" : "secondary"}
        onClick={() => {
          toggleAutoNotes();
          autoFillNotes();
        }}
      >
        Auto Notes
      </MotionButton>
    </div>
  );
};
