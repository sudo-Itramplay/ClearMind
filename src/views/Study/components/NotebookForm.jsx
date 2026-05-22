import React, { useEffect, useMemo, useState } from 'react';
import Button from '../../../components/ui/Button';
import { dateToday } from '../../../data/mockDB';
import { parseQuickInput, QUICK_ADD_CONFIG, realClock } from '../../../features/quickAdd';

const PRIORITIES = ["low", "normal", "high"];

const NotebookForm = ({ onSubmit, onCancel, onDirty }) => {
  const [task, setTask] = useState("");
  const [desc, setDesc] = useState("");
  const [priority, setPriority] = useState("normal");
  const [date, setDate] = useState(dateToday());
  const [isExam, setIsExam] = useState(false);
  const [error, setError] = useState(null);

  // The task field understands the same shorthand as Quick Add. Detected
  // keywords fill the controls below and are stripped from the saved title.
  const parsed = useMemo(() => parseQuickInput(task, QUICK_ADD_CONFIG, realClock), [task]);
  useEffect(() => { if (parsed.priority) setPriority(parsed.priority); }, [parsed.priority]);
  useEffect(() => { if (parsed.date) setDate(parsed.date); }, [parsed.date]);
  useEffect(() => { if (parsed.isExam) setIsExam(true); }, [parsed.isExam]);

  const cleanTask = parsed.task.trim();
  const detected = parsed.priority || parsed.date || parsed.isExam;

  const dirty = !!(task.trim() || desc.trim());
  useEffect(() => { onDirty && onDirty(dirty); }, [dirty, onDirty]);

  const submit = (e) => {
    e.preventDefault();
    if (!cleanTask) { setError("Task is required."); return; }
    onSubmit({ task: cleanTask, description: desc.trim(), priority, date, isExam });
  };

  return (
    <form className="nb-form" onSubmit={submit} noValidate>
      <div className="nb-field">
        <label htmlFor="nb-task">Task</label>
        <input
          id="nb-task"
          type="text"
          value={task}
          autoFocus
          onChange={(e) => { setTask(e.target.value); if (error) setError(null); }}
          aria-invalid={!!error}
          aria-describedby={error ? "nb-task-err" : undefined}
          placeholder="e.g. Maths exam nxmn p1"
        />
        {error && <span id="nb-task-err" className="nb-error" role="alert">{error}</span>}
        {detected && (
          <div className="nb-parsed" aria-live="polite">
            <span className="nb-parsed-label">Detected:</span>
            {parsed.priority && <span className={"qa-chip qa-chip-prio prio-" + parsed.priority}>{parsed.priority}</span>}
            {parsed.date && <span className="qa-chip qa-chip-date">{parsed.date}</span>}
            {parsed.isExam && <span className="qa-chip qa-chip-exam">Exam</span>}
            <span className="nb-parsed-note">— saved as “{cleanTask || "…"}”</span>
          </div>
        )}
      </div>
      <div className="nb-field">
        <label htmlFor="nb-desc">Description</label>
        <textarea
          id="nb-desc"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="Optional notes..."
        />
      </div>
      <div className="nb-field">
        <label>Priority</label>
        <div className="priority-row" role="radiogroup" aria-label="Priority">
          {PRIORITIES.map((p) => (
            <React.Fragment key={p}>
              <input
                type="radio"
                id={"prio-" + p}
                name="prio"
                value={p}
                checked={priority === p}
                onChange={() => setPriority(p)}
              />
              <label htmlFor={"prio-" + p}>
                <span className={"pt-prio pt-prio-static " + p} />
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
      <div className="nb-field nb-exam-field">
        <label className="nb-exam-check" htmlFor="nb-exam">
          <input
            id="nb-exam"
            type="checkbox"
            checked={isExam}
            onChange={(e) => setIsExam(e.target.checked)}
          />
          <span className="exam-dot" aria-hidden="true" />
          Mark this day as an exam
        </label>
      </div>
      <div className="nb-form-actions">
        <Button type="submit" variant="primary">Pin to Board</Button>
        <Button type="button" variant="ghost" className="btn-ghost-light" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default NotebookForm;
