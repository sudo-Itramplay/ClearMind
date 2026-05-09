import { useEffect, useRef, useState } from 'react';

export const useTimer = ({ initialDuration = 25 * 60, onComplete } = {}) => {
  const [duration, setDuration] = useState(initialDuration);
  const [remaining, setRemaining] = useState(initialDuration);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);

  const onCompleteRef = useRef(onComplete);
  useEffect(() => { onCompleteRef.current = onComplete; }, [onComplete]);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          setRunning(false);
          setDone(true);
          try { onCompleteRef.current && onCompleteRef.current(); } catch (e) {}
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running]);

  const setDurationSafe = (d) => {
    setDuration(d);
    setRemaining(d);
    setRunning(false);
    setDone(false);
  };
  const start = () => {
    if (done) { setRemaining(duration); setDone(false); }
    setRunning(true);
  };
  const pause = () => setRunning(false);
  const reset = () => { setRunning(false); setDone(false); setRemaining(duration); };

  const percent = duration ? (duration - remaining) / duration : 0;
  const hasProgress = running || done || remaining < duration;

  return { duration, setDuration: setDurationSafe, remaining, running, done, percent, hasProgress, start, pause, reset };
};
