import { Popup } from "../components/layout/Popup";
import { MotionButton } from "../components/layout/MotionButton";
import { useGameStore } from "../stores/useGameStore";
import { useSaveStore } from "../stores/useSaveStore";
import { useSudokuStore } from "../stores/useSudokuStore";
import { useUIStore } from "../stores/useUIStore";

export const ScreenPausePopup = () => {
  const open = useUIStore((s) => s.pauseOpen);
  const close = useUIStore((s) => s.closePause);
  const setScreen = useUIStore((s) => s.setScreen);
  const setPaused = useGameStore((s) => s.setPaused);
  const resetSession = useGameStore((s) => s.resetSession);
  const game = useGameStore();
  const sudoku = useSudokuStore();
  const saveGame = useSaveStore((s) => s.saveGame);

  return (
    <Popup open={open} title="Paused" onClose={close}>
      <div className="space-y-2">
        <MotionButton
          className="w-full"
          onClick={() => {
            setPaused(false);
            close();
          }}
        >
          Resume
        </MotionButton>
        <MotionButton
          className="w-full"
          variant="secondary"
          onClick={() => {
            void saveGame({
              puzzleId: sudoku.puzzleId,
              size: game.size,
              difficulty: game.difficulty,
              board: sudoku.board,
              solution: sudoku.solution,
              elapsedSeconds: game.elapsedSeconds,
              hintsUsed: game.hintsUsed,
              mistakes: game.mistakes,
              paused: true,
              startedAtUtc: game.startedAtUtc,
            });
            close();
            resetSession();
            setScreen("Screen_Home");
          }}
        >
          Save & Exit
        </MotionButton>
        <MotionButton
          className="w-full"
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
