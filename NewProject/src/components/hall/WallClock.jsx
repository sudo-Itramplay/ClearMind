import React from 'react';
import { useClock } from '../../hooks/useClock';

const fmtClock = (now) => {
  const h = now.getHours();
  const m = now.getMinutes();
  return String(h % 12 || 12) + ":" + String(m).padStart(2, "0") + " " + (h >= 12 ? "PM" : "AM");
};

const WallClock = () => {
  const now = useClock(1000);
  const h = now.getHours() % 12;
  const m = now.getMinutes();
  const s = now.getSeconds();
  const hourAngle = (h + m / 60) * 30;
  const minAngle = (m + s / 60) * 6;
  const secAngle = s * 6;

  const ticks = [];
  for (let i = 0; i < 60; i++) {
    const isHour = i % 5 === 0;
    ticks.push(
      <line
        key={i}
        x1="60" y1={isHour ? 8 : 10}
        x2="60" y2={isHour ? 14 : 12}
        stroke={isHour ? "#3A271A" : "#7A5C44"}
        strokeWidth={isHour ? 2 : 1}
        strokeLinecap="round"
        transform={`rotate(${i * 6} 60 60)`}
      />
    );
  }

  return (
    <div className="clock" data-time={fmtClock(now)} role="timer" aria-live="polite">
      <span className="sr-only">Current time {fmtClock(now)}</span>
      <svg width="110" height="110" viewBox="0 0 120 120" aria-hidden="true">
        <defs>
          <radialGradient id="face" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#FBF1DD" />
            <stop offset="100%" stopColor="#E8D4B6" />
          </radialGradient>
          <radialGradient id="rim" cx="50%" cy="50%" r="50%">
            <stop offset="80%" stopColor="#5A3F28" />
            <stop offset="100%" stopColor="#2C1B0E" />
          </radialGradient>
        </defs>
        <circle cx="60" cy="60" r="58" fill="url(#rim)" />
        <circle cx="60" cy="60" r="50" fill="url(#face)" stroke="#8B6F5C" strokeWidth="1" />
        {ticks}
        <line x1="60" y1="60" x2="60" y2="32" stroke="#3A271A" strokeWidth="4" strokeLinecap="round" transform={`rotate(${hourAngle} 60 60)`} />
        <line x1="60" y1="60" x2="60" y2="22" stroke="#3A271A" strokeWidth="3" strokeLinecap="round" transform={`rotate(${minAngle} 60 60)`} />
        <line x1="60" y1="64" x2="60" y2="20" stroke="#D4763A" strokeWidth="1.5" strokeLinecap="round" transform={`rotate(${secAngle} 60 60)`} />
        <circle cx="60" cy="60" r="3.5" fill="#3A271A" />
        <circle cx="60" cy="60" r="1.2" fill="#D4A574" />
      </svg>
    </div>
  );
};

export default WallClock;
