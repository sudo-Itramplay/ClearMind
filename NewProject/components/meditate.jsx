// Meditate page — 3 modes (Activation / Anxiety / Sleep) + session timer

const MEDITATION_MODES = {
  activation: {
    label: "Activation",
    icon: "⚡",
    duration: 3,
    phases: [
      { label: "Inhale",  duration: 2000 },
      { label: "Hold",    duration: 1000 },
      { label: "Exhale",  duration: 2000 },
      { label: "Hold",    duration: 1000 },
    ],
  },
  anxiety: {
    label: "Anxiety",
    icon: "🌿",
    duration: 4,
    phases: [
      { label: "Breathe In",  duration: 4000 },
      { label: "Hold",        duration: 4000 },
      { label: "Breathe Out", duration: 4000 },
      { label: "Hold",        duration: 4000 },
    ],
  },
  sleep: {
    label: "Sleep",
    icon: "🌙",
    duration: 10,
    phases: [
      { label: "Inhale", duration: 4000 },
      { label: "Hold",   duration: 7000 },
      { label: "Exhale", duration: 8000 },
    ],
  },
};

const Meditate = ({ go }) => {
  const [modeKey, setModeKey] = React.useState("anxiety");
  const mode = MEDITATION_MODES[modeKey];
  const [phase, setPhase] = React.useState(0);
  const [running, setRunning] = React.useState(false);
  const [elapsed, setElapsed] = React.useState(0);
  const [complete, setComplete] = React.useState(false);
  const { play } = useSoundCtx();

  React.useEffect(() => {
    setRunning(false); setElapsed(0); setComplete(false); setPhase(0);
  }, [modeKey]);

  React.useEffect(() => {
    if (!running) return;
    const t = setTimeout(() => setPhase((p) => (p + 1) % mode.phases.length), mode.phases[phase].duration);
    return () => clearTimeout(t);
  }, [phase, running, mode]);

  React.useEffect(() => {
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
    setRunning(true);
  };
  const remaining = Math.max(0, mode.duration * 60 - elapsed);
  const fmt = (s) => String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0");

  return (
    <div className="meditate-room page-anim">
      <BackButton onClick={() => go("hall")} />
      <div className="meditate-grain" aria-hidden="true" />
      <div className="amb-glow" aria-hidden="true" />
      <div className="meditate-stage">
        <div className="med-stack">
          <div className="mode-row" role="group" aria-label="Breathing mode">
            {Object.entries(MEDITATION_MODES).map(([k, m]) => (
              <button key={k}
                className={"mode-btn " + k}
                aria-pressed={modeKey === k}
                onClick={() => setModeKey(k)}>
                <span aria-hidden="true">{m.icon}</span> {m.label}
              </button>
            ))}
          </div>
          <div className={"breath " + modeKey + (running ? "" : " paused") + (complete ? " complete" : "")} aria-hidden="true" />
          <div className="breath-label" aria-live="polite">
            {complete
              ? (modeKey === "sleep" ? "Rest well…" : "Session Complete")
              : (running ? mode.phases[phase].label + "…" : "Ready")}
          </div>
          <div className="session-time" aria-live="polite">
            {complete ? `${mode.duration} min — well done` : `${fmt(remaining)} remaining`}
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            {!running && <Button variant="primary" onClick={start}>{complete ? "Begin Again" : "Start"}</Button>}
            {running && <Button variant="ghost" onClick={() => setRunning(false)}>Pause</Button>}
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

window.Meditate = Meditate;
