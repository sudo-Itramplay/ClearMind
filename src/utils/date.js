// Local-time YYYY-MM-DD key. Used everywhere a date is stored or compared
// (mockDB, useCalendarDays, notebook form) so a task added "today" lands on
// today's calendar sphere regardless of timezone.
//
// Why not toISOString().slice(0,10)? That returns the UTC date, which is
// off-by-one for any local time before UTC midnight in eastern timezones.
export const localDateKey = (d = new Date()) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

export const localDateShift = (n, base = new Date()) => {
  const d = new Date(base);
  d.setDate(d.getDate() + n);
  return localDateKey(d);
};

// Whole days from `base` to a YYYY-MM-DD key. Negative = in the past, 0 = today.
// Both sides are normalized to local midnight so DST shifts don't leak in.
export const daysUntil = (key, base = new Date()) => {
  const [y, m, d] = key.split("-").map(Number);
  const target = new Date(y, m - 1, d);
  const from = new Date(base.getFullYear(), base.getMonth(), base.getDate());
  return Math.round((target - from) / 86400000);
};
