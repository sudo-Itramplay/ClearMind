import React, { useMemo, useState } from 'react';
import Modal from '../../../components/ui/Modal';
import { useTodos } from '../../../context/TodoContext';
import { useExams } from '../../../context/ExamContext';
import { useToast } from '../../../context/ToastContext';
import { localDateKey } from '../../../utils/date';
import { buildExamsIcs, downloadIcs } from '../../../utils/ics';

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DOW = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

// 6-week grid (42 cells), Monday-first, matching the Hall calendar convention.
const buildMonth = (year, month) => {
  const firstDow = (new Date(year, month, 1).getDay() + 6) % 7;
  const start = new Date(year, month, 1 - firstDow);
  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return { key: localDateKey(d), num: d.getDate(), inMonth: d.getMonth() === month };
  });
};

const fmtDate = (key) => {
  const [y, m, d] = key.split("-");
  return `${d}/${m}/${y}`;
};

const CalendarModal = ({ open, onClose }) => {
  const { todos } = useTodos();
  const { exams, setExam, removeExam } = useExams();
  const { push } = useToast();
  const examCount = Object.keys(exams).length;

  const exportExams = () => {
    if (examCount === 0) return;
    downloadIcs("clearmind-exams.ics", buildExamsIcs(exams));
    push({ message: `Exported ${examCount} exam${examCount === 1 ? "" : "s"} — open the file to add them to your calendar` });
  };

  const now = new Date();
  const todayKey = localDateKey(now);
  const [cursor, setCursor] = useState({ year: now.getFullYear(), month: now.getMonth() });
  const [selected, setSelected] = useState(todayKey);
  const [draft, setDraft] = useState("");

  const byDate = useMemo(() => {
    const m = {};
    for (const t of todos) (m[t.date] = m[t.date] || []).push(t);
    return m;
  }, [todos]);

  const cells = useMemo(() => buildMonth(cursor.year, cursor.month), [cursor]);

  const shiftMonth = (delta) => {
    setCursor(({ year, month }) => {
      const d = new Date(year, month + delta, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  };
  const goToday = () => {
    setCursor({ year: now.getFullYear(), month: now.getMonth() });
    setSelected(todayKey);
  };

  const selectDay = (key) => {
    setSelected(key);
    setDraft(exams[key] || "");
  };

  const selTasks = (byDate[selected] || []).slice().sort((a, b) => a.createdAt - b.createdAt);
  const selIsExam = selected in exams;
  const selDone = selTasks.filter((t) => t.completed).length;

  const submitExam = (e) => {
    e.preventDefault();
    setExam(selected, draft.trim());
  };

  return (
    <Modal open={open} onClose={onClose} labelledBy="cal-modal-title">
      <h2 id="cal-modal-title" className="cal-modal-title">Calendar</h2>

      <div className="cal-modal-nav">
        <button type="button" className="cal-nav-btn" onClick={() => shiftMonth(-1)} aria-label="Previous month">‹</button>
        <span className="cal-nav-label">{MONTHS[cursor.month]} {cursor.year}</span>
        <button type="button" className="cal-nav-btn" onClick={() => shiftMonth(1)} aria-label="Next month">›</button>
        <button type="button" className="cal-today-btn" onClick={goToday}>Today</button>
      </div>

      <div className="cal-modal-dow" aria-hidden="true">
        {DOW.map((d) => <span key={d}>{d}</span>)}
      </div>

      <div className="cal-modal-grid" role="grid" aria-label={`${MONTHS[cursor.month]} ${cursor.year}`}>
        {cells.map((c) => {
          const tasks = byDate[c.key] || [];
          const pending = tasks.filter((t) => !t.completed).length;
          const isExam = c.key in exams;
          const cls = [
            "cal-cell",
            c.inMonth ? "" : "out",
            c.key === todayKey ? "today" : "",
            c.key === selected ? "selected" : "",
            isExam ? "exam" : "",
          ].join(" ").trim();
          return (
            <button
              key={c.key}
              type="button"
              className={cls}
              role="gridcell"
              aria-label={`${fmtDate(c.key)}${tasks.length ? `, ${tasks.length} task${tasks.length === 1 ? "" : "s"}` : ""}${isExam ? ", exam day" : ""}`}
              aria-current={c.key === todayKey ? "date" : undefined}
              onClick={() => selectDay(c.key)}
            >
              <span className="cal-cell-num">{c.num}</span>
              {tasks.length > 0 && (
                <span className={"cal-cell-dot " + (pending > 0 ? "pending" : "done")} aria-hidden="true" />
              )}
            </button>
          );
        })}
      </div>

      <div className="cal-detail">
        <div className="cal-detail-head">
          <strong>{fmtDate(selected)}{selected === todayKey ? " · Today" : ""}</strong>
          {selTasks.length > 0 && <span className="muted">{selDone}/{selTasks.length} done</span>}
        </div>

        {selIsExam && (
          <div className="day-exam-tag">
            <span className="exam-dot" aria-hidden="true" />
            {exams[selected] || "Exam day"}
          </div>
        )}

        {selTasks.length === 0 ? (
          <div className="cal-detail-empty">No tasks this day</div>
        ) : (
          <ul className="cal-detail-list">
            {selTasks.map((t) => (
              <li key={t.id} className={t.completed ? "done" : ""}>
                <span className={"pt-prio pt-prio-static " + (t.priority || "normal")} aria-hidden="true" />
                <span className="cal-detail-text">{t.task}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="day-exam-actions">
          {selIsExam ? (
            <button type="button" className="day-exam-btn remove" onClick={() => removeExam(selected)}>
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

      <div className="cal-modal-footer">
        <button
          type="button"
          className="cal-export-btn"
          onClick={exportExams}
          disabled={examCount === 0}
        >
          <span className="cal-export-icon" aria-hidden="true" />
          Add exams to calendar
          {examCount > 0 && <span className="cal-export-count">{examCount}</span>}
        </button>
        <p className="cal-export-hint">
          Downloads an .ics file — open it to add your exams to Google, Apple, or Outlook calendar.
        </p>
      </div>
    </Modal>
  );
};

export default CalendarModal;
