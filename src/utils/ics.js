// Builds an iCalendar (.ics) file from the exams map so it can be imported into
// Google Calendar, Apple Calendar, or Outlook. Each exam is an all-day event.
//
// Why all-day + a stable UID: the UID is derived from the date, so re-importing
// after editing an exam updates the existing event instead of creating a
// duplicate (per RFC 5545, matching UID = same event).

const PRODID = "-//ClearMind//Exams//EN";

// RFC 5545 text escaping: backslash, semicolon, comma, and newlines.
const escapeText = (s) =>
  String(s)
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");

// "2026-06-15" -> "20260615"
const compact = (key) => key.replace(/-/g, "");

// All-day DTEND is exclusive, so it points at the day after the exam.
const nextDayCompact = (key) => {
  const [y, m, d] = key.split("-").map(Number);
  const next = new Date(y, m - 1, d + 1);
  const p = (n) => String(n).padStart(2, "0");
  return `${next.getFullYear()}${p(next.getMonth() + 1)}${p(next.getDate())}`;
};

const stampUTC = (date) => {
  const p = (n) => String(n).padStart(2, "0");
  return (
    `${date.getUTCFullYear()}${p(date.getUTCMonth() + 1)}${p(date.getUTCDate())}` +
    `T${p(date.getUTCHours())}${p(date.getUTCMinutes())}${p(date.getUTCSeconds())}Z`
  );
};

export const buildExamsIcs = (exams, { now = new Date() } = {}) => {
  const dtstamp = stampUTC(now);
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    `PRODID:${PRODID}`,
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
  ];

  for (const date of Object.keys(exams).sort()) {
    const title = exams[date]?.trim() || "Exam";
    lines.push(
      "BEGIN:VEVENT",
      `UID:exam-${date}@clearmind`,
      `DTSTAMP:${dtstamp}`,
      `DTSTART;VALUE=DATE:${compact(date)}`,
      `DTEND;VALUE=DATE:${nextDayCompact(date)}`,
      `SUMMARY:${escapeText(title)}`,
      "TRANSP:TRANSPARENT",
      // Reminder the day before at the device's default alarm time.
      "BEGIN:VALARM",
      "ACTION:DISPLAY",
      `DESCRIPTION:${escapeText(`${title} tomorrow`)}`,
      "TRIGGER:-P1D",
      "END:VALARM",
      "END:VEVENT",
    );
  }

  lines.push("END:VCALENDAR");
  // RFC 5545 requires CRLF line breaks.
  return lines.join("\r\n") + "\r\n";
};

export const downloadIcs = (filename, content) => {
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};
