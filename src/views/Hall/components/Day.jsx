import React, { useEffect, useRef, useState } from 'react';

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

const Day = ({ day, isOpen, onToggle, onSetExam, onRemoveExam }) => {
  const ref = useRef(null);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    if (isOpen) setDraft(day.examLabel || "");
  }, [isOpen, day.examLabel]);

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
    day.isExam ? "exam" : "",
    isOpen ? "open" : "",
  ].join(" ").trim();

  const examAria = day.isExam ? `, exam day${day.examLabel ? `: ${day.examLabel}` : ""}` : "";
  const aria = `${fmtDate(day.key)} — ${day.pending} pending of ${day.total} task${day.total === 1 ? "" : "s"} (${LEVEL_LABEL[day.level]})${examAria}`;

  const submitExam = (e) => {
    e.preventDefault();
    onSetExam && onSetExam(draft.trim());
  };

  return (
    <div ref={ref} className="day">
      {day.isExam && <span className="exam-ring" aria-hidden="true" />}
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
          {day.isExam && (
            <div className="day-exam-tag">
              <span className="exam-dot" aria-hidden="true" />
              {day.examLabel || "Exam day"}
            </div>
          )}
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
          <div className="day-exam-actions">
            {day.isExam ? (
              <button
                type="button"
                className="day-exam-btn remove"
                onClick={() => onRemoveExam && onRemoveExam()}
              >
                Remove exam
              </button>
            ) : (
              <form className="day-exam-form" onSubmit={submitExam}>
                <input
                  type="text"
                  className="day-exam-input"
                  placeholder="Exam name (optional)"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                />
                <button type="submit" className="day-exam-btn">Mark as exam</button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Day;
