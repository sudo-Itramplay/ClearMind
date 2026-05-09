import React, { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import ConfirmDialog from '../ui/ConfirmDialog';
import NotebookForm from './NotebookForm';
import { useTodos } from '../../context/TodoContext';
import { dateToday } from '../../data/mockDB';

const Notebook = ({ open, onClose }) => {
  const { todos, addTodo, toggleTodo, deleteTodo } = useTodos();
  const today = dateToday();

  const list = todos
    .filter((t) => t.date === today)
    .sort((a, b) => Number(a.completed) - Number(b.completed) || b.createdAt - a.createdAt);

  const [showForm, setShowForm] = useState(false);
  const [formDirty, setFormDirty] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [pendingDiscard, setPendingDiscard] = useState(false);

  const submit = async (data) => {
    await addTodo(data);
    setFormDirty(false);
    setShowForm(false);
  };

  const requestCloseForm = () => {
    if (formDirty) setPendingDiscard(true);
    else setShowForm(false);
  };

  const requestCloseModal = () => {
    if (pendingDelete || pendingDiscard) return;
    if (showForm && formDirty) { setPendingDiscard(true); return; }
    onClose && onClose();
  };

  const confirmDiscard = () => {
    setShowForm(false);
    setFormDirty(false);
    setPendingDiscard(false);
  };

  return (
    <>
      <Modal open={open} onClose={requestCloseModal} labelledBy="nb-title">
        <h2 id="nb-title">My Tasks</h2>
        <p className="muted nb-summary">
          {list.length} for today · {list.filter((t) => t.completed).length} done
        </p>
        {!showForm && (
          <div className="nb-add">
            <Button variant="primary" onClick={() => setShowForm(true)}>+ New task</Button>
          </div>
        )}
        {showForm && (
          <NotebookForm
            onSubmit={submit}
            onCancel={requestCloseForm}
            onDirty={setFormDirty}
          />
        )}
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
      <ConfirmDialog
        open={pendingDiscard}
        title="Descartar canvis?"
        message="Hi ha canvis sense guardar al formulari."
        cancelLabel="Seguir editant"
        confirmLabel="Descartar"
        onCancel={() => setPendingDiscard(false)}
        onConfirm={confirmDiscard}
      />
    </>
  );
};

export default Notebook;
