import { useEffect, useState } from 'react';

export const useStopwatch = () => {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  const start = () => setRunning(true);
  const pause = () => setRunning(false);
  const reset = () => { setRunning(false); setElapsed(0); };

  return {
    elapsed,
    running,
    percent: (elapsed % 60) / 60,
    hasProgress: running || elapsed > 0,
    start, pause, reset,
  };
};
