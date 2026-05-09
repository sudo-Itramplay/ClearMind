import React, { useState, useEffect, useRef } from 'react';
import { useTodos } from '../context/AppContext';
import { useSoundCtx } from '../context/AppContext';
import { Button, Modal, BackButton, Loader } from './UI';
import { dateToday } from '../data/mockDB';

const POSITIONS = [
  { x: 4,  y: 6,  r: -3 }, { x: 22, y: 12, r: 2 },  { x: 40, y: 4,  r: -1 },
  { x: 58, y: 14, r: 3 },  { x: 76, y: 6,  r: -2 }, { x: 8,  y: 50, r: 4 },
  { x: 28, y: 56, r: -2 }, { x: 48, y: 52, r: 1 },  { x: 68, y: 56, r: -3 },
  { x: 4,  y: 28, r: 2 },  { x: 76, y: 30, r: -2 },
];
const COLOR_BY_PRIO = { high: "rose", normal: "yellow", low: "mint" };

const Postit = ({ note, idx, onToggle, dropping }) => {
  const pos = POSITIONS[idx % POSITIONS.length];
  const color = COLOR_BY_PRIO[note.priority] || "yellow";
  const cls = [
    "postit",
    color === "rose" ? "rose" : color === "mint" ? "mint" : "",
    note.completed ? "completed" : "",
    dropping ? "dropping" : "",
  ].join(" ").trim();
  const [bouncing, setBouncing] = useState(false);
  const handle = () => {
    setBouncing(true);
    setTimeout(() => setBouncing(false), 220);
    onToggle(note.id);
  };
  const style = {
    left: `${pos.x}%`, top: `${pos.y}%`,
    transform: `rotate(${pos.r}deg)`,
    "--r": `${pos.r}deg`,
  };
  return (
    <button
      className={cls + (bouncing ? " bouncing" : "")}
      style={style}
      role="checkbox"
      aria-checked={note.completed}
      aria-label={`${note.task} — ${note.priority} priority — ${note.completed ? "completed" : "not completed"}`}
      onClick={handle}
      onKeyDown={(e) => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); handle(); } }}
    >
      <span className={"pt-prio " + (note.priority || "normal")} aria-hidden="true" />
      <span className="pt-text">{note.task}</span>
    </button>
  );
};

