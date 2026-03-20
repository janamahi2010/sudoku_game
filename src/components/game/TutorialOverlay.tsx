import { Popup } from "../layout/Popup";
import { MotionButton } from "../layout/MotionButton";
import { local } from "../../utils/storage";

interface Props {
  open: boolean;
  onClose: () => void;
}

export const TutorialOverlay = ({ open, onClose }: Props) => {
  return (
    <Popup open={open} title="Quick Tutorial" onClose={onClose}>
      <p className="mb-4 text-sm text-[var(--muted)]">
        Tap a cell, then tap a number. Use Pencil for notes, Hint for assistance, and Undo when needed.
      </p>
      <MotionButton
        className="w-full"
        onClick={() => {
          local.set("sudoku-tutorial-seen", true);
          onClose();
        }}
      >
        Start Playing
      </MotionButton>
    </Popup>
  );
};
