import React, { useEffect, useRef } from "react";
import Button from "../../../components/ui/Button";
import { useQuickAdd } from "./useQuickAdd";
import "./quickAdd.css";

const PRIO_LABEL = { high: "P1", normal: "P2", low: "P3" };

// Static cheat-sheet content. Mirrors quickAddConfig.js so users discover
// the keyword surface without having to read source.
const CHEAT_SHEET = [
  { title: "Priority", items: [
    { kw: "p1", note: "high" },
    { kw: "p2", note: "normal" },
    { kw: "p3 / p4", note: "low" },
  ]},
  { title: "Date", items: [
    { kw: "today / tdy", note: "today" },
    { kw: "tomorrow / tmrw", note: "+1 day" },
    { kw: "mn tu we th fr sa su", note: "this week's weekday" },
    { kw: "nxmn … nxsu", note: "the one after" },
  ]},
  { title: "Exam", items: [
    { kw: "exam", note: "flag the day as an exam" },
  ]},
];

const QuickAddInput = ({ onSubmitted, onMoreOptions, autoFocus = true }) => {
  const inputRef = useRef(null);
  const { text, setText, parsed, canSubmit, submit } = useQuickAdd({
    onAdded: () => onSubmitted && onSubmitted(),
  });

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  const handleKey = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div className="qa-root">
      <p className="qa-tip">
        Tip: press <kbd>Q</kbd> from anywhere in the Study room to open this.
      </p>

      <input
        ref={inputRef}
        className="qa-input"
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKey}
        placeholder="e.g. Read chapter 4 p1 nxmn"
        aria-label="Quick add a task"
      />

      <div className="qa-preview" aria-live="polite">
        {parsed.priority && (
          <span className={`qa-chip qa-chip-prio prio-${parsed.priority}`}>
            {PRIO_LABEL[parsed.priority]}
          </span>
        )}
        {parsed.date && (
          <span className="qa-chip qa-chip-date">{parsed.date}</span>
        )}
        {parsed.isExam && (
          <span className="qa-chip qa-chip-exam">Exam</span>
        )}
        {!parsed.priority && !parsed.date && !parsed.isExam && (
          <span className="qa-hint">No priority or date detected — defaults are P2 + today.</span>
        )}
      </div>

      <div className="qa-actions">
        <Button
          type="button"
          variant="primary"
          disabled={!canSubmit}
          onClick={submit}
        >
          Add (Enter)
        </Button>
        {onMoreOptions && (
          <button type="button" className="qa-more" onClick={onMoreOptions}>
            More options
          </button>
        )}
      </div>

      <details className="qa-cheats">
        <summary>Keyword shortcuts</summary>
        <div className="qa-cheats-grid">
          {CHEAT_SHEET.map((group) => (
            <div key={group.title} className="qa-cheats-col">
              <h4>{group.title}</h4>
              <ul>
                {group.items.map((it) => (
                  <li key={it.kw}>
                    <code>{it.kw}</code>
                    <span>{it.note}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </details>
    </div>
  );
};

export default QuickAddInput;