const NotebookForm = ({ onSubmit, onCancel }) => {
  const [task, setTask] = useState("");
  const [desc, setDesc] = useState("");
  const [priority, setPriority] = useState("normal");
  const [date, setDate] = useState(dateToday());
  const [error, setError] = useState(null);
  const submit = (e) => {
    e.preventDefault();
    if (!task.trim()) { setError("Task is required."); return; }
    onSubmit({ task: task.trim(), description: desc.trim(), priority, date });
  };
  return (
    <form className="nb-form" onSubmit={submit} noValidate>
      <div className="nb-field">
        <label htmlFor="nb-task">Task</label>
        <input id="nb-task" type="text" value={task} autoFocus
          onChange={(e) => { setTask(e.target.value); if (error) setError(null); }}
          aria-invalid={!!error} aria-describedby={error ? "nb-task-err" : undefined}
          placeholder="What's on your mind?" />
        {error && <span id="nb-task-err" className="nb-error" role="alert">{error}</span>}
      </div>
      <div className="nb-field">
        <label htmlFor="nb-desc">Description</label>
        <textarea id="nb-desc" value={desc} onChange={(e) => setDesc(e.target.value)}
          placeholder="Optional notes..." />
      </div>
      <div className="nb-field">
        <label>Priority</label>
        <div className="priority-row" role="radiogroup" aria-label="Priority">
          {["low", "normal", "high"].map((p) => (
            <React.Fragment key={p}>
              <input type="radio" id={"prio-" + p} name="prio" value={p}
                checked={priority === p} onChange={() => setPriority(p)} />
              <label htmlFor={"prio-" + p}>
                <span className={"pt-prio " + p} style={{ position: "static" }} />
                {p[0].toUpperCase() + p.slice(1)}
              </label>
            </React.Fragment>
          ))}
        </div>
      </div>
      <div className="nb-field">
        <label htmlFor="nb-date">Date</label>
        <input id="nb-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
        <Button type="submit" variant="primary">Pin to Board</Button>
        <Button type="button" variant="ghost" onClick={onCancel}
          style={{ color: "var(--text-body)", borderColor: "rgba(74,55,40,0.25)" }}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

const NotebookModal = ({ open, onClose }) => {
  const { todos, addTodo, toggleTodo, deleteTodo } = useTodos();
  const today = dateToday();
  const list = todos.filter((t) => t.date === today)
    .sort((a, b) => Number(a.completed) - Number(b.completed) || b.createdAt - a.createdAt);
  const [showForm, setShowForm] = useState(false);
  const submit = async (data) => {
    await addTodo(data);
    setShowForm(false);
  };
  return (
    <Modal open={open} onClose={onClose} labelledBy="nb-title">
      <h2 id="nb-title">My Tasks</h2>
      <p className="muted" style={{ marginTop: 4 }}>
        {list.length} for today · {list.filter((t) => t.completed).length} done
      </p>
      {!showForm && (
        <div style={{ marginTop: 14 }}>
          <Button variant="primary" onClick={() => setShowForm(true)}>+ New task</Button>
        </div>
      )}
      {showForm && <NotebookForm onSubmit={submit} onCancel={() => setShowForm(false)} />}
      <ul className="nb-list" aria-label="Today's tasks">
        {list.length === 0 && <li style={{ justifyContent: "center", color: "var(--text-muted)" }}>Nothing yet — add your first task.</li>}
        {list.map((t) => (
          <li key={t.id} className={t.completed ? "done" : ""}>
            <button className={"nb-check " + (t.completed ? "checked" : "")}
              role="checkbox" aria-checked={t.completed}
              aria-label={"Toggle " + t.task}
              onClick={() => toggleTodo(t.id)}>
              {t.completed ? "✓" : ""}
            </button>
            <div className="nb-task">
              {t.task}
              {t.description && <span className="nb-desc">{t.description}</span>}
            </div>
            <span className={"pt-prio " + (t.priority || "normal")} style={{ position: "static", marginTop: 6 }} aria-hidden="true" />
            <button className="nb-del" aria-label={"Delete " + t.task} onClick={() => deleteTodo(t.id)}>×</button>
          </li>
        ))}
      </ul>
    </Modal>
  );
};

// Timer ring with progress
const TimerRing = ({ time, percent = 0, done }) => {
  const c = 80, r = 70;
  const circ = 2 * Math.PI * r;
  return (
    <div className={"timer-ring " + (done ? "timer-done" : "")} aria-hidden="true">
      <svg width="160" height="160" viewBox="0 0 160 160">
        <defs>
          <radialGradient id="bezel" cx="50%" cy="50%" r="50%">
            <stop offset="78%" stopColor="#6B4E3D" /><stop offset="100%" stopColor="#2C1B0E" />
          </radialGradient>
        </defs>
        <circle cx={c} cy={c} r={r + 8} fill="url(#bezel)" />
        <circle cx={c} cy={c} r={r + 1} fill="#1a120a" />
        <circle cx={c} cy={c} r={r - 4} fill="none"
          stroke="rgba(245,230,211,0.10)" strokeWidth="3" />
        <circle cx={c} cy={c} r={r - 4} fill="none"
          stroke="#D4A574" strokeWidth="3" strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - percent)}
          transform={`rotate(-90 ${c} ${c})`}
          style={{ transition: "stroke-dashoffset 0.4s linear" }} />
      </svg>
      <div className="timer-center">
        <span className="timer-time mono">{time}</span>
      </div>
    </div>
  );
};

const fmtTime = (s) => {
  s = Math.max(0, Math.floor(s));
  const m = Math.floor(s / 60);
  const ss = s % 60;
  return String(m).padStart(2, "0") + ":" + String(ss).padStart(2, "0");
};

