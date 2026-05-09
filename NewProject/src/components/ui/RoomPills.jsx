import React from 'react';

const PILL_ORDER = ["study", "hall", "meditate"];

const RoomPills = ({ page, go, order = PILL_ORDER }) => (
  <nav className="room-pills" aria-label="Rooms">
    {order.map((r) => (
      <button
        key={r}
        type="button"
        onClick={() => go(r)}
        aria-current={page === r ? "page" : undefined}
        aria-label={`Go to ${r}`}
      >
        {r}
      </button>
    ))}
  </nav>
);

export default RoomPills;
