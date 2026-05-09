import React from "react";
import Loader from "../../../components/ui/Loader";
import Postit, { POSTIT_SLOTS } from "./Postit";
import AddTodo from "./AddTodo";

const CorkBoard = ({ tasks, isLoading, recentlyAddedId, onToggle }) => {
  const canAdd = !isLoading && tasks.length < POSTIT_SLOTS;
  return (
    <div className="corkboard-area">
      <div
        className="corkboard"
        role="region"
        aria-label="Cork board with today's tasks"
      >
        {isLoading && <Loader label="Loading tasks" />}
        {!isLoading && tasks.length === 0 && (
          <div className="corkboard-empty">
            The board is empty. Pin your first task.
          </div>
        )}
        {!isLoading &&
          tasks.map((note, i) => (
            <Postit
              key={note.id}
              idx={i}
              note={note}
              onToggle={onToggle}
              dropping={note.id === recentlyAddedId}
            />
          ))}
        {canAdd && <AddTodo position={tasks.length} />}
      </div>
    </div>
  );
};

export default CorkBoard;
