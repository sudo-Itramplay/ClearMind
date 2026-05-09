import React from 'react';
import Modal from './Modal';
import Button from './Button';

const ConfirmDialog = ({
  open,
  title,
  message,
  cancelLabel = "Cancel",
  confirmLabel = "Confirm",
  danger = false,
  onCancel,
  onConfirm,
}) => (
  <Modal open={open} onClose={onCancel} labelledBy="confirm-title">
    <h2 id="confirm-title" className="confirm-title">{title}</h2>
    {message && <p className="confirm-message">{message}</p>}
    <div className="confirm-actions">
      <Button variant="ghost" className="btn-ghost-light" onClick={onCancel}>
        {cancelLabel}
      </Button>
      <Button variant={danger ? "danger" : "secondary"} onClick={onConfirm}>
        {confirmLabel}
      </Button>
    </div>
  </Modal>
);

export default ConfirmDialog;
