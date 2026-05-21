import { useMemo } from 'react';
import { localDateKey } from '../utils/date';

// Mon=0..Sun=6 — matches the column order of the calendar grid header.
const dowMonFirst = (d) => (d.getDay() + 6) % 7;

const intensityLevel = (pending, mean) => {
  if (pending === 0) return "none";
  // Floor at 2.5 so sparse demo data still spreads across all levels:
  // 1 task → low, 2–3 → med, 4+ → high.
  const ratio = pending / Math.max(mean, 2.5);
  if (ratio <= 0.5) return "low";
  if (ratio <= 1.5) return "med";
  return "high";
};

export const useCalendarDays = (
  todos,
  { weeksBefore = 1, weeksAfter = 2 } = {},
) => {
  return useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayKey = localDateKey(today);
    const dow = dowMonFirst(today);

    const totalWeeks = weeksBefore + 1 + weeksAfter;
    const totalCells = totalWeeks * 7;
    // Today sits in row `weeksBefore` (0-indexed) at column `dow`. The window
    // always starts on a Monday, so row-major grid flow lines days up with
    // their day-of-week column.
    const todayIndex = weeksBefore * 7 + dow;

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
      cells.push({
        key, total, done, pending, tasks,
        isToday: key === todayKey,
        isPast: key < todayKey,
        isFuture: key > todayKey,
      });
    }

    // Mean pending across the whole window. Future workload counts —
    // this is the user's planning view, not just a backward heatmap.
    const meanPending = cells.length
      ? cells.reduce((s, c) => s + c.pending, 0) / cells.length
      : 0;

    const days = cells.map((c) => ({
      ...c,
      meanPending,
      level: intensityLevel(c.pending, meanPending),
      allDone: c.total > 0 && c.pending === 0,
    }));

    return { days, meanPending, totalCells };
  }, [todos, weeksBefore, weeksAfter]);
};
