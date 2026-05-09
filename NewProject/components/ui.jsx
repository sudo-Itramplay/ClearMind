// Updated UI primitives: Button, Modal (with focus trap), VisuallyHidden, BackButton, Loader

const Button = ({ variant = "primary", pill, children, className = "", sound = "click", onClick, ...props }) => {
  const { play } = (typeof useSoundCtx === "function" ? useSoundCtx() : { play: () => {} }) || {};
  const cls = ["btn", `btn-${variant}`, pill ? "btn-pill" : "", className].join(" ").trim();
  const handle = (e) => { play && play(sound); onClick && onClick(e); };
  return <button className={cls} onClick={handle} {...props}>{children}</button>;
};

const VisuallyHidden = ({ children }) => <span className="sr-only">{children}</span>;

const Loader = ({ label = "Loading" }) => (
  <div role="status" aria-live="polite" style={{ textAlign: "center" }}>
    <div className="loader" aria-hidden="true" />
    <span className="sr-only">{label}</span>
  </div>
);

const Modal = ({ open, onClose, children, labelledBy }) => {
  const ref = React.useRef(null);
  const triggerRef = React.useRef(null);
  if (typeof useFocusTrap === "function") useFocusTrap(ref, open);

  React.useEffect(() => {
    if (open) {
      triggerRef.current = document.activeElement;
    } else if (triggerRef.current && triggerRef.current.focus) {
      triggerRef.current.focus();
    }
  }, [open]);

  React.useEffect(() => {
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

const BackButton = ({ onClick }) => (
  <button className="back-btn" onClick={onClick} aria-label="Back to Hall">
    <span aria-hidden="true">←</span>
    <span>Hall</span>
  </button>
);

Object.assign(window, { Button, Modal, VisuallyHidden, Loader, BackButton });
