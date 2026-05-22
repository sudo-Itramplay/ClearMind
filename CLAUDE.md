# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Dev server with hot reload at http://localhost:3000
npm run build    # Production build to dist/
```

No test runner is configured. Domain logic is designed for pure-function testing via direct imports (see Testing section below).

## Architecture

ClearMind is a React 19 SPA using hash-based routing (`#hall`, `#study`, `#meditate`). No React Router. No backend — all data lives in an in-memory mock DB initialized from a seed function on first access.

### Provider tree (App.jsx)

```
SoundProvider → ToastProvider → TodoProvider → KeymapProvider
  → KeymapDefaults → GlobalQuickAddProvider → Shell
```

`Shell` renders the active room based on `window.location.hash` and registers the navigation keybindings. Room-specific bindings (e.g. `q` for Quick Add) register themselves from inside the room component.

### Data flow

`mockDB.js` (in-memory, async with 220ms simulated delay) → `TodoContext` (CRUD + `window.resetDemo()`) → views. No view accesses `mockDB` directly.

Todo schema: `{ id, task, description, date (YYYY-MM-DD), completed, priority ("low"|"normal"|"high"), createdAt }`.

### Features (self-contained modules)

Each feature under `src/features/` has three layers: `config/` (declarations only) → `domain/` (pure functions, no React) → `ui/` (React). Import only from each feature's `index.js`.

**`keybindings/`** — Vim-style global keyboard shortcuts. `keymapConfig.js` is the single source of truth for all bindings. `KeymapProvider` dispatches by string `id` — it never imports views. Views register handlers with `useKeyAction(id, fn)`. Adding a shortcut = one line in config + one `useKeyAction` call. The cheatsheet auto-derives from config.

**`quickAdd/`** — Natural language task input (e.g. `Read chapter 4 p1 nxmn`). `quickAddConfig.js` is the only file to edit for keyword changes. The parser pipeline: `tokenizer.js` → `dateResolver.js` / `priorityResolver.js` → `parseQuickInput.js`. `TodoEntryProvider.jsx` (in `views/Study/`) decides whether to show Quick Add or the full NotebookForm.

### Rooms

- **Hall** (`views/Hall/`) — SVG analog clock, 35-sphere reactive calendar (intensity based on task count per day), 3D perspective doors.
- **Study** (`views/Study/`) — Cork board with today's post-its, full notebook task list, timer with SVG progress ring, stopwatch with optional target time.
- **Meditate** (`views/Meditate/`) — Three breathing modes (Activation 3-2-1, Box 4-4-4-4, Sleep 4-7-8) with animated guide circle.

### Sounds

All sounds synthesized via Web Audio API in `SoundContext`. No audio files. Opt-in via `SoundToggle`.

## Extending

**Add a keybinding:** Add `{ id, keys, description, group }` to `keymapConfig.js`, then call `useKeyAction(id, fn)` in the relevant view.

**Add a Quick Add keyword:** Edit only `src/features/quickAdd/config/quickAddConfig.js` (`DATE_KEYWORDS` or `PRIORITY_ALIASES`). Optionally update `CHEAT_SHEET` in `QuickAddInput.jsx`.

**Swap the data layer:** Replace `src/data/mockDB.js` with an API implementation. `TodoContext` only depends on the `{ getTodos, addTodo, updateTodo, deleteTodo, toggleTodo }` interface.

## Testing domain logic

Domain modules are injectable by design. No test runner is set up, but the patterns are ready:

```js
// quickAdd date resolution with fixed clock
import { fixedClock, parseQuickInput, QUICK_ADD_CONFIG } from "./src/features/quickAdd";
parseQuickInput("task p1 nxmn", QUICK_ADD_CONFIG, fixedClock("2026-05-09"));

// keybindings matcher with fake timers
import { createMatcher, KEYMAP } from "./src/features/keybindings";
const m = createMatcher(KEYMAP, { timeoutMs: 800, setTimeoutFn: (fn) => fn, clearTimeoutFn: () => {} });
```

## Conventions

- Components: PascalCase (`.jsx`)
- Hooks: `use` prefix (`.js`)
- CSS classes: kebab-case, colocated with the component they style
- Feature internals are private — only import from `features/<name>/index.js`
