// Pure tokenizer. Splits a raw input string into typed tokens using the
// keyword config. No clock, no I/O, no resolution — just classification.

export const TOKEN = Object.freeze({
  TEXT: "text",
  PRIORITY: "priority",
  DATE: "date",
  EXAM: "exam",
});

const classify = (word, config) => {
  const lower = word.toLowerCase();
  const { priorityAliases, dateKeywords, nextWeekdayPrefix, weekdayCodes, examKeywords } = config;

  if (examKeywords && lower in examKeywords) {
    return { kind: TOKEN.EXAM, raw: word, value: true };
  }
  if (lower in priorityAliases) {
    return { kind: TOKEN.PRIORITY, raw: word, value: priorityAliases[lower] };
  }
  if (lower in dateKeywords) {
    return { kind: TOKEN.DATE, raw: word, value: { kind: "offset", days: dateKeywords[lower] } };
  }
  // `nx<wd>` is checked before bare `<wd>` so the prefix doesn't get
  // misclassified by its weekday-code suffix.
  if (lower.startsWith(nextWeekdayPrefix)) {
    const code = lower.slice(nextWeekdayPrefix.length);
    if (code in weekdayCodes) {
      return { kind: TOKEN.DATE, raw: word, value: { kind: "skipOneWeekday", weekday: weekdayCodes[code] } };
    }
  }
  if (lower in weekdayCodes) {
    return { kind: TOKEN.DATE, raw: word, value: { kind: "upcomingWeekday", weekday: weekdayCodes[lower] } };
  }
  return { kind: TOKEN.TEXT, raw: word, value: null };
};

export const tokenize = (input, config) => {
  if (!input) return [];
  return input.trim().split(/\s+/).filter(Boolean).map((w) => classify(w, config));
};
