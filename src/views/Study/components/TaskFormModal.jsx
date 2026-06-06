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

// Single form used for both creating a task and editing an existing one.
// Pass `editing` (a todo) to switch into edit mode; omit it to add.
const TaskFormModal = ({ open, onClose, editing }) => {
  const { addTodo, updateTodo } = useTodos();
  const { exams, setExam, removeExam } = useExams();
  const { push } = useToast();
  const [dirty, setDirty] = useState(false);
  const [pendingDiscard, setPendingDiscard] = useState(false);

  const isEdit = !!editing;
  // In edit mode the exam checkbox reflects whether the task's day is an exam.
  const initial = editing ? { ...editing, isExam: editing.date in exams } : undefined;

  const submit = async (data) => {
    const { isExam, ...todo } = data;
    if (isEdit) {
      await updateTodo(editing.id, todo);
      // Exam is a property of the day, so apply it to the (possibly new) date.
      if (isExam) setExam(todo.date, todo.task);
      else if (editing.date in exams) removeExam(editing.date);
      push({ message: "Task updated" });
    } else {
      await addTodo(todo);
      if (isExam) setExam(todo.date, todo.task);
      const when = todo.date === dateToday() ? "today" : fmtDate(todo.date);
      push({ message: isExam ? `Exam added for ${when}` : `Task added for ${when}` });
    }
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
      <Modal open={open} onClose={requestClose} labelledBy="task-form-title">
        <h2 id="task-form-title">{isEdit ? "Edit task" : "New task"}</h2>
        <NotebookForm
          key={editing ? editing.id : "new"}
          initial={initial}
          submitLabel={isEdit ? "Save changes" : "Pin to Board"}
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

export default TaskFormModal;
