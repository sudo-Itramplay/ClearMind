import React from 'react';
import { useSoundCtx } from '../../context/SoundContext';

const Door = ({ kind, label, glowColor, onClick }) => {
  const { play } = useSoundCtx();
  const handleEnter = () => { try { play && play("creak"); } catch (e) {} };
  const handleClick = () => {
    try { play && play("click"); } catch (e) {}
    onClick && onClick();
  };
  return (
    <div className={`door-wrap door-wrap-${kind}`} onMouseEnter={handleEnter}>
      <button
        type="button"
        className="door"
        style={{ "--door-glow": glowColor }}
        aria-label={`Enter ${label}`}
        onClick={handleClick}
      >
        <span className="door-glow" aria-hidden="true" />
      </button>
      <div className="plaque">{label}</div>
    </div>
  );
};

export default Door;
