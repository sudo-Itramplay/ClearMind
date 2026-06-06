import React, {
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";
import { QuickAddModal } from "../../../features/quickAdd";
import { useKeyAction } from "../../../features/keybindings";
import TaskFormModal from "./TaskFormModal";

// Orchestrates the two task-entry modes (quick / full). The "Q" hotkey is
// declared globally in keymapConfig — we just register the handler here,
// where openQuick is in scope. So the binding is only active while Study
// is mounted, which is exactly what we want.

const Ctx = createContext(null);
export const useTodoEntry = () => useContext(Ctx);

export const TodoEntryProvider = ({ children }) => {
  const [mode, setMode] = useState(null); // "quick" | "full" | null

  const openQuick = useCallback(() => setMode("quick"), []);
  const openFull = useCallback(() => setMode("full"), []);
  const close = useCallback(() => setMode(null), []);

  // Suppress the `q` shortcut while a modal is already up so the key
  // reaches the focused input as a normal character.
  useKeyAction("openQuickAdd", () => {
    if (mode === null) openQuick();
  });

  return (
    <Ctx.Provider value={{ openQuick, openFull, close, mode }}>
      {children}
      <QuickAddModal
        open={mode === "quick"}
        onClose={close}
        onMoreOptions={openFull}
      />
      <TaskFormModal open={mode === "full"} onClose={close} />
    </Ctx.Provider>
  );
};
