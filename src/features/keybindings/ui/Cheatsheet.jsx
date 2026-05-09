import React from "react";
import Modal from "../../../components/ui/Modal";
import { groupKeymap, KEYMAP } from "../config/keymapConfig";
import "./keybindings.css";

// Pretty-print key strings. "gh" -> "g h", "?" -> "?".
const renderKeys = (keys) =>
  keys.length === 1 ? [keys] : keys.split("").map((k) => k);

const Cheatsheet = ({ open, onClose, keymap = KEYMAP }) => {
  const groups = groupKeymap(keymap);
  return (
    <Modal open={open} onClose={onClose} labelledBy="kb-cheatsheet-title">
      <h2 id="kb-cheatsheet-title">Keyboard shortcuts</h2>
      <p className="kb-cheats-intro">
        Vim-style navigation. Hold <kbd>Shift</kbd> for capitals (e.g.{" "}
        <kbd>?</kbd>, <kbd>G</kbd>). Bindings are disabled while typing.
      </p>

      <div className="kb-cheats-groups">
        {Object.entries(groups).map(([group, items]) => (
          <section key={group} className="kb-cheats-group">
            <h3>{group}</h3>
            <ul>
              {items.map((b) => (
                <li key={b.id}>
                  <span className="kb-keys">
                    {renderKeys(b.keys).map((k, i) => (
                      <kbd key={i}>{k}</kbd>
                    ))}
                  </span>
                  <span className="kb-desc">{b.description}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </Modal>
  );
};

export default Cheatsheet;
