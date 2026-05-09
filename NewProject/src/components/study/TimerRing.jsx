import React from 'react';

const TimerRing = ({
  time,
  percent = 0,
  done = false,
  paled = false,
  showProgress = true,
}) => {
  const c = 80;
  const r = 70;
  const circ = 2 * Math.PI * r;
  const cls = ["timer-ring", done ? "timer-done" : "", paled ? "timer-paled" : ""]
    .filter(Boolean).join(" ");

  return (
    <div className={cls} aria-hidden="true">
      <svg viewBox="0 0 160 160" preserveAspectRatio="xMidYMid meet">
        <defs>
          <radialGradient id="bezel" cx="50%" cy="50%" r="50%">
            <stop offset="78%" stopColor="#6B4E3D" />
            <stop offset="100%" stopColor="#2C1B0E" />
          </radialGradient>
        </defs>
        <circle cx={c} cy={c} r={r + 8} fill="url(#bezel)" />
        <circle cx={c} cy={c} r={r + 1} fill="#1a120a" />
        {showProgress && (
          <>
            <circle
              cx={c} cy={c} r={r - 4}
              fill="none"
              stroke="rgba(245,230,211,0.10)"
              strokeWidth="3"
            />
            <circle
              cx={c} cy={c} r={r - 4}
              fill="none"
              stroke="#D4A574"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={circ}
              strokeDashoffset={circ * (1 - percent)}
              transform={`rotate(-90 ${c} ${c})`}
              className="timer-progress"
            />
          </>
        )}
      </svg>
      <div className="timer-center">
        <span className="timer-time mono">{time}</span>
      </div>
    </div>
  );
};

export default TimerRing;
