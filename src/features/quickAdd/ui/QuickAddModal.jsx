import React from "react";
import Modal from "../../../components/ui/Modal";
import QuickAddInput from "./QuickAddInput";

const QuickAddModal = ({ open, onClose, onMoreOptions }) => (
  <Modal open={open} onClose={onClose} labelledBy="qa-title">
    <h2 id="qa-title">Quick add</h2>
    <QuickAddInput onSubmitted={onClose} onMoreOptions={onMoreOptions} />
  </Modal>
);

export default QuickAddModal;
