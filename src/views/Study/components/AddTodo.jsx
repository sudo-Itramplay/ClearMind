import React, { useState } from 'react';
import AddTodoModal from './AddTodoModal';

// Mirror Postit's POSITIONS so AddTodo lands on the same slot grid.
const POSITIONS = [
  { x: 4,  y: 6,  r: -3 }, { x: 22, y: 12, r: 2 },  { x: 40, y: 4,  r: -1 },
  { x: 58, y: 14, r: 3 },  { x: 76, y: 6,  r: -2 }, { x: 8,  y: 50, r: 4 },
  { x: 28, y: 56, r: -2 }, { x: 48, y: 52, r: 1 },  { x: 68, y: 56, r: -3 },
  { x: 4,  y: 28, r: 2 },  { x: 76, y: 30, r: -2 },
];

const AddTodo = ({ position = 0 }) => {
  const [open, setOpen] = useState(false);
  const pos = POSITIONS[position % POSITIONS.length];

  const style = {
    left: `${pos.x}%`,
    top: `${pos.y}%`,
    transform: `rotate(${pos.r}deg)`,
    "--r": `${pos.r}deg`,
  };

  return (
    <>
      <button
        type="button"
        className="add-todo"
        style={style}
        aria-label="Add a new task"
        onClick={() => setOpen(true)}
      >
        +
      </button>
      <AddTodoModal open={open} onClose={() => setOpen(false)} />
    </>
  );
};

export default AddTodo;
