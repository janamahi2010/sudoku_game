import { MotionButton } from "../components/layout/MotionButton";
import { Popup } from "../components/layout/Popup";
import { useGameStore } from "../stores/useGameStore";
import { useUIStore } from "../stores/useUIStore";

export const ScreenExitConfirmPopup = () => {
  const open = useUIStore((s) => s.exitConfirmOpen);
  const close = useUIStore((s) => s.closeExitConfirm);
  const setScreen = useUIStore((s) => s.setScreen);
  const resetSession = useGameStore((s) => s.resetSession);

  return (
    <Popup open={open} title="Exit Game?" onClose={close}>
      <p className="mb-4 text-sm text-[var(--muted)]">Current progress will be auto-saved.</p>
      <div className="grid grid-cols-2 gap-2">
        <MotionButton variant="secondary" onClick={close}>
          Cancel
        </MotionButton>
        <MotionButton
          variant="danger"
          onClick={() => {
            close();
            resetSession();
            setScreen("Screen_Home");
          }}
        >
          Exit
        </MotionButton>
      </div>
    </Popup>
  );
};
