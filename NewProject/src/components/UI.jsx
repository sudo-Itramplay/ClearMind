import React, { useRef, useEffect } from 'react';
import { useSoundCtx } from '../context/AppContext';
import { useFocusTrap } from '../context/AppContext';

export const Button = ({ variant = "primary", pill, children, className = "", sound = "click", onClick, ...props }) => {
  const { play } = useSoundCtx();
  const cls = ["btn", `btn-${variant}`, pill ? "btn-pill" : "", className].join(" ").trim();
  const handle = (e) => { play && play(sound); onClick && onClick(e); };
  return <button className={cls} onClick={handle} {...props}>{children}</button>;
};

export const VisuallyHidden = ({ children }) => <span className="sr-only">{children}</span>;

export const Loader = ({ label = "Loading" }) => (
  <div role="status" aria-live="polite" style={{ textAlign: "center" }}>
    <div className="loader" aria-hidden="true" />
    <span className="sr-only">{label}</span>
  </div>
);

export const Modal = ({ open, onClose, children, labelledBy }) => {
  const ref = useRef(null);
  const triggerRef = useRef(null);
  useFocusTrap(ref, open);

  useEffect(() => {
    if (open) {
      triggerRef.current = document.activeElement;
    } else if (triggerRef.current && triggerRef.current.focus) {
      triggerRef.current.focus();
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") onClose?.(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div
        ref={ref}
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose} aria-label="Close dialog">×</button>
        {children}
      </div>
    </div>
  );
};

export const BackButton = ({ onClick }) => (
  <button className="back-btn" onClick={onClick} aria-label="Back to Hall">
    <span aria-hidden="true">←</span>
    <span>Hall</span>
  </button>
);
