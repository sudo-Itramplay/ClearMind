import React from "react";
import "./keybindings.css";

// Floating "?" affordance — visual entry point for users who don't know
// keyboard shortcuts exist. Pressing the `?` key does the same thing.
const CheatsheetButton = ({ onClick }) => (
  <button
    type="button"
    className="kb-help-btn"
    onClick={onClick}
    aria-label="Show keyboard shortcuts"
    title="Keyboard shortcuts (?)"
  >
    ?
  </button>
);

export default CheatsheetButton;
