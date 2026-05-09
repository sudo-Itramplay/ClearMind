import React, { useEffect, useState } from 'react';
import Button from '../ui/Button';
import { dateToday } from '../../data/mockDB';

const PRIORITIES = ["low", "normal", "high"];

const NotebookForm = ({ onSubmit, onCancel, onDirty }) => {
  const [task, setTask] = useState("");
  const [desc, setDesc] = useState("");
  const [priority, setPriority] = useState("normal");
  const [date, setDate] = useState(dateToday());
  const [error, setError] = useState(null);

  const dirty = !!(task.trim() || desc.trim());
  useEffect(() => { onDirty && onDirty(dirty); }, [dirty, onDirty]);

  const submit = (e) => {
    e.preventDefault();
    if (!task.trim()) { setError("Task is required."); return; }
    onSubmit({ task: task.trim(), description: desc.trim(), priority, date });
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
          placeholder="What's on your mind?"
        />
        {error && <span id="nb-task-err" className="nb-error" role="alert">{error}</span>}
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
