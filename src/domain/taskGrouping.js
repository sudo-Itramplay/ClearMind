import { localDateShift } from "../utils/date";

export const EARLIER_WEEKS = 4;

const byDateAsc = (a, b) =>
  a.date.localeCompare(b.date) ||
  Number(a.completed) - Number(b.completed) ||
  b.createdAt - a.createdAt;

export const groupTasks = (todos, today, weeks = EARLIER_WEEKS) => {
  const sorted = todos.slice().sort(byDateAsc);
  const cutoff = localDateShift(-weeks * 7, new Date(today));

  return [
    { key: "today", label: "Today", items: sorted.filter((t) => t.date === today) },
    { key: "upcoming", label: "Upcoming", items: sorted.filter((t) => t.date > today) },
    {
      key: "earlier",
      label: "Earlier",
      items: sorted.filter((t) => t.date < today && t.date >= cutoff),
    },
  ].filter((g) => g.items.length > 0);
};
