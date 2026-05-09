import React, { useState, useEffect, useMemo } from 'react';
import { useTodos } from '../context/AppContext';
import { useSoundCtx } from '../context/AppContext';

const useClock = () => {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
};

const fmtClock = (now) => {
  const h = now.getHours(); const m = now.getMinutes();
  return String(h % 12 || 12) + ":" + String(m).padStart(2, "0") + " " + (h >= 12 ? "PM" : "AM");
};

const WallClock = () => {
  const now = useClock();
  const h = now.getHours() % 12;
  const m = now.getMinutes();
  const s = now.getSeconds();
  const hourAngle = (h + m / 60) * 30;
  const minAngle = (m + s / 60) * 6;
  const secAngle = s * 6;
  const ticks = [];
  for (let i = 0; i < 60; i++) {
    const isHour = i % 5 === 0;
    ticks.push(<line key={i} x1="60" y1={isHour ? 8 : 10} x2="60" y2={isHour ? 14 : 12}
      stroke={isHour ? "#3A271A" : "#7A5C44"} strokeWidth={isHour ? 2 : 1}
      strokeLinecap="round" transform={`rotate(${i * 6} 60 60)`} />);
  }
  return (
    <div className="clock" data-time={fmtClock(now)} role="timer" aria-live="polite">
      <span className="sr-only">Current time {fmtClock(now)}</span>
      <svg width="110" height="110" viewBox="0 0 120 120" aria-hidden="true">
        <defs>
          <radialGradient id="face" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#FBF1DD" /><stop offset="100%" stopColor="#E8D4B6" />
          </radialGradient>
          <radialGradient id="rim" cx="50%" cy="50%" r="50%">
            <stop offset="80%" stopColor="#5A3F28" /><stop offset="100%" stopColor="#2C1B0E" />
          </radialGradient>
        </defs>
        <circle cx="60" cy="60" r="58" fill="url(#rim)" />
        <circle cx="60" cy="60" r="50" fill="url(#face)" stroke="#8B6F5C" strokeWidth="1" />
        {ticks}
        <line x1="60" y1="60" x2="60" y2="32" stroke="#3A271A" strokeWidth="4" strokeLinecap="round" transform={`rotate(${hourAngle} 60 60)`} />
        <line x1="60" y1="60" x2="60" y2="22" stroke="#3A271A" strokeWidth="3" strokeLinecap="round" transform={`rotate(${minAngle} 60 60)`} />
        <line x1="60" y1="64" x2="60" y2="20" stroke="#D4763A" strokeWidth="1.5" strokeLinecap="round" transform={`rotate(${secAngle} 60 60)`} />
        <circle cx="60" cy="60" r="3.5" fill="#3A271A" /><circle cx="60" cy="60" r="1.2" fill="#D4A574" />
      </svg>
    </div>
  );
};

// Build 35-day window ending today, group todos by date
const useCalendarDays = (todos) => {
  return useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // Start 34 days before today so today is the last sphere
    const days = [];
    const map = {};
    for (const t of todos) {
      (map[t.date] = map[t.date] || []).push(t);
    }
    for (let i = 34; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const list = map[key] || [];
      const total = list.length;
      const done = list.filter((t) => t.completed).length;
      const isToday = i === 0;
      // intensity tier
      let alpha = 0, glow = 0;
      if (total >= 5)      { alpha = 1.0; glow = 18; }
      else if (total >= 4) { alpha = 0.8; glow = 14; }
      else if (total >= 2) { alpha = 0.5; glow = 10; }
      else if (total >= 1) { alpha = 0.22; glow = 6; }
      days.push({ key, total, done, isToday, alpha, glow, allDone: total > 0 && done === total });
    }
    return days;
  }, [todos]);
};

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

const CalendarWall = () => {
  const { todos, isLoading } = useTodos();
  const days = useCalendarDays(todos);
  const now = new Date();
  return (
    <div className="calendar">
      <h2 className="calendar-label">{MONTHS[now.getMonth()]} {now.getFullYear()}</h2>
      <div className="calendar-days" aria-hidden="true">
        {DAYS.map((d) => <span key={d}>{d}</span>)}
      </div>
      <div className="calendar-grid" role="img" aria-label="Daily activity for the past five weeks">
        {isLoading
          ? Array.from({ length: 35 }).map((_, i) => <div key={i} className="sphere" />)
          : days.map((d) => (
              <div
                key={d.key}
                className={[
                  "sphere",
                  d.alpha > 0 ? "lit" : "",
                  d.isToday ? "today" : "",
                  d.allDone ? "done" : "",
                ].join(" ").trim()}
                style={d.alpha > 0 ? {
                  opacity: 0.35 + d.alpha * 0.65,
                  "--glow": d.glow + "px",
                  "--glow-a": d.alpha,
                } : undefined}
                aria-label={`${d.key}: ${d.total} task${d.total === 1 ? "" : "s"}, ${d.done} done`}
              >
                <span className="sphere-tip">{d.key}: {d.total} task{d.total === 1 ? "" : "s"}</span>
              </div>
            ))
        }
      </div>
      <div className="calendar-legend" aria-label="Activity legend">
        <span><span className="lg-dot" style={{ background: "#3D2E20" }} />None</span>
        <span><span className="lg-dot" style={{ background: "rgba(245,166,35,0.4)" }} />Low</span>
        <span><span className="lg-dot" style={{ background: "rgba(245,166,35,0.85)" }} />High</span>
        <span><span className="lg-dot" style={{ background: "#B8D8C8" }} />Done ✓</span>
      </div>
    </div>
  );
};

const Door = ({ kind, label, onClick }) => {
  const { play } = useSoundCtx();
  return (
    <div
      className={"door-wrap " + kind}
      onMouseEnter={() => play && play("creak")}
    >
      <button
        type="button"
        className={"door " + kind}
        aria-label={`Enter ${label}`}
        onClick={() => { play && play("click"); onClick(); }}
      >
        <span className="door-light" aria-hidden="true" />
      </button>
      <div className="plaque">{label}</div>
    </div>
  );
};

const CenterTable = () => (
  <div className="table" aria-hidden="true">
    <div className="lamp-shade" />
    <div className="lamp-stem" />
    <div className="lamp-base" />
  </div>
);

const Hall = ({ go }) => (
  <div className="hall page-anim">
    <div className="hall-grain" aria-hidden="true" />
    <div className="hall-top">
      <CalendarWall />
      <WallClock />
    </div>
    <div className="hall-mid">
      <Door kind="study" label="Study Room" onClick={() => go("study")} />
      <CenterTable />
      <Door kind="meditate" label="Meditate" onClick={() => go("meditate")} />
    </div>
    <div className="hall-floor-wrap" aria-hidden="true">
      <div className="hall-skirting" />
      <div className="hall-floor" />
      <div className="rug" />
    </div>
  </div>
);

export default Hall;
