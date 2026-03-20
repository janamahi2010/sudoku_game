import { useEffect, useState } from "react";
import { GameControls } from "../components/game/GameControls";
import { GameHeader } from "../components/game/GameHeader";
import { NumberPad } from "../components/game/NumberPad";
import { SudokuGrid } from "../components/game/SudokuGrid";
import { TutorialOverlay } from "../components/game/TutorialOverlay";
import { MotionButton } from "../components/layout/MotionButton";
import { Popup } from "../components/layout/Popup";
import { ScreenShell } from "../components/layout/ScreenShell";
import { MAX_MISTAKES } from "../constants/game";
import { useAdStore } from "../stores/useAdStore";
import { useDailyChallengeStore } from "../stores/useDailyChallengeStore";
import { useGameStore } from "../stores/useGameStore";
import { useSaveStore } from "../stores/useSaveStore";
import { useStatsStore } from "../stores/useStatsStore";
import { useSudokuStore } from "../stores/useSudokuStore";
import { useUIStore } from "../stores/useUIStore";
import { local } from "../utils/storage";
import { todayUtc } from "../utils/time";

export const ScreenGame = () => {
  const setPaused = useGameStore((s) => s.setPaused);
  const startTimer = useGameStore((s) => s.startTimer);
  const stopTimer = useGameStore((s) => s.stopTimer);
  const paused = useGameStore((s) => s.paused);
  const elapsedSeconds = useGameStore((s) => s.elapsedSeconds);
  const mistakes = useGameStore((s) => s.mistakes);
  const difficulty = useGameStore((s) => s.difficulty);
  const registerWin = useStatsStore((s) => s.registerWin);
  const registerMistake = useStatsStore((s) => s.registerMistake);
  const completed = useSudokuStore((s) => s.completed);
  const showReward = useAdStore((s) => s.showReward);
  const setScreen = useUIStore((s) => s.setScreen);
  const pauseOpen = useUIStore((s) => s.pauseOpen);
  const markPartial = useDailyChallengeStore((s) => s.markPartial);
  const markComplete = useDailyChallengeStore((s) => s.markComplete);
  const clearSaved = useSaveStore((s) => s.clearSavedGame);

  const [tutorialOpen, setTutorialOpen] = useState(() => !local.get("sudoku-tutorial-seen", false));
  const [mistakePopup, setMistakePopup] = useState(false);

  useEffect(() => {
    if (paused || pauseOpen) {
      stopTimer();
      return;
    }
    startTimer();
    return () => stopTimer();
  }, [pauseOpen, paused, startTimer, stopTimer]);

  useEffect(() => {
    if (mistakes >= MAX_MISTAKES) {
      registerMistake();
      setMistakePopup(true);
      setPaused(true);
      markPartial(todayUtc(), elapsedSeconds);
    }
  }, [elapsedSeconds, markPartial, mistakes, registerMistake, setPaused]);

  useEffect(() => {
    if (!completed) return;
    markComplete(todayUtc(), elapsedSeconds);
    registerWin(difficulty, elapsedSeconds);
    void clearSaved();
    setScreen("Screen_Complete");
  }, [clearSaved, completed, difficulty, elapsedSeconds, markComplete, registerWin, setScreen]);

  return (
    <ScreenShell>
      <GameHeader />
      <SudokuGrid />
      <div className="mt-4">
        <NumberPad />
        <GameControls />
      </div>

      <TutorialOverlay open={tutorialOpen} onClose={() => setTutorialOpen(false)} />

      <Popup open={mistakePopup} title="3 Mistakes Reached" onClose={() => setMistakePopup(false)}>
        <p className="mb-4 text-sm text-[var(--muted)]">Watch a reward ad simulation to resume, or cancel.</p>
        <div className="grid grid-cols-2 gap-2">
          <MotionButton
            onClick={async () => {
              const ok = await showReward();
              if (ok) {
                useGameStore.setState({ mistakes: 0 });
                setPaused(false);
                setMistakePopup(false);
              }
            }}
          >
            Resume
          </MotionButton>
          <MotionButton
            variant="danger"
            onClick={() => {
              setMistakePopup(false);
              setScreen("Screen_Home");
            }}
          >
            Cancel
          </MotionButton>
        </div>
      </Popup>
    </ScreenShell>
  );
};
