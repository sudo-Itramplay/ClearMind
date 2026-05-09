// Single source of truth for global keybindings. The cheat-sheet, the
// dispatcher, and the matcher all read from this list — edit one row and
// everything stays in sync.
//
// Shape:
//   id          — string used by useKeyAction(id, fn) to register a handler.
//   keys        — exact keystroke or two-key chord ("g" + "h" -> "gh").
//                 Case-sensitive (Vim convention: g and G are different).
//   description — human label rendered in the cheat-sheet.
//   group       — cheat-sheet section.
//
// To add a binding: append a row + register a handler with useKeyAction.
// To rename a key:  change `keys` only.

export const CHORD_TIMEOUT_MS = 800;

export const KEYMAP = [
  // Navigation between rooms (vim-style "go" leader)
  { id: "goHall",      keys: "gh",     description: "Go to Hall",          group: "Navigation" },
  { id: "goStudy",     keys: "gs",     description: "Go to Study",         group: "Navigation" },
  { id: "goMeditate",  keys: "gm",     description: "Go to Meditate",      group: "Navigation" },

  // Page-scroll, vim-style
  { id: "scrollDown",  keys: "j",      description: "Scroll down",         group: "Navigation" },
  { id: "scrollUp",    keys: "k",      description: "Scroll up",           group: "Navigation" },
  { id: "scrollTop",   keys: "gg",     description: "Scroll to top",       group: "Navigation" },
  { id: "scrollBot",   keys: "G",      description: "Scroll to bottom",    group: "Navigation" },

  // Tasks
  { id: "openQuickAdd", keys: "q",     description: "Quick add task (Study)", group: "Tasks" },

  // General
  { id: "toggleHelp",  keys: "?",      description: "Toggle this cheat-sheet", group: "General" },
];

// Convenience export — UI groups the rows for the cheat-sheet without
// re-iterating the array everywhere.
export const groupKeymap = (keymap = KEYMAP) =>
  keymap.reduce((acc, b) => {
    (acc[b.group] = acc[b.group] || []).push(b);
    return acc;
  }, {});
