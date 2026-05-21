import React, { useState } from 'react';
import { useSoundCtx } from '../../context/SoundContext';

const SoundToggle = () => {
  const { enabled, toggle, masterVolume, setMasterVolume } = useSoundCtx();
  const [lastVolume, setLastVolume] = useState(0.5);

  const isMuted = !enabled || masterVolume === 0;

  const handleSliderChange = (e) => {
    const val = parseFloat(e.target.value);
    setMasterVolume(val);
    
    if (val > 0) {
      setLastVolume(val);
      if (!enabled) toggle();
    } else {
      if (enabled) toggle();
    }
  };

  const handleButtonClick = () => {
    if (isMuted) {
      setMasterVolume(lastVolume > 0 ? lastVolume : 0.5);
      if (!enabled) toggle();
    } else {
      setMasterVolume(0);
      if (enabled) toggle();
    }
  };

  const handleMouseLeave = () => {
    if (document.activeElement) {
      document.activeElement.blur();
    }
  };

  return (
    <div 
      className="sound-toggle-wrapper" 
      onMouseLeave={handleMouseLeave} // <-- AFEGIT AQUÍ
    >
      <div className="volume-slider-container">
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={isMuted ? 0 : masterVolume}
          onChange={handleSliderChange}
          className="volume-slider"
          aria-label="Ajustar volum general"
          title="Ajustar volum"
        />
      </div>

      <button
        className={"sound-toggle " + (!isMuted ? "on" : "")}
        onClick={handleButtonClick}
        aria-label={isMuted ? "Activar sons" : "Mutejar sons"}
        aria-pressed={!isMuted}
        title={isMuted ? "Sounds off" : "Sounds on"}
      >
        {isMuted ? "🔇" : "🔊"}
      </button>
    </div>
  );
};

export default SoundToggle;