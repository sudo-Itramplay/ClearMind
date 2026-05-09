import React from 'react';
import Loader from '../ui/Loader';
import Postit from './Postit';

const CorkBoard = ({ tasks, isLoading, recentlyAddedId, onToggle }) => (
  <div className="corkboard-area">
    <div className="corkboard" role="region" aria-label="Cork board with today's tasks">
      {isLoading && <Loader label="Loading tasks" />}
      {!isLoading && tasks.length === 0 && (
        <div className="corkboard-empty">
          The board is empty. Open the notebook to pin a task.
        </div>
      )}
      {!isLoading && tasks.map((note, i) => (
        <Postit
          key={note.id}
          idx={i}
          note={note}
          onToggle={onToggle}
          dropping={note.id === recentlyAddedId}
        />
      ))}
    </div>
  </div>
);

export default CorkBoard;
