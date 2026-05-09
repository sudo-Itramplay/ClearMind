import React, { useEffect, useRef } from 'react';

const fmtDate = (key) => {
  const [y, m, d] = key.split("-");
  return `${d}/${m}/${y}`;
};

const LEVEL_LABEL = {
  none: "no pending tasks",
  low: "light load",
  med: "average load",
  high: "heavy load",
};

const Day = ({ day, isOpen, onToggle }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const onDocMouse = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onToggle();
    };
    const onKey = (e) => { if (e.key === "Escape") onToggle(); };
    document.addEventListener("mousedown", onDocMouse);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocMouse);
      document.removeEventListener("keydown", onKey);
    };
  }, [isOpen, onToggle]);

  const sphereCls = [
    "sphere",
    `sphere-${day.level}`,
    day.isToday ? "today" : "",
    day.isPast ? "past" : "",
    day.allDone ? "all-done" : "",
    isOpen ? "open" : "",
  ].join(" ").trim();

  const aria = `${fmtDate(day.key)} — ${day.pending} pending of ${day.total} task${day.total === 1 ? "" : "s"} (${LEVEL_LABEL[day.level]})`;

  return (
    <div ref={ref} className="day">
      <button
        type="button"
        className={sphereCls}
        aria-label={aria}
        aria-current={day.isToday ? "date" : undefined}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        onClick={onToggle}
      />
      {isOpen && (
        <div className="day-popover" role="dialog" aria-label={`Tasks for ${fmtDate(day.key)}`}>
          <div className="day-popover-arrow" aria-hidden="true" />
          <div className="day-popover-head">
            <strong>{fmtDate(day.key)}{day.isToday ? " · Today" : ""}</strong>
            <span className="muted">{day.done}/{day.total} done</span>
          </div>
          {day.tasks.length === 0 ? (
            <div className="day-popover-empty">No tasks</div>
          ) : (
            <ul className="day-popover-list">
              {day.tasks.map((t) => (
                <li key={t.id} className={t.completed ? "done" : ""}>
                  <span className={"pt-prio " + (t.priority || "normal")} aria-hidden="true" />
                  <span className="day-task-text">{t.task}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default Day;
