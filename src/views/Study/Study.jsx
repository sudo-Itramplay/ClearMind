import React, { useEffect, useRef, useState } from 'react';
import BackButton from '../../components/ui/BackButton';
import { useTodos } from '../../context/TodoContext';
import { dateToday } from '../../data/mockDB';
import CorkBoard from './components/CorkBoard';
import { POSTIT_SLOTS } from './components/Postit';
import Notebook from './components/Notebook';
import Watch from './components/Watch';
import './style/study.css';

const DROP_ANIM_MS = 600;

const Study = ({ go }) => {
  const { todos, isLoading, toggleTodo } = useTodos();
  const [open, setOpen] = useState(false);
  const [recentlyAdded, setRecentlyAdded] = useState(null);

  const today = dateToday();
  const todays = todos
    .filter((t) => t.date === today)
    .sort((a, b) => a.createdAt - b.createdAt)
    .slice(0, POSTIT_SLOTS);

  // Detect new additions for drop animation
  const lastIdRef = useRef(null);
  useEffect(() => {
    if (todays.length === 0) return;
    const lastId = todays[todays.length - 1].id;
    if (lastIdRef.current && lastId !== lastIdRef.current) {
      setRecentlyAdded(lastId);
      const id = setTimeout(() => setRecentlyAdded(null), DROP_ANIM_MS);
      lastIdRef.current = lastId;
      return () => clearTimeout(id);
    }
    lastIdRef.current = lastId;
  }, [todays.map((t) => t.id).join(",")]);

  return (
    <div className="study-room page-anim">
      <BackButton onClick={() => go("hall")} />
      <div className="study-grid">
        <CorkBoard
          tasks={todays}
          isLoading={isLoading}
          recentlyAddedId={recentlyAdded}
          onToggle={toggleTodo}
        />
        <div className="desk">
          <button className="notebook" onClick={() => setOpen(true)} aria-label="Open My Tasks notebook">
            <span className="notebook-stitch" aria-hidden="true" />
            <span className="notebook-label">My Tasks</span>
            <span className="notebook-count">{todays.length}</span>
          </button>
          <Watch defaultMode="timer" />
        </div>
      </div>
      <Notebook open={open} onClose={() => setOpen(false)} />
    </div>
  );
};

export default Study;
