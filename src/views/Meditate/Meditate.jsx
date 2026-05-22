import React, { useEffect, useState } from 'react';
import BackButton from '../../components/ui/BackButton';
import Button from '../../components/ui/Button';
import { useSoundCtx } from '../../context/SoundContext';
import './style/meditate.css';

const MEDITATION_MODES = {
  activation: {
    label: "Activation",
    icon: "⚡",
    duration: 3,
    phases: [
      { label: "Inhale", duration: 2000, scale: 1.15, opacity: 1 },
      { label: "Hold",   duration: 1000, scale: 1.15, opacity: 1 },
      // Fem que es desinfli per sota de la seva mida original (0.85)
      { label: "Exhale", duration: 2000, scale: 0.85, opacity: 0.85 },
      { label: "Hold",   duration: 1000, scale: 0.85, opacity: 0.85 },
    ],
  },
  anxiety: {
    label: "Anxiety",
    icon: "🌿",
    duration: 4,
    phases: [
      { label: "Breathe In",  duration: 4000, scale: 1.15, opacity: 1 },
      { label: "Hold",        duration: 4000, scale: 1.15, opacity: 1 },
      { label: "Breathe Out", duration: 4000, scale: 0.85, opacity: 0.85 },
      { label: "Hold",        duration: 4000, scale: 0.85, opacity: 0.85 },
    ],
  },
  sleep: {
    label: "Sleep",
    icon: "🌙",
    duration: 10,
    phases: [
      { label: "Inhale", duration: 4000, scale: 1.15, opacity: 1 },
      { label: "Hold",   duration: 7000, scale: 1.15, opacity: 1 },
      { label: "Exhale", duration: 8000, scale: 0.85, opacity: 0.85 },
    ],
  },
};

const fmt = (s) =>
  String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0");

const Meditate = ({ go }) => {
  const [modeKey, setModeKey] = useState("anxiety");
  const mode = MEDITATION_MODES[modeKey];
  const [phase, setPhase] = useState(0);
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [complete, setComplete] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const { play } = useSoundCtx();

  useEffect(() => {
    setRunning(false); setElapsed(0); setComplete(false); setPhase(0); setHasStarted(false);
  }, [modeKey]);

  useEffect(() => {
    if (!running) return;
    const t = setTimeout(() => setPhase((p) => (p + 1) % mode.phases.length), mode.phases[phase].duration);
    return () => clearTimeout(t);
  }, [phase, running, mode]);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setElapsed((e) => {
      const n = e + 1;
      if (n >= mode.duration * 60) {
        setRunning(false); setComplete(true);
        try { play && play("gong"); } catch (err) {}
        return mode.duration * 60;
      }
      return n;
    }), 1000);
    return () => clearInterval(id);
  }, [running, mode, play]);

  const start = () => {
    if (complete) { setComplete(false); setElapsed(0); setPhase(0); }
    setHasStarted(true);
    setRunning(true);
  };
  const totalSeconds = mode.duration * 60;
  const remaining = Math.max(0, totalSeconds - elapsed);
  const progress = Math.min(100, Math.round((elapsed / totalSeconds) * 100));

  return (
    <div className="meditate-room page-anim">
      <BackButton onClick={() => go("hall")} />
      <div className="meditate-grain" aria-hidden="true" />
      <div className="amb-glow" aria-hidden="true" />
      <div className="meditate-stage">
        <div className="med-stack">
          <div className="mode-row" role="group" aria-label="Breathing mode">
            {Object.entries(MEDITATION_MODES).map(([k, m]) => (
              <button
                key={k}
                className={"mode-btn " + k}
                aria-pressed={modeKey === k}
                onClick={() => setModeKey(k)}
              >
                <span aria-hidden="true">{m.icon}</span> {m.label}
              </button>
            ))}
          </div>
          <div
            className={"breath " + modeKey + (complete ? " complete" : "")}
            aria-hidden="true"
            style={{
              // Apliquem la mida i transparència de la fase actual si està corrent. Si està pausat, torna a 1.
              transform: running ? `scale(${mode.phases[phase].scale})` : 'scale(1)',
              opacity: running ? mode.phases[phase].opacity : 0.92,
              // La transició dura exactament els mil·lisegons que dura la fase!
              transition: running 
                ? `all ${mode.phases[phase].duration}ms ease-in-out` 
                : 'all 2s ease-in-out'
            }}
          />
          <div className="breath-label" aria-live="polite">
            {complete
              ? (modeKey === "sleep" ? "Rest well…" : "Session Complete")
              : (running ? mode.phases[phase].label + "…" : "Ready")}
          </div>
          <div className="session-time" aria-live="polite">
            {complete ? `${mode.duration} min — well done` : (hasStarted ? `${fmt(remaining)} remaining` : "")}
          </div>
          {(hasStarted || complete) && (
            <div
              className="session-progress"
              role="progressbar"
              aria-label="Meditation session progress"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progress}
            >
              <div className="session-progress-fill" style={{ width: `${progress}%` }} />
            </div>
          )}
          <div className="med-actions">
            {/* 1. Si la sessió està en marxa */}
            {running && (
              <Button variant="ghost" onClick={() => setRunning(false)}>
                Pause
              </Button>
            )}

            {/* 2. Si no ha començat mai */}
            {!running && !hasStarted && !complete && (
              <Button variant="primary" onClick={start}>
                Start
              </Button>
            )}

            {/* 3. Si està pausada a mitges */}
            {!running && hasStarted && !complete && (
              <>
                <Button variant="primary" onClick={() => setRunning(true)}>
                  Continue
                </Button>
                <Button variant="ghost" onClick={() => {
                  setElapsed(0);
                  setPhase(0);
                  setHasStarted(false);
                }}>
                  Reset
                </Button>
              </>
            )}

            {/* 4. Si ha acabat el temps */}
            {!running && complete && (
              <Button variant="primary" onClick={start}>
                Start Over
              </Button>
            )}
          </div>
        </div>
      </div>
      <div className="meditate-floor-wrap" aria-hidden="true">
        <div className="meditate-skirting" />
        <div className="meditate-floor" />
      </div>
    </div>
  );
};

export default Meditate;
