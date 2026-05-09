# ClearMind — Architecture

> ADHD-friendly study companion. React 19 + Vite 8 + Tailwind CSS v3.  
> All UI text and code comments in **Catalan**. Component/class names in **English**.

---

## Stack

| Layer | Technology | Notes |
|---|---|---|
| UI Framework | React 19 (functional + hooks) | No class components |
| Bundler | Vite 8 | ESM, fast HMR |
| Routing | React Router v7 | BrowserRouter, no data-router APIs |
| Styling | Tailwind CSS v3 + plain CSS | `preflight: false` to avoid conflict with legacy CSS |
| PostCSS | autoprefixer | Standard vendor-prefix pipeline |
| Class merging | `clsx` + `tailwind-merge` via `cn()` | `src/lib/utils.js` |
| State | React Context (`TodoContext`) | Global todo list only |
| Mock data | `mockDB.js` | 300 ms simulated async delay |
| Fonts | Inter (UI) + Pixelify Sans (decorative) | Loaded from Google Fonts in `index.html` |
| Sounds | `/public/sounds/*.mp3` | Served as static assets |

**Zustand** is installed but **not used**. `src/store/` has been removed. If Zustand is needed in the future (e.g. persisted session state, timer history), re-add it there without touching TodoContext.

---

## Directory Map

```
src/
├── main.jsx                  # Entry point — router, providers
├── styles/
│   ├── globals.css           # Design system: CSS variables, keyframes, dark mode
│   └── theme.js              # Same tokens as JS constants (for SVG/canvas use)
├── assets/
│   └── index.css             # Legacy cozy system (kept for Header/Footer)
├── lib/
│   └── utils.js              # cn() utility (clsx + tailwind-merge)
├── context/
│   └── TodoContext.jsx       # Global task state (todos, addTodo, toggleTodo, deleteTodo)
├── data/
│   └── mockDB.js             # Dynamic seed data — dates relative to today
├── components/
│   ├── Header.jsx            # Legacy header (Hall/Study/Relax layout)
│   ├── Footer.jsx            # Legacy footer (Hall/Study/Relax layout)
│   ├── css/
│   │   ├── Header.module.css
│   │   └── Footer.module.css
│   ├── layout/
│   │   ├── navbar.jsx        # Top bar + mobile bottom nav (Dashboard only)
│   │   └── sidebar.jsx       # Desktop sidebar (Dashboard only)
│   ├── ui/
│   │   ├── button.jsx        # 6 variants × 3 sizes
│   │   ├── card.jsx          # Card / CardHeader / CardContent / CardFooter
│   │   ├── badge.jsx         # 5 variants
│   │   └── progress.jsx      # role="progressbar", 4 colour variants
│   └── features/
│       ├── cork-board.jsx    # Today's tasks as post-it notes on corkboard
│       ├── desk-timer.jsx    # Pomodoro/stopwatch — always-visible mode switch
│       ├── desk-notebook.jsx # Closed notebook button + AgendaModal (7-day tabs)
│       ├── focus-timer.jsx   # SVG arc timer (Dashboard only)
│       ├── greeting-section.jsx  # Time-aware greeting + daily message
│       ├── streak-tracker.jsx    # 7-day streak dots (hardcoded, see known issues)
│       └── task-list.jsx         # Static task list (Dashboard only, see known issues)
└── views/
    ├── Dashboard.jsx         # New design system — Navbar + Sidebar layout
    ├── Hall.jsx              # Vestíbul — 3D perspective doors
    ├── Study.jsx             # Study room — wall (61.8vh) + desk (38.2vh)
    ├── Relax.jsx             # Meditation — breathing circle + guides
    └── css/
        ├── Hall.css
        ├── Study.css         # Golden ratio spatial metaphor styles
        └── Relax.css
```

---

## Routing

```
/             →  redirect to /hall
/hall         →  Hall     (LegacyLayout: Header + Footer)
/study        →  Study    (LegacyLayout: Header + Footer)
/relax        →  Relax    (LegacyLayout: Header + Footer)
/dashboard    →  Dashboard (Navbar + Sidebar layout — new system)
```

**LegacyLayout** is a thin `<Outlet>` wrapper in `main.jsx` that injects `Header` and `Footer` around the three main views. Dashboard uses its own layout with `Navbar` and `Sidebar`.

---

## Data Flow

```
mockDB.getTodos()
      │  (300 ms Promise)
      ▼
TodoProvider  ──────────────────────────────────────────┐
  todos[]                                               │
  addTodo({ task, date?, description? })                │
  toggleTodo(id)                                        │
  deleteTodo(id)                                        │
  isLoading                                             │
      │                                                 │
      ├── CorkBoard     (filters by today's ISO date)   │
      ├── AgendaModal   (filters by selected day tab)   │
      ├── DeskNotebook  (pending count preview)         │
      ├── Hall          (first 5 pending tasks)         │
      └── Dashboard     (TaskList — static copy, see known issues)
```

**Task shape:**
```js
{
  id:          number,          // Date.now() if not provided
  task:        string,          // Title text
  description: string,          // Optional detail
  date:        'YYYY-MM-DD',    // ISO date (defaults to today)
  completed:   boolean,
}
```

---

## Design System

### CSS Custom Properties

All visual tokens live in `src/styles/globals.css` under `:root` and `[data-theme="dark"]`.  
The canonical names follow `--color-{category}-{role}[-{variant}]`.

**Legacy aliases** (`--accent-primary`, `--surface-card`, etc.) are kept as `var()` pointers so older CSS files (Hall.css, Study.css, Relax.css) continue to work without migration.

