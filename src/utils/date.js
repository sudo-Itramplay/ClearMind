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
