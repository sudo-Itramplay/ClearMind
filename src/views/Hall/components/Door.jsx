import React from 'react';
import { useSoundCtx } from '../../../context/SoundContext';

const DOOR_ICONS = {
  study: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4.5A1.5 1.5 0 015.5 3H11v15H5.5A1.5 1.5 0 014 16.5v-12z" />
      <path d="M20 4.5A1.5 1.5 0 0018.5 3H13v15h5.5a1.5 1.5 0 001.5-1.5v-12z" />
      <path d="M4 18.5A2.5 2.5 0 016.5 21H20" />
      <path d="M20 21a2.5 2.5 0 00-2.5-2.5H13" />
    </svg>
  ),
  meditate: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="6" r="2.4" />
      <path d="M12 8.5v5" />
      <path d="M5 19c1.5-2.5 3.5-4 7-4s5.5 1.5 7 4" />
      <path d="M8.5 13.5c-1.8 0-3.3 1-4.5 3" />
      <path d="M15.5 13.5c1.8 0 3.3 1 4.5 3" />
    </svg>
  ),
};

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
        <span className="door-icon" aria-hidden="true">{DOOR_ICONS[kind]}</span>
        <span className="door-inline-label">{label}</span>
      </button>
      <div className="plaque">{label}</div>
    </div>
  );
};

export default Door;
