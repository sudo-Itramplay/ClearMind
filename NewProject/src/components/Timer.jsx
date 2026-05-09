import React, { useState } from 'react';
import TimerRing from './TimerRing';
import { Button, ConfirmDialog } from './UI';
import { useTimer } from '../hooks/useTimer';
import { useSoundCtx } from '../context/AppContext';

const PRESETS = [15, 25, 45, 60];

const fmtTime = (s) => {
  s = Math.max(0, Math.floor(s));
  return String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0");
};

const Timer = () => {
  const { play } = useSoundCtx();
  const t = useTimer({ onComplete: () => { try { play && play("complete"); } catch (e) {} } });
  const [pendingReset, setPendingReset] = useState(false);

  const handleReset = () => {
    if (t.hasProgress) setPendingReset(true);
    else t.reset();
  };

  return (
    <>
      <TimerRing time={t.done ? "Done!" : fmtTime(t.remaining)} percent={t.percent} done={t.done} />
      <div className="preset-row" role="group" aria-label="Duration presets">
        {PRESETS.map((m) => (
          <button key={m} type="button" className="preset"
            aria-pressed={t.duration === m * 60}
            onClick={() => t.setDuration(m * 60)}>{m}m</button>
        ))}
      </div>
      <div className="timer-controls">
        {!t.running && <Button variant="primary" onClick={t.start}>{t.done ? "Restart" : "Start"}</Button>}
        {t.running && <Button variant="secondary" onClick={t.pause}>Pause</Button>}
        <Button variant="ghost" style={{ color: "var(--text-on-dark)" }} onClick={handleReset}>Reset</Button>
      </div>
      <ConfirmDialog
        open={pendingReset}
        title="Reiniciar el cronòmetre?"
        message="El progrés de la sessió actual es perdrà."
        cancelLabel="Cancel·lar"
        confirmLabel="Reiniciar"
        onCancel={() => setPendingReset(false)}
        onConfirm={() => { t.reset(); setPendingReset(false); }}
      />
    </>
  );
};

export default Timer;
