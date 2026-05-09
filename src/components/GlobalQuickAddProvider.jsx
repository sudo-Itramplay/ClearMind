import React, { createContext, useContext, useState, useCallback } from "react";
import { QuickAddModal } from "../../features/quickAdd";
import { useKeyAction } from "../../features/keybindings";

const Ctx = createContext(null);
export const useGlobalQuickAdd = () => useContext(Ctx);

export const GlobalQuickAddProvider = ({ children }) => {
  const [open, setOpen] = useState(false);

  const openModal = useCallback(() => setOpen(true), []);
  const closeModal = useCallback(() => setOpen(false), []);

  useKeyAction("openQuickAddGlobal", () => {
    if (!open) openModal();
  });

  return (
    <Ctx.Provider value={{ openModal, closeModal }}>
      {children}
      <QuickAddModal open={open} onClose={closeModal} />
    </Ctx.Provider>
  );
};
