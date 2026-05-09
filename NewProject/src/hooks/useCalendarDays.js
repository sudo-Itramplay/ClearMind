import { useMemo } from 'react';
import { localDateKey } from '../utils/date';

// Mon=0..Sun=6 (so the calendar grid header order Mon..Sun lines up with column index)
const dowMonFirst = (d) => (d.getDay() + 6) % 7;

const intensityLevel = (pending, mean) => {
  if (pending === 0) return "none";
  // Compare to the window's mean pending. <0.5x = low, ~mean = med, >1.5x = high.
  // Floor mean at 0.5 so an empty calendar still has a sensible scale.
  const ratio = pending / Math.max(mean, 0.5);
  if (ratio <= 0.5) return "low";
  if (ratio <= 1.5) return "med";
  return "high";
};

export const useCalendarDays = (todos, { weeks = 5 } = {}) => {
  return useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayKey = localDateKey(today);
    const dow = dowMonFirst(today);

    const totalCells = weeks * 7;
    // Place today in the last row at column `dow`. Remaining cells of that
    // week become future placeholders.
    const todayIndex = totalCells - 7 + dow;

    const byDate = {};
    for (const t of todos) (byDate[t.date] = byDate[t.date] || []).push(t);

    const start = new Date(today);
    start.setDate(today.getDate() - todayIndex);

    const cells = [];
    for (let i = 0; i < totalCells; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const key = localDateKey(d);
      const tasks = byDate[key] || [];
      const total = tasks.length;
      const done = tasks.filter((t) => t.completed).length;
      const pending = total - done;
      const isFuture = key > todayKey;
      cells.push({
        key, total, done, pending, tasks,
        isToday: key === todayKey,
        isFuture,
      });
    }

    // Mean pending across observed (past + today) cells only.
    const observed = cells.filter((c) => !c.isFuture);
    const meanPending = observed.length
      ? observed.reduce((s, c) => s + c.pending, 0) / observed.length
      : 0;

    const days = cells.map((c) => ({
      ...c,
      meanPending,
      level: c.isFuture ? "future" : intensityLevel(c.pending, meanPending),
      allDone: c.total > 0 && c.pending === 0,
    }));

    return { days, meanPending };
  }, [todos, weeks]);
};
