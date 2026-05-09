import React, { useState } from 'react';
import Timer from './Timer';
import Stopwatch from './Stopwatch';

// Registry of available watch modes. Add new entries here to expose new modes
// (e.g. Pomodoro, Interval) — Watch will pick them up automatically.
export const WATCH_MODES = {
  timer:     { label: "Timer",     Component: Timer },
  stopwatch: { label: "Stopwatch", Component: Stopwatch },
};

const Watch = ({ defaultMode = "timer" }) => {
  const modeKeys = Object.keys(WATCH_MODES);
  const [mode, setMode] = useState(
    WATCH_MODES[defaultMode] ? defaultMode : modeKeys[0]
  );
  const Active = WATCH_MODES[mode] && WATCH_MODES[mode].Component;

  return (
    <div className="timer-block">
      <div className="tabset" role="tablist" aria-label="Watch mode">
        {modeKeys.map((key) => (
          <button
            key={key}
            type="button"
            role="tab"
            className="tab"
            aria-selected={mode === key}
            onClick={() => setMode(key)}
          >
            {WATCH_MODES[key].label}
          </button>
        ))}
      </div>
      {/* key={mode} forces a fresh mount when switching, so each mode keeps a clean state */}
      {Active && <Active key={mode} />}
    </div>
  );
};

export default Watch;
