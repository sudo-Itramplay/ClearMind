import React, { useState } from 'react';
import TimerRing from './TimerRing';
import Button from '../ui/Button';
import ConfirmDialog from '../ui/ConfirmDialog';
import { useStopwatch } from '../../hooks/useStopwatch';

const GOAL_PRESETS = [30, 60, 90, 120]; // minutes
const DEFAULT_GOAL = 60 * 60; // seconds

const fmtTime = (s) => {
  s = Math.max(0, Math.floor(s));
  return String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0");
};

const Stopwatch = () => {
  const sw = useStopwatch();
  const [goal, setGoal] = useState(DEFAULT_GOAL);
  const [pendingReset, setPendingReset] = useState(false);

  const reached = sw.elapsed >= goal;

  const handleReset = () => {
    if (sw.hasProgress) setPendingReset(true);
    else sw.reset();
  };

  const statusText = reached
    ? `+${fmtTime(sw.elapsed - goal)} past goal`
    : `${fmtTime(goal - sw.elapsed)} to goal`;

  return (
    <>
      <TimerRing time={fmtTime(sw.elapsed)} showProgress={false} paled={reached} />
      <div className="goal-row" role="group" aria-label="Study time goal">
        <span className="goal-label">Goal</span>
        {GOAL_PRESETS.map((m) => (
          <button
            key={m}
            type="button"
            className="preset"
            aria-pressed={goal === m * 60}
            onClick={() => setGoal(m * 60)}
          >
            {m}m
          </button>
        ))}
      </div>
      <div className={"stopwatch-status" + (reached ? " reached" : "")} aria-live="polite">
        {statusText}
      </div>
      <div className="timer-controls">
        {!sw.running && <Button variant="primary" onClick={sw.start}>Start</Button>}
        {sw.running && <Button variant="secondary" onClick={sw.pause}>Pause</Button>}
        <Button variant="ghost" onClick={handleReset}>Reset</Button>
      </div>
      <ConfirmDialog
        open={pendingReset}
        title="Reiniciar el cronòmetre?"
        message="El progrés de la sessió actual es perdrà."
        cancelLabel="Cancel·lar"
        confirmLabel="Reiniciar"
        onCancel={() => setPendingReset(false)}
        onConfirm={() => { sw.reset(); setPendingReset(false); }}
      />
    </>
  );
};

export default Stopwatch;
