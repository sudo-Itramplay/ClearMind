import React, { useState } from 'react';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';
import ConfirmDialog from '../../../components/ui/ConfirmDialog';
import AddTodoModal from './AddTodoModal';
import { useTodos } from '../../../context/TodoContext';
import { dateToday } from '../../../data/mockDB';

const Notebook = ({ open, onClose }) => {
  const { todos, toggleTodo, deleteTodo } = useTodos();
  const today = dateToday();

  const list = todos
    .filter((t) => t.date === today)
    .sort((a, b) => Number(a.completed) - Number(b.completed) || b.createdAt - a.createdAt);

  const [showAdd, setShowAdd] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);

  const requestCloseModal = () => {
    if (pendingDelete) return;
    onClose && onClose();
  };

  return (
    <>
      <Modal open={open} onClose={requestCloseModal} labelledBy="nb-title">
        <h2 id="nb-title">My Tasks</h2>
        <p className="muted nb-summary">
          {list.length} for today · {list.filter((t) => t.completed).length} done
        </p>
        <div className="nb-add">
          <Button variant="primary" onClick={() => setShowAdd(true)}>+ New task</Button>
        </div>
        <ul className="nb-list" aria-label="Today's tasks">
          {list.length === 0 && (
            <li className="nb-empty">Nothing yet — add your first task.</li>
          )}
          {list.map((t) => (
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
                {t.description && <span className="nb-desc">{t.description}</span>}
              </div>
              <span className={"pt-prio pt-prio-static nb-prio " + (t.priority || "normal")} aria-hidden="true" />
              <button className="nb-del" aria-label={"Delete " + t.task} onClick={() => setPendingDelete(t)}>×</button>
            </li>
          ))}
        </ul>
      </Modal>
      <AddTodoModal open={showAdd} onClose={() => setShowAdd(false)} />
      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete task?"
        message="It will be erased from the board."
        cancelLabel="Preserve"
        confirmLabel="Delete"
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
