import { useMemo, useState } from "react";
import { useTodos } from "../../../context/TodoContext";
import { useToast } from "../../../context/ToastContext";
import { dateToday } from "../../../data/mockDB";
import { QUICK_ADD_CONFIG } from "../config/quickAddConfig";
import { realClock } from "../domain/clock";
import { parseQuickInput } from "../domain/parseQuickInput";

const DEFAULT_PRIORITY = "normal";

// "2026-05-15" → "May 15" so a non-today date in the toast is unambiguous.
const fmtDate = (key) => {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
};

export const useQuickAdd = ({ clock = realClock, onAdded } = {}) => {
  const { addTodo } = useTodos();
  const { push } = useToast();
  const [text, setText] = useState("");

  const parsed = useMemo(
    () => parseQuickInput(text, QUICK_ADD_CONFIG, clock),
    [text, clock]
  );

  const canSubmit = parsed.task.length > 0;

  const submit = async () => {
    if (!canSubmit) return null;
    const data = {
      task: parsed.task,
      description: "",
      priority: parsed.priority || DEFAULT_PRIORITY,
      date: parsed.date || dateToday(),
    };
    const todo = await addTodo(data);
    const when = data.date === dateToday() ? "today" : fmtDate(data.date);
    push({ message: `Task added for ${when}` });
    setText("");
    onAdded && onAdded(todo);
    return todo;
  };

  const reset = () => setText("");

  return { text, setText, parsed, canSubmit, submit, reset };
};
