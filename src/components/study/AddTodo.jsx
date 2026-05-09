import React, { useState } from "react";

// 11 stable positions for postits on the corkboard. Postits cycle through them.
const POSITIONS = [
  { x: 4, y: 6, r: -3 },
  { x: 22, y: 12, r: 2 },
  { x: 40, y: 4, r: -1 },
  { x: 58, y: 14, r: 3 },
  { x: 76, y: 6, r: -2 },
  { x: 8, y: 50, r: 4 },
  { x: 28, y: 56, r: -2 },
  { x: 48, y: 52, r: 1 },
  { x: 68, y: 56, r: -3 },
  { x: 4, y: 28, r: 2 },
  { x: 76, y: 30, r: -2 },
];
export const POSTIT_SLOTS = POSITIONS.length;

const AddTodo = ({ position }) => {
  const pos = POSITIONS[position % POSITIONS.length];

  const cls = [
    "adding button",
    dropping ? "dropping" : "",
    bouncing ? "bouncing" : "",
  ]
    .join(" ")
    .trim();

  const handle = () => {
    // Adding todo logic
    onClick;
  };

  const style = {
    left: `${pos.x}%`,
    top: `${pos.y}%`,
    transform: `rotate(${pos.r}deg)`,
    "--r": `${pos.r}deg`,
  };

  return (
    <button
      className={cls}
      style={style}
      role="checkbox"
      aria-checked={note.completed}
      aria-label={`${note.task} — ${note.priority} priority — ${note.completed ? "completed" : "not completed"}`}
      onClick={handle}
      onKeyDown={(e) => {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          handle();
        }
      }}
    >
      <span
        className={"pt-prio " + (note.priority || "normal")}
        aria-hidden="true"
      />
      <span className="pt-text">{note.task}</span>
    </button>
  );
};

export default AddTodo;
