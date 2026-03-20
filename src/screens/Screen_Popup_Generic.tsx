import { MotionButton } from "../components/layout/MotionButton";
import { Popup } from "../components/layout/Popup";
import { useUIStore } from "../stores/useUIStore";

export const ScreenPopupGeneric = () => {
  const popup = useUIStore((s) => s.popup);
  const close = useUIStore((s) => s.closeGenericPopup);
  return (
    <Popup open={popup.genericOpen} title={popup.genericTitle} onClose={close}>
      <p className="mb-4 text-sm text-[var(--muted)]">{popup.genericMessage}</p>
      <MotionButton className="w-full" onClick={close}>
        OK
      </MotionButton>
    </Popup>
  );
};
