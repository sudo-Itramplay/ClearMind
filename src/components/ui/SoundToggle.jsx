import React from 'react';
import { useSoundCtx } from '../../context/SoundContext';

const SoundToggle = () => {
  const { enabled, toggle } = useSoundCtx();
  return (
    <button
      className={"sound-toggle " + (enabled ? "on" : "")}
      onClick={toggle}
      aria-label={enabled ? "Mute sounds" : "Enable sounds"}
      aria-pressed={enabled}
      title={enabled ? "Sounds on" : "Sounds off"}
    >
      {enabled ? "🔊" : "🔇"}
    </button>
  );
};

export default SoundToggle;
