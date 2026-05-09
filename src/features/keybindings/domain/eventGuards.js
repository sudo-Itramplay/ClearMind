// Predicates and normalisers for KeyboardEvent. Kept dependency-free so
// the dispatcher is testable with bare event-shaped objects.

const EDITABLE_TAGS = new Set(["INPUT", "TEXTAREA", "SELECT"]);

export const isEditableTarget = (target) => {
  if (!target) return false;
  if (EDITABLE_TAGS.has(target.tagName)) return true;
  if (target.isContentEditable) return true;
  return false;
};

// Skip when a modifier combo is in play so we don't shadow browser/system
// shortcuts. Shift is allowed because it produces glyphs we care about
// (e.g. "?" is shift + "/", "G" is shift + "g").
export const hasUnsafeModifier = (e) => e.ctrlKey || e.metaKey || e.altKey;

export const shouldIgnore = (e) => {
  if (hasUnsafeModifier(e)) return true;
  if (isEditableTarget(e.target)) return true;
  if (e.key === "Shift" || e.key === "Control" || e.key === "Alt" || e.key === "Meta") return true;
  return false;
};

// `e.key` is already the produced character with case applied; just hand
// it back unchanged. Centralised so any future tweak (e.g. Dvorak remap)
// has one place to live.
export const normalizeKey = (e) => e.key;
