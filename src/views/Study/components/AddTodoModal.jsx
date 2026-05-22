import React, { useState } from 'react';
import Modal from '../../../components/ui/Modal';
import ConfirmDialog from '../../../components/ui/ConfirmDialog';
import NotebookForm from './NotebookForm';
import { useTodos } from '../../../context/TodoContext';
import { useExams } from '../../../context/ExamContext';
import { useToast } from '../../../context/ToastContext';
import { dateToday } from '../../../data/mockDB';

// "2026-05-15" → "May 15". Used so a non-today date in the toast is unambiguous.
const fmtDate = (key) => {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, { month: "short", day: "numeric" });
};

const AddTodoModal = ({ open, onClose }) => {
  const { addTodo } = useTodos();
  const { setExam } = useExams();
  const { push } = useToast();
  const [dirty, setDirty] = useState(false);
  const [pendingDiscard, setPendingDiscard] = useState(false);

  const submit = async (data) => {
    const { isExam, ...todo } = data;
    await addTodo(todo);
    if (isExam) setExam(todo.date, todo.task);
    const when = todo.date === dateToday() ? "today" : fmtDate(todo.date);
    push({ message: isExam ? `Exam added for ${when}` : `Task added for ${when}` });
    setDirty(false);
    onClose && onClose();
  };

  const requestClose = () => {
    if (pendingDiscard) return;
    if (dirty) { setPendingDiscard(true); return; }
    onClose && onClose();
  };

  const confirmDiscard = () => {
    setDirty(false);
    setPendingDiscard(false);
    onClose && onClose();
  };

  return (
    <>
      <Modal open={open} onClose={requestClose} labelledBy="add-todo-title">
        <h2 id="add-todo-title">New task</h2>
        <NotebookForm
          onSubmit={submit}
          onCancel={requestClose}
          onDirty={setDirty}
        />
      </Modal>
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

export default AddTodoModal;
