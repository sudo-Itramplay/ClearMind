// Single source of truth for Quick Add keywords. Edit here to add or rename
// shortcuts; nothing else in the feature changes.
//
// Priority levels are mapped onto the existing todo schema ("low" | "normal"
// | "high"). Todoist's p1 (highest) → p4 (none) is collapsed: p3/p4 → "low".

export const PRIORITY_ALIASES = {
  p1: "high",
  p2: "normal",
  p3: "low",
  p4: "low",
};

export const DATE_KEYWORDS = {
  today: 0,
  tdy: 0,
  tomorrow: 1,
  tmrw: 1,
};

// Prefix + 2-letter weekday code = "next that weekday" (e.g. nxmn = next Mon).
export const NEXT_WEEKDAY_PREFIX = "nx";

// Numeric values match Date#getDay().
export const WEEKDAY_CODES = {
  su: 0,
  mn: 1,
  tu: 2,
  we: 3,
  th: 4,
  fr: 5,
  sa: 6,
};

export const QUICK_ADD_CONFIG = {
  priorityAliases: PRIORITY_ALIASES,
  dateKeywords: DATE_KEYWORDS,
  nextWeekdayPrefix: NEXT_WEEKDAY_PREFIX,
  weekdayCodes: WEEKDAY_CODES,
};