| Semantic token | Hex | Role |
|---|---|---|
| `--color-accent-primary` | `#AE5815` | CTA, focus rings, active state |
| `--color-accent-reward` | `#AE8204` | Streaks, timer done, celebrations |
| `--color-accent-calm` | `#3E8283` | Success, breathing, checkmarks |
| `--color-accent-danger` | `#C70D0B` | **Errors and destructive actions only** |
| `--color-surface-base` | `#FBF7F0` | Page background |
| `--color-surface-card` | `#F5EDE3` | Panels, cards |
| `--color-surface-rest` | `#F0E8DC` | Relax zone (intentionally muted) |
| `--color-text-heading` | `#3A271A` | Headings, primary text |
| `--color-text-body` | `#57493B` | Body text, descriptions |
| `--color-text-muted` | `#8C7B6B` | Placeholders, disabled |

**ADHD rule:** `--color-accent-danger` (red) is **never** used for success, completion, or celebrations. Use `--color-accent-reward` (amber) instead. Red triggers anxiety; amber signals achievement.

### Tailwind Usage

Tailwind classes are used only in `Dashboard.jsx`, `navbar.jsx`, `sidebar.jsx`, and UI primitives. The three main views (Hall, Study, Relax) use plain CSS files with CSS variables.

`preflight: false` prevents Tailwind's reset from breaking the legacy CSS.

### Dark Mode

Applied via `data-theme="dark"` on `<html>`. Persisted to `localStorage` under the key `clearmind-theme`. A blocking inline `<script>` in `index.html` reads this before React hydrates, preventing the white-flash on load.

---

## Study Page — Spatial Architecture

The Study page implements a physical desk metaphor using the **golden ratio (φ ≈ 1.618)**:

```
┌────────────────────────── WALL (61.8vh) ──────────────────────┐
│                                                                 │
│         ┌──────────────── CORKBOARD (61.8% width) ──────────┐  │
│         │  Post-it notes (today's tasks, filtered by date)  │  │
│         │  Floating animation, nth-child colours, rotation  │  │
│         └───────────────────────────────────────────────────┘  │
│                                                                 │
├────────────────────────── DESK (38.2vh) ──────────────────────┤
│                                                                 │
│  ┌─ NOTEBOOK (38.2%) ──┐  ┌────── TIMER (61.8%) ────────────┐  │
│  │ Closed book button  │  │  260px circle, mode switch,     │  │
│  │ CSS pencil (deco)   │  │  presets, ±1/5 min adjusters,   │  │
│  │ Opens AgendaModal   │  │  progressive glow classes        │  │
│  ├─────────────────────┤  └─────────────────────────────────┘  │
│  │  RADIO (ambient)    │                                        │
│  │  LED indicators     │                                        │
│  └─────────────────────┘                                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Wall texture:** Warm painted café wall (`linear-gradient` + SVG noise).  
**Desk surface:** Dark wood grain (`repeating-linear-gradient`).  
**Corkboard:** Cork texture via overlapping diagonal gradients + noise overlay.  
**Shadow boundary:** The wall-to-desk edge has a `box-shadow inset` simulating the desk surface receiving light from above.

---

## Accessibility Contract

Every component that ships must meet **WCAG 2.1 AA**:

| Requirement | Implementation |
|---|---|
| Semantic structure | `role="main"`, `role="region"`, `role="timer"`, `role="dialog"` |
| Interactive roles | `role="checkbox"` + `aria-checked` for post-its; `role="radio"` for mode pills |
| Labels | `aria-label` on all interactive elements; `aria-labelledby` on modals |
| Live regions | `aria-live="polite"` for time display, task state; `aria-live="assertive"` for timer end |
| Focus management | Focus trap in AgendaModal; returns focus to trigger on close |
| Keyboard | Space/Enter on all custom buttons; Tab cycling inside modals |
| Touch targets | `min-height: 44px` on all interactive elements on mobile |
| Motion | `@media (prefers-reduced-motion: reduce)` disables all animations; colour/border changes only |
| Contrast | Post-it text `#3A271A` on all four backgrounds: ≥7:1 verified |
| Decorative | All CSS-only decorations (`aria-hidden="true"`) |

---

## Animation Catalogue

All keyframes are defined in `globals.css` and can be used via CSS class:

| Keyframe | Duration | Trigger |
|---|---|---|
| `postit-float` | 4 s | Any pending post-it (staggered `animation-delay` by index) |
| `timer-breathe` | 4 s | Timer face when idle |
| `pulse-amber` | 3 s | Timer >50% remaining |
| `pulse-terracotta` | 2 s | Timer >25% remaining |
| `pulse-critical` | 1 s | Timer ≤25% remaining |
| `timer-completed-flash` | 1.5 s × 3 | Timer reaches 0 |
| `breatheIn/Out/Hold` | 4 s / 6 s / 2 s | Relax page breathing circle |
| `timerGlowPulse` | CSS custom prop | Legacy (kept for compatibility) |

All animations are **overridden to static** under `prefers-reduced-motion: reduce`.

---

## Known Issues / Planned Work

| Issue | Location | Impact |
|---|---|---|
| `TaskList` uses hardcoded data | `features/task-list.jsx` | Dashboard shows static tasks, not real user data |
| `StreakTracker` hardcoded | `features/streak-tracker.jsx` | Streak counter not derived from real completions |
| `FocusTimer` sessions not persisted | `features/focus-timer.jsx` | Session count resets on reload |
| No React Error Boundary | App-wide | Unhandled errors crash entire app |
| No path aliases | `vite.config.js` | Deep relative imports (`../../lib/utils`) |
| Dark mode not applied on Hall/Relax CSS | `Hall.css`, `Relax.css` | Some surfaces don't respect `data-theme="dark"` |
