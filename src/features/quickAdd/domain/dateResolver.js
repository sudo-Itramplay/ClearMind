import { TOKEN } from "./tokenizer";

const pad = (n) => String(n).padStart(2, "0");
const toKey = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

const addDays = (base, days) => {
  const d = new Date(base);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + days);
  return d;
};

// Bare weekday (e.g. `mn`): the upcoming occurrence of that weekday. If
// today already matches, today is returned (diff = 0).
const upcomingWeekday = (base, weekday) => {
  const d = new Date(base);
  d.setHours(0, 0, 0, 0);
  const diff = (weekday - d.getDay() + 7) % 7;
  d.setDate(d.getDate() + diff);
  return d;
};

// Prefixed weekday (e.g. `nxmn`): one full week after the upcoming one,
// so the user can refer to "this Monday" vs "the Monday after that".
const skipOneWeekday = (base, weekday) => {
  const d = upcomingWeekday(base, weekday);
  d.setDate(d.getDate() + 7);
  return d;
};

export const resolveDate = (tokens, clock) => {
  for (let i = tokens.length - 1; i >= 0; i--) {
    const t = tokens[i];
    if (t.kind !== TOKEN.DATE) continue;
    const now = clock.now();
    if (t.value.kind === "offset") return toKey(addDays(now, t.value.days));
    if (t.value.kind === "upcomingWeekday") return toKey(upcomingWeekday(now, t.value.weekday));
    if (t.value.kind === "skipOneWeekday") return toKey(skipOneWeekday(now, t.value.weekday));
  }
  return null;
};