const useTimer = () => {
  const [mode, setMode] = useState("timer");
  const [duration, setDuration] = useState(25 * 60);
  const [remaining, setRemaining] = useState(25 * 60);
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const { play } = useSoundCtx();

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      if (mode === "timer") {
        setRemaining((r) => {
          if (r <= 1) {
            setRunning(false); setDone(true);
            try { play && play("complete"); } catch (e) {}
            return 0;
          }
          return r - 1;
        });
      } else {
        setElapsed((e) => e + 1);
      }
    }, 1000);
    return () => clearInterval(id);
  }, [running, mode, play]);

  const setMode2 = (m) => {
    setMode(m); setRunning(false); setDone(false);
    setElapsed(0); setRemaining(duration);
  };
  const setDuration2 = (d) => {
    setDuration(d); setRemaining(d); setRunning(false); setDone(false);
  };
  const start = () => { if (done) { setRemaining(duration); setDone(false); } setRunning(true); };
  const pause = () => setRunning(false);
  const reset = () => {
    setRunning(false); setDone(false); setElapsed(0); setRemaining(duration);
  };

  const time = mode === "timer" ? fmtTime(remaining) : fmtTime(elapsed);
  const percent = mode === "timer"
    ? (duration ? (duration - remaining) / duration : 0)
    : ((elapsed % 60) / 60);

  return { mode, setMode: setMode2, duration, setDuration: setDuration2, time, percent, running, done, start, pause, reset };
};

const Study = ({ go }) => {
  const { todos, isLoading, toggleTodo } = useTodos();
  const [open, setOpen] = useState(false);
  const [recentlyAdded, setRecentlyAdded] = useState(null);
  const today = dateToday();
  const todays = todos.filter((t) => t.date === today)
    .sort((a, b) => a.createdAt - b.createdAt)
    .slice(0, POSITIONS.length);

  // detect new additions for drop animation
  const lastIdRef = useRef(null);
  useEffect(() => {
    if (todays.length === 0) return;
    const lastId = todays[todays.length - 1].id;
    if (lastIdRef.current && lastId !== lastIdRef.current && lastIdRef.current !== null) {
      setRecentlyAdded(lastId);
      setTimeout(() => setRecentlyAdded(null), 600);
    }
    lastIdRef.current = lastId;
  }, [todays.map((t) => t.id).join(",")]);

  const t = useTimer();

  return (
    <div className="study-room page-anim">
      <BackButton onClick={() => go("hall")} />
      <div className="study-grid">
        <div className="corkboard-area">
          <div className="corkboard" role="region" aria-label="Cork board with today's tasks">
            {isLoading && <Loader label="Loading tasks" />}
            {!isLoading && todays.length === 0 && (
              <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", color: "var(--text-muted)", fontFamily: '"Crimson Pro", serif', fontSize: "1.1rem" }}>
                The board is empty. Open the notebook to pin a task.
              </div>
            )}
            {!isLoading && todays.map((note, i) => (
              <Postit key={note.id} idx={i} note={note}
                onToggle={toggleTodo}
                dropping={note.id === recentlyAdded} />
            ))}
          </div>
        </div>
        <div className="desk">
          <button className="notebook" onClick={() => setOpen(true)} aria-label="Open My Tasks notebook">
            <span className="notebook-stitch" aria-hidden="true" />
            <span className="notebook-label">My Tasks</span>
            <span className="notebook-count">{todays.length}</span>
          </button>
          <div className="timer-block">
            <TimerRing time={t.done ? "Done!" : t.time} percent={t.percent} done={t.done} />
            <div className="tabset" role="tablist" aria-label="Mode">
              <button className="tab" role="tab" aria-selected={t.mode === "timer"}
                onClick={() => t.setMode("timer")}>Timer</button>
              <button className="tab" role="tab" aria-selected={t.mode === "stopwatch"}
                onClick={() => t.setMode("stopwatch")}>Stopwatch</button>
            </div>
            {t.mode === "timer" && (
              <div className="preset-row" role="group" aria-label="Duration presets">
                {[15, 25, 45, 60].map((m) => (
                  <button key={m} className="preset"
                    aria-pressed={t.duration === m * 60}
                    onClick={() => t.setDuration(m * 60)}>{m}m</button>
                ))}
              </div>
            )}
            <div className="timer-controls">
              {!t.running && <Button variant="primary" onClick={t.start}>{t.done ? "Restart" : "Start"}</Button>}
              {t.running && <Button variant="secondary" onClick={t.pause}>Pause</Button>}
              <Button variant="ghost" style={{ color: "var(--text-on-dark)" }} onClick={t.reset}>Reset</Button>
            </div>
          </div>
        </div>
      </div>
      <NotebookModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
};

export default Study;
