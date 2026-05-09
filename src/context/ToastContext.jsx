import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

const ToastCtx = createContext(null);

export const useToast = () => useContext(ToastCtx);

let _id = 0;

const Toast = ({ toast, onDismiss }) => {
  useEffect(() => {
    const t = setTimeout(onDismiss, toast.duration);
    return () => clearTimeout(t);
  }, [toast, onDismiss]);

  return (
    <div className={"toast toast-" + (toast.kind || "success")} role="status" aria-live="polite">
      <span className="toast-icon" aria-hidden="true">
        {toast.kind === "error" ? "!" : "✓"}
      </span>
      <span className="toast-msg">{toast.message}</span>
    </div>
  );
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const dismiss = useCallback((id) => {
    setToasts((arr) => arr.filter((t) => t.id !== id));
  }, []);

  const push = useCallback((t) => {
    const id = ++_id;
    setToasts((arr) => [...arr, { id, kind: "success", duration: 3000, ...t }]);
  }, []);

  return (
    <ToastCtx.Provider value={{ push }}>
      {children}
      <div className="toast-viewport" aria-live="polite">
        {toasts.map((t) => (
          <Toast key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
        ))}
      </div>
    </ToastCtx.Provider>
  );
};
