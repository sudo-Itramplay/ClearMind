import React, { useState } from 'react';
import TimerRing from './TimerRing';
import { Button, ConfirmDialog } from './UI';
import { useStopwatch } from '../hooks/useStopwatch';

const fmtTime = (s) => {
  s = Math.max(0, Math.floor(s));
  return String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0");
};

const Stopwatch = () => {
  const sw = useStopwatch();
  const [pendingReset, setPendingReset] = useState(false);

  const handleReset = () => {
    if (sw.hasProgress) setPendingReset(true);
    else sw.reset();
  };

  return (
    <>
      <TimerRing time={fmtTime(sw.elapsed)} percent={sw.percent} />
      <div className="timer-controls">
        {!sw.running && <Button variant="primary" onClick={sw.start}>Start</Button>}
        {sw.running && <Button variant="secondary" onClick={sw.pause}>Pause</Button>}
        <Button variant="ghost" style={{ color: "var(--text-on-dark)" }} onClick={handleReset}>Reset</Button>
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
