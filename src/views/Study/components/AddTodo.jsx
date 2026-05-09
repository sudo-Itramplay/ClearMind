import React from 'react';
import { useTodoEntry } from './TodoEntryProvider';

// Mirror Postit's POSITIONS so AddTodo lands on the same slot grid.
const POSITIONS = [
  { x: 4,  y: 6,  r: -3 }, { x: 22, y: 12, r: 2 },  { x: 40, y: 4,  r: -1 },
  { x: 58, y: 14, r: 3 },  { x: 76, y: 6,  r: -2 }, { x: 8,  y: 50, r: 4 },
  { x: 28, y: 56, r: -2 }, { x: 48, y: 52, r: 1 },  { x: 68, y: 56, r: -3 },
  { x: 4,  y: 28, r: 2 },  { x: 76, y: 30, r: -2 },
];

const AddTodo = ({ position = 0 }) => {
  // Click goes to the guided full form (lower learning curve). Power users
  // hit `Q` for the quick-add input — see TodoEntryProvider.
  const { openFull } = useTodoEntry();
  const pos = POSITIONS[position % POSITIONS.length];

  const style = {
    left: `${pos.x}%`,
    top: `${pos.y}%`,
    transform: `rotate(${pos.r}deg)`,
    "--r": `${pos.r}deg`,
  };

  return (
    <button
      type="button"
      className="add-todo"
      style={style}
      aria-label="Add a new task"
      onClick={openFull}
    >
      +
    </button>
  );
};

export default AddTodo;
