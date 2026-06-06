import React, { useState } from "react";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";
import ConfirmDialog from "../../../components/ui/ConfirmDialog";
import TaskFormModal from "./TaskFormModal";
import { useTodos } from "../../../context/TodoContext";
import { dateToday } from "../../../data/mockDB";

// "2026-05-15" → "May 15". Shown on non-today rows so the day is unambiguous.
const fmtDate = (key) => {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
};

const Notebook = ({ open, onClose }) => {
  const { todos, toggleTodo, deleteTodo } = useTodos();
  const today = dateToday();

  // Show every task — not just today's — so future (and past) tasks can be
  // edited. Sorted by date, with completed items sinking within each day.
  const sorted = todos
    .slice()
    .sort(
      (a, b) =>
        a.date.localeCompare(b.date) ||
        Number(a.completed) - Number(b.completed) ||
        b.createdAt - a.createdAt,
    );
  const groups = [
    {
      key: "today",
      label: "Today",
      items: sorted.filter((t) => t.date === today),
    },
    {
      key: "upcoming",
      label: "Upcoming",
      items: sorted.filter((t) => t.date > today),
    },
    {
      key: "earlier",
      label: "Earlier",
      items: sorted.filter((t) => t.date < today),
    },
  ].filter((g) => g.items.length);

  const todays = todos.filter((t) => t.date === today);

  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);

  const requestCloseModal = () => {
    if (pendingDelete || editing || showAdd) return;
    onClose && onClose();
  };

  return (
    <>
      <Modal open={open} onClose={requestCloseModal} labelledBy="nb-title">
        <h2 id="nb-title">My Tasks</h2>
        <p className="muted nb-summary">
          {todays.length} for today · {todays.filter((t) => t.completed).length}{" "}
          done
        </p>
        <div className="nb-add">
          <Button variant="primary" onClick={() => setShowAdd(true)}>
            + New task
          </Button>
        </div>

        {groups.length === 0 && (
          <p className="nb-empty nb-empty-block">
            Nothing yet — add your first task.
          </p>
        )}

        <div className="nb-scroll">
          {groups.map((g) => (
            <section key={g.key} className="nb-group">
              <h3 className="nb-group-title">
                {g.label}
                <span className="nb-group-count">{g.items.length}</span>
              </h3>
              <ul className="nb-list" aria-label={g.label + " tasks"}>
                {g.items.map((t) => (
                  <li key={t.id} className={t.completed ? "done" : ""}>
                    <button
                      className={"nb-check " + (t.completed ? "checked" : "")}
                      role="checkbox"
                      aria-checked={t.completed}
                      aria-label={"Toggle " + t.task}
                      onClick={() => toggleTodo(t.id)}
                    >
                      {t.completed ? "✓" : ""}
                    </button>
                    <div className="nb-task">
                      {t.task}
                      {g.key !== "today" && (
                        <span className="nb-when">{fmtDate(t.date)}</span>
                      )}
                      {t.description && (
                        <span className="nb-desc">{t.description}</span>
                      )}
                    </div>
                    <span
                      className={
                        "pt-prio pt-prio-static nb-prio " +
                        (t.priority || "normal")
                      }
                      aria-hidden="true"
                    />
                    <button
                      className="nb-edit"
                      aria-label={"Edit " + t.task}
                      onClick={() => setEditing(t)}
                    >
                      ✎
                    </button>
                    <button
                      className="nb-del"
                      aria-label={"Delete " + t.task}
                      onClick={() => setPendingDelete(t)}
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </Modal>
      <TaskFormModal open={showAdd} onClose={() => setShowAdd(false)} />
      <TaskFormModal
        open={!!editing}
        editing={editing}
        onClose={() => setEditing(null)}
      />
      <ConfirmDialog
        open={!!pendingDelete}
        title="Vols eliminar aquesta tasca?"
        message="S'esborrarà de la pissarra."
        cancelLabel="Conservar"
        confirmLabel="Eliminar"
        danger
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          const id = pendingDelete && pendingDelete.id;
          setPendingDelete(null);
          if (id) deleteTodo(id);
        }}
      />
    </>
  );
};

export default Notebook;
