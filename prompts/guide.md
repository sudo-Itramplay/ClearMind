# ClearMind — Analog Brutalist Refactor: Detailed Prompts

> Pass each section below as a standalone prompt to Kimi/code-executor for complex transformations.

---

## PROMPT A — `index.css`: Design System Overhaul

Refactor `/home/itramplay/Projects/UNI/FH/ClearMind/ClearMind/src/assets/index.css`.

Replace the existing `:root` color/shadow variables with this new Analog-Brutalist / Persona 5-inspired design system. Keep all existing variable names that the rest of the code already uses, but update their values. Add the new variables listed below.

### New `:root` values to set:

```css
/* ── Core palette ─────────────────────────────────── */
--color-bg:             #0D0D0D;   /* near-black canvas */
--color-surface:        #1C1C1C;   /* dark charcoal panels */
--color-surface-alt:    #252525;   /* slightly lifted surface */
--color-primary:        #3E8283;   /* turquoise accent (keep) */
--color-primary-bg:     rgba(62,130,131,0.12);
--color-secondary:      #C70D0B;   /* Persona 5 red (was orange) */
--color-secondary-bg:   rgba(199,13,11,0.12);
--color-text:           #E8E4E0;
--color-text-secondary: #8A8480;
--color-text-muted:     #4A4540;
--color-error:          #C70D0B;
--color-success:        #5A9A7C;
--color-focus-ring:     #3E8283;

/* ── Analog extras ────────────────────────────────── */
--color-paper:          #F0E9D6;   /* warm cream paper */
--color-paper-dark:     #C8BD9E;   /* aged paper crease */
--color-wood-light:     #8B6343;
--color-wood-dark:      #3D2B1A;
--color-metal:          #2E2E2E;
--color-rust:           #8B3A1A;

/* ── Brutalist shadows (hard offset, no blur) ─────── */
--shadow-sm:            2px 2px 0px rgba(0,0,0,0.9);
--shadow-md:            4px 4px 0px rgba(0,0,0,0.9);
--shadow-red:           4px 4px 0px #C70D0B;
--shadow-teal:          4px 4px 0px #3E8283;
--shadow-paper:         3px 3px 0px rgba(0,0,0,0.85);

/* ── Borders ──────────────────────────────────────── */
--border-brutal:        2px solid #E8E4E0;
--border-brutal-red:    2px solid #C70D0B;
--border-brutal-teal:   2px solid #3E8283;
--border-dim:           1px solid #2A2A2A;

/* ── Radius — keep all existing names, reduce values  */
--radius-sm:   2px;
--radius-md:   3px;
--radius-lg:   4px;
--radius-xl:   6px;
```

Also update the `body` rule:
- `background-color`: `var(--color-bg)`
- `font-family`: `'Courier New', 'Courier', monospace` (analog/typewriter feel)
- `font-size`: `16px`
- Remove any existing border-radius softness on body

Update `#root`:
- `max-width`: `1200px`
- Border: `var(--border-dim)`
- Background: `var(--color-bg)`

Keep all responsive breakpoints, spacing variables (`--spacing-*`), and the `@font-face` / focus-visible rules intact.

---

## PROMPT B — `Hall.css`: 3D Hallway with Analog Doors

Completely rewrite `/home/itramplay/Projects/UNI/FH/ClearMind/ClearMind/src/views/css/Hall.css`.

The HTML structure rendered by `Hall.jsx` uses these classes (do not rename them):
- `.hall-container` — wrapper div
- `.door` + `.left-door` — left door (Link to /study)
- `.door` + `.right-door` — right door (Link to /relax)
- `.center-wall` — center column
- `.clock-circle` — clock display
- `.calendar-board` — date/todo board
- `.todo-list`, `.todo-list li`, `.done` — todo list
- `.rug` — decorative floor element

### Design Goal: Real Forced-Perspective Hallway

The view should feel like standing in a dark corridor looking toward a vanishing point. The two doors flank the center panel. Use 3D CSS transforms to create depth.

```css
/* ── Container: perspective stage ──────────────────── */
.hall-container {
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px 40px;
  position: relative;
  perspective: 1200px;
  perspective-origin: 50% 45%;

  /* Floor: repeating wood planks via gradient */
  background:
    repeating-linear-gradient(
      90deg,
      transparent 0px,
      transparent 58px,
      rgba(61,43,26,0.25) 58px,
      rgba(61,43,26,0.25) 60px
    ),
    linear-gradient(
      to bottom,
      #0D0D0D 0%,
      #1A1208 60%,
      #2A1C0A 100%
    );
}

/* ── Ceiling stripe ─────────────────────────────────── */
.hall-container::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 18%;
  background: linear-gradient(to bottom, #080808, #111111);
  border-bottom: var(--border-brutal);
}

/* ── Perspective side walls (pseudo) ────────────────── */
.hall-container::after {
  content: '';
  position: absolute;
  inset: 0;
  background:
    linear-gradient(to right,  rgba(0,0,0,0.6) 0%, transparent 25%),
    linear-gradient(to left,   rgba(0,0,0,0.6) 0%, transparent 25%);
  pointer-events: none;
}
```

### Doors: Analog Wood Panels

Each door must look like a heavy wooden door with a frame, panel insets, and a knob. Use only CSS (no images).

```css
/* ── Shared door base ───────────────────────────────── */
.door {
  width: 160px;
  height: 320px;
  position: relative;
  cursor: pointer;
  text-decoration: none;
  transform-style: preserve-3d;
  transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94),
              box-shadow 0.4s ease;
  z-index: 2;

  /* Wood base: vertical grain */
  background:
    repeating-linear-gradient(
      180deg,
      transparent 0px,
      transparent 14px,
      rgba(0,0,0,0.08) 14px,
      rgba(0,0,0,0.08) 16px
    ),
    repeating-linear-gradient(
      92deg,
      transparent 0px,
      transparent 30px,
      rgba(61,43,26,0.3) 30px,
      rgba(61,43,26,0.3) 32px
    ),
    linear-gradient(
      160deg,
      var(--color-wood-light) 0%,
      var(--color-wood-dark) 55%,
      #5C3D20 100%
    );

  border: 3px solid #1A0F00;
  box-shadow: var(--shadow-red);
  outline: 1px solid var(--color-wood-light);
}

/* ── Door frame ─────────────────────────────────────── */
.door::before {
  content: '';
  position: absolute;
  inset: 8px;
  border: 2px solid rgba(0,0,0,0.5);
  box-shadow: inset 0 0 12px rgba(0,0,0,0.6);
  /* Inner panel recess */
  background: linear-gradient(
    145deg,
    rgba(0,0,0,0.2),
    rgba(255,255,255,0.04)
  );
}

/* ── Door knob ──────────────────────────────────────── */
.door::after {
  content: '';
  position: absolute;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 35%, #C8A96E, #6B4A1A);
  border: 2px solid #1A0F00;
  box-shadow: 1px 1px 0px #000, inset 1px 1px 2px rgba(255,220,150,0.4);
  top: 50%;
  transform: translateY(-50%);
}

/* ── Door label (text inside) ───────────────────────── */
.door span, .door > * {
  position: absolute;
  bottom: 30px;
  left: 0; right: 0;
  text-align: center;
  font-family: 'Courier New', monospace;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 4px;
  text-transform: uppercase;
  color: var(--color-paper);
  text-shadow: 0 1px 3px rgba(0,0,0,0.9);
  z-index: 1;
}

/* ── Left door: skewed into perspective ─────────────── */
.left-door {
  transform: rotateY(38deg) translateX(-20px);
  transform-origin: left center;
}
.left-door::after { right: 18px; left: auto; }

.left-door:hover {
  transform: rotateY(20deg) translateX(-10px) scale(1.03);
  box-shadow: 6px 6px 0px var(--color-secondary);
}

/* ── Right door: mirror ─────────────────────────────── */
.right-door {
  transform: rotateY(-38deg) translateX(20px);
  transform-origin: right center;
}
.right-door::after { left: 18px; right: auto; }

.right-door:hover {
  transform: rotateY(-20deg) translateX(10px) scale(1.03);
  box-shadow: -6px 6px 0px var(--color-primary);
}
```

### Center Wall: Bulletin Board

```css
.center-wall {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  z-index: 3;
  position: relative;
}

/* ── Clock: industrial frame ────────────────────────── */
.clock-circle {
  width: 130px;
  height: 130px;
  border-radius: 50%;
  background: #0D0D0D;
  border: 3px solid var(--color-text);
  box-shadow: var(--shadow-red), inset 0 0 20px rgba(0,0,0,0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Courier New', monospace;
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--color-secondary);
  letter-spacing: 3px;
  position: relative;
}

.clock-circle::before {
  content: '';
  position: absolute;
  inset: 6px;
  border-radius: 50%;
  border: 1px solid var(--color-text-muted);
}

/* ── Calendar board: corkboard / paper ──────────────── */
.calendar-board {
  width: 280px;
  background: var(--color-surface);
  border: var(--border-brutal);
  box-shadow: var(--shadow-md);
  padding: 16px;
  position: relative;
}

.calendar-board::before {
  content: '//';
  position: absolute;
  top: -12px;
  left: 8px;
  font-size: 0.7rem;
  color: var(--color-secondary);
  font-weight: 700;
  letter-spacing: 2px;
  background: var(--color-bg);
  padding: 0 4px;
}

/* ── Todo list ──────────────────────────────────────── */
.todo-list {
  list-style: none;
  padding: 0;
  margin: 12px 0 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.todo-list li {
  font-size: 0.8rem;
  font-family: 'Courier New', monospace;
  color: var(--color-text);
  padding: 6px 8px;
  border-left: 2px solid var(--color-text-muted);
  letter-spacing: 0.5px;
}

.todo-list li.done {
  text-decoration: line-through;
  color: var(--color-text-muted);
  border-left-color: var(--color-text-muted);
  opacity: 0.5;
}

/* ── Rug: floor marker ──────────────────────────────── */
.rug {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 380px;
  height: 80px;
  border-radius: 50%;
  background: repeating-linear-gradient(
    90deg,
    var(--color-secondary) 0px,
    var(--color-secondary) 8px,
    transparent 8px,
    transparent 16px
  );
  opacity: 0.15;
  border: 1px solid var(--color-secondary);
}
```

---

## PROMPT C — `Study.css`: Physical Desk Aesthetic

Completely rewrite `/home/itramplay/Projects/UNI/FH/ClearMind/ClearMind/src/views/css/Study.css`.

The HTML structure in `Study.jsx` uses:
- `.study-container` — page wrapper
- `.study-layout` — three-column flex row
- `.study-panel` + `.tasks-panel` — left panel (tasks)
- `.study-panel` + `.audio-panel` — right panel (sounds)
- `.panel-header` — panel header bar
- `.tasks-list-container`, `.simple-task-list`, `.simple-task-list li`, `.done`
- `.add-btn` — circular + button
- `.study-center` — center column
- `.timer-circle`, `.active` — clickable timer
- `.timer-val`, `.timer-label` — timer text
- `.timer-actions`, `.timer-settings`
- `.audio-options`, `.audio-btn`, `.active`
- `.volume-slider-container`
- `.simple-modal-overlay`, `.simple-modal`, `.modal-btns`

### Design Goal: Physical Desk Metaphor

The screen should look like you're looking down at a wooden desk. Panels are physical objects: the tasks panel is a lined legal pad, the audio panel is a vintage cassette/radio device, the center shows an analog timer.

```css
/* ── Desk surface ───────────────────────────────────── */
.study-container {
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  padding: 20px 0;
  background:
    repeating-linear-gradient(
      90deg,
      transparent 0px, transparent 58px,
      rgba(61,43,26,0.15) 58px, rgba(61,43,26,0.15) 60px
    ),
    repeating-linear-gradient(
      180deg,
      transparent 0px, transparent 38px,
      rgba(61,43,26,0.08) 38px, rgba(61,43,26,0.08) 40px
    ),
    linear-gradient(160deg, #1A1208 0%, #0D0D0D 100%);
}

.study-layout {
  display: flex;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  gap: 24px;
  width: 100%;
  padding: 0 16px;
  align-items: flex-start;
}
```

### Tasks Panel: Legal Pad

```css
/* ── Shared panel base ──────────────────────────────── */
.study-panel {
  flex: 1;
  min-height: 420px;
  position: relative;
  display: flex;
  flex-direction: column;
}

/* ── Legal pad (tasks panel) ────────────────────────── */
.tasks-panel {
  background: var(--color-paper);
  border: 2px solid #1A0F00;
  box-shadow: var(--shadow-red);
  /* Ruled lines */
  background-image:
    repeating-linear-gradient(
      transparent 0px,
      transparent 27px,
      rgba(199,13,11,0.15) 27px,
      rgba(199,13,11,0.15) 28px
    ),
    linear-gradient(var(--color-paper), var(--color-paper));
  background-size: 100% 28px;
  padding: 0;
}

/* Spiral binding top */
.tasks-panel::before {
  content: '○  ○  ○  ○  ○  ○  ○  ○  ○  ○';
  display: block;
  text-align: center;
  font-size: 0.55rem;
  letter-spacing: 3px;
  color: #888;
  background: #2A2A2A;
  padding: 6px 0;
  border-bottom: 2px solid #1A0F00;
}

/* Red margin line */
.tasks-panel::after {
  content: '';
  position: absolute;
  top: 28px; /* after binding */
  left: 32px;
  bottom: 0;
  width: 2px;
  background: rgba(199,13,11,0.4);
  pointer-events: none;
}

.tasks-panel .panel-header {
  background: transparent;
  padding: 10px 12px 10px 40px;
  border-bottom: 1px solid rgba(199,13,11,0.2);
  font-family: 'Courier New', monospace;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: #1A0F00;
}

.tasks-panel .panel-header button {
  background: var(--color-secondary);
  color: var(--color-paper);
  border: none;
}

.simple-task-list {
  list-style: none;
  padding: 0 12px 0 40px;
  margin: 0;
  display: flex;
  flex-direction: column;
}

.simple-task-list li {
  font-family: 'Courier New', monospace;
  font-size: 0.82rem;
  color: #1A0F00;
  padding: 6px 4px;
  border-bottom: 1px dashed rgba(0,0,0,0.1);
  cursor: pointer;
  transition: background 0.15s;
  line-height: 28px; /* align to ruled lines */
}

.simple-task-list li:hover {
  background: rgba(199,13,11,0.08);
}

.simple-task-list li.done {
  text-decoration: line-through;
  opacity: 0.4;
}

.add-btn {
  width: 28px; height: 28px;
  border-radius: 2px;
  background: var(--color-secondary);
  color: var(--color-paper);
  border: none;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-sm);
  transition: box-shadow 0.15s;
}

.add-btn:hover {
  box-shadow: 3px 3px 0px #800;
}
```

### Center: Analog Timer

```css
.study-center {
  flex: 1.5;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

/* ── Timer: industrial stopwatch ────────────────────── */
.timer-circle {
  width: 260px;
  height: 260px;
  border-radius: 50%;
  background:
    radial-gradient(circle at 40% 35%, #2A2A2A, #0D0D0D);
  border: 4px solid var(--color-text);
  box-shadow:
    var(--shadow-md),
    inset 0 0 30px rgba(0,0,0,0.7),
    inset 0 2px 4px rgba(255,255,255,0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: border-color 0.3s, box-shadow 0.3s;
  position: relative;
}

/* Tick marks */
.timer-circle::before {
  content: '';
  position: absolute;
  inset: 10px;
  border-radius: 50%;
  border: 1px solid var(--color-text-muted);
  opacity: 0.4;
}

.timer-circle::after {
  content: '';
  position: absolute;
  inset: 16px;
  border-radius: 50%;
  background: repeating-conic-gradient(
    var(--color-text-muted) 0deg 2deg,
    transparent 2deg 30deg
  );
  opacity: 0.15;
}

.timer-circle.active {
  border-color: var(--color-secondary);
  box-shadow:
    4px 4px 0px var(--color-secondary),
    inset 0 0 30px rgba(199,13,11,0.1);
}

.timer-val {
  font-family: 'Courier New', monospace;
  font-size: 3.2rem;
  font-weight: 700;
  color: var(--color-text);
  letter-spacing: 4px;
  z-index: 1;
  text-shadow: 0 0 20px rgba(199,13,11,0.3);
}

.timer-circle.active .timer-val {
  color: var(--color-secondary);
}

.timer-label {
  font-family: 'Courier New', monospace;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 5px;
  text-transform: uppercase;
  color: var(--color-text-muted);
  z-index: 1;
  margin-top: 4px;
}

.timer-actions {
  display: flex;
  gap: 8px;
}

.timer-actions button, .timer-settings button, .timer-settings input {
  font-family: 'Courier New', monospace;
  font-size: 0.75rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  background: var(--color-surface);
  color: var(--color-text);
  border: var(--border-brutal);
  padding: 8px 16px;
  cursor: pointer;
  box-shadow: var(--shadow-sm);
  transition: box-shadow 0.15s, transform 0.1s;
}

.timer-actions button:hover, .timer-settings button:hover {
  box-shadow: var(--shadow-red);
  transform: translate(-1px, -1px);
}
```

### Audio Panel: Vintage Radio/Cassette

```css
/* ── Radio/cassette device ──────────────────────────── */
.audio-panel {
  background: var(--color-metal);
  border: 3px solid #111;
  box-shadow: var(--shadow-teal);
  position: relative;
  overflow: visible;
}

/* Speaker grille top */
.audio-panel::before {
  content: '';
  display: block;
  height: 48px;
  background:
    repeating-linear-gradient(
      90deg,
      #111 0px, #111 2px,
      #1E1E1E 2px, #1E1E1E 6px
    );
  border-bottom: 2px solid #333;
}

/* Brand label */
.audio-panel::after {
  content: 'CLEARMIND-FM';
  position: absolute;
  top: 14px;
  left: 50%;
  transform: translateX(-50%);
  font-family: 'Courier New', monospace;
  font-size: 0.55rem;
  font-weight: 700;
  letter-spacing: 4px;
  color: var(--color-primary);
  z-index: 1;
}

.audio-panel .panel-header {
  background: #161616;
  border-bottom: 2px solid #333;
  padding: 10px 12px;
  font-family: 'Courier New', monospace;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--color-primary);
}

.audio-options {
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 8px;
}

.audio-btn {
  width: 100%;
  padding: 12px 14px;
  text-align: left;
  background: #1A1A1A;
  color: var(--color-text-secondary);
  border: 1px solid #2A2A2A;
  border-radius: 0;
  cursor: pointer;
  font-family: 'Courier New', monospace;
  font-size: 0.78rem;
  letter-spacing: 1px;
  margin-bottom: 2px;
  transition: background 0.15s, color 0.15s, border-color 0.15s;
  position: relative;
}

/* Play indicator LED */
.audio-btn::before {
  content: '●';
  margin-right: 8px;
  font-size: 0.5rem;
  color: var(--color-text-muted);
  vertical-align: middle;
}

.audio-btn.active {
  background: #0D0D0D;
  color: var(--color-primary);
  border-color: var(--color-primary);
  box-shadow: inset 0 0 8px rgba(62,130,131,0.15);
}

.audio-btn.active::before {
  color: var(--color-primary);
  text-shadow: 0 0 6px var(--color-primary);
}

.volume-slider-container {
  padding: 12px 14px;
  border-top: 1px solid #2A2A2A;
}

.volume-slider-container input[type="range"] {
  width: 100%;
  accent-color: var(--color-primary);
  background: #111;
  height: 4px;
  cursor: pointer;
}
```

### Modal

```css
.simple-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  backdrop-filter: blur(4px);
}

.simple-modal {
  background: var(--color-paper);
  color: #1A0F00;
  border: 3px solid #1A0F00;
  box-shadow: 6px 6px 0px var(--color-secondary);
  max-width: 420px;
  width: 90%;
  padding: 28px;
  font-family: 'Courier New', monospace;
  position: relative;
}

.simple-modal::before {
  content: '[ NOTA ]';
  position: absolute;
  top: -12px;
  left: 12px;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 3px;
  background: var(--color-secondary);
  color: var(--color-paper);
  padding: 2px 8px;
}

.simple-modal input, .simple-modal textarea {
  width: 100%;
  background: transparent;
  border: none;
  border-bottom: 1px solid rgba(26,15,0,0.3);
  font-family: 'Courier New', monospace;
  font-size: 0.85rem;
  color: #1A0F00;
  padding: 6px 0;
  outline: none;
  box-sizing: border-box;
  margin-bottom: 12px;
}

.modal-btns {
  display: flex;
  gap: 8px;
  margin-top: 16px;
}

.modal-btns button {
  flex: 1;
  padding: 10px;
  font-family: 'Courier New', monospace;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  cursor: pointer;
  border: 2px solid #1A0F00;
  box-shadow: 2px 2px 0px #1A0F00;
}

.modal-btns button:first-child {
  background: var(--color-secondary);
  color: var(--color-paper);
}

.modal-btns button:last-child {
  background: transparent;
  color: #1A0F00;
}
```

### Responsive

```css
@media (max-width: 900px) {
  .study-layout { flex-direction: column; }
  .study-panel  { min-height: 300px; width: 100%; }
  .timer-circle { width: 200px; height: 200px; }
  .timer-val    { font-size: 2.4rem; }
}
```

---

## PROMPT D — `Relax.css`: Minimalist Brutalist

Completely rewrite `/home/itramplay/Projects/UNI/FH/ClearMind/ClearMind/src/views/css/Relax.css`.

The HTML structure uses:
- `.relax-container`, `.relax-layout`
- `.relax-panel`, `.guides-panel`, `.tips-panel`
- `.panel-header`
- `.guides-list-container`, `.guide-btn`, `.active`
- `.guide-details-box`
- `.relax-center`
- `.breathing-circle`, `.inspirar`, `.mantenir`, `.expirar`
- `.breath-text`, `.relax-hint`
- `.tips-content`, `.tip-card`

Design: Minimalist but sharp — no gradients on cards, flat black surfaces, strong borders, red/teal staging for breath phases.

```css
.relax-container {
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  padding: 20px 0;
}

.relax-layout {
  display: flex;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  gap: 24px;
  width: 100%;
  padding: 0 16px;
  align-items: flex-start;
}

.relax-panel {
  flex: 1;
  min-height: 450px;
  background: var(--color-surface);
  border: var(--border-brutal);
  box-shadow: var(--shadow-md);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.panel-header {
  padding: 12px 16px;
  border-bottom: var(--border-brutal);
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: 'Courier New', monospace;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 4px;
  text-transform: uppercase;
  color: var(--color-text);
  background: #111;
}

.guides-list-container, .tips-content {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  overflow-y: auto;
}

.guide-btn {
  width: 100%;
  padding: 12px 14px;
  text-align: left;
  background: var(--color-surface-alt);
  color: var(--color-text-secondary);
  border: 1px solid #2A2A2A;
  cursor: pointer;
  font-family: 'Courier New', monospace;
  font-size: 0.8rem;
  letter-spacing: 1px;
  transition: border-color 0.15s, color 0.15s;
}

.guide-btn.active {
  background: var(--color-surface);
  color: var(--color-primary);
  border-left: 3px solid var(--color-primary);
  box-shadow: inset 4px 0 0 var(--color-primary-bg);
}

.guide-details-box {
  margin: 0 12px 12px;
  padding: 12px;
  border-top: var(--border-brutal-teal);
  font-family: 'Courier New', monospace;
  font-size: 0.78rem;
  color: var(--color-text-secondary);
  line-height: 1.8;
}

.guide-details-box ol {
  padding-left: 16px;
  margin: 8px 0 0;
  color: var(--color-text);
}

/* ── Breathing center ───────────────────────────────── */
.relax-center {
  flex: 1.5;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
}

.breathing-circle {
  width: 280px;
  height: 280px;
  border-radius: 50%;
  background: var(--color-surface);
  border: 3px solid var(--color-text-muted);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 4s ease-in-out;
  position: relative;
  box-shadow: var(--shadow-md);
}

.breathing-circle::after {
  content: '';
  position: absolute;
  inset: -10px;
  border-radius: 50%;
  border: 1px solid currentColor;
  opacity: 0;
  transition: opacity 1s, inset 4s ease-in-out;
}

.breathing-circle.inspirar {
  transform: scale(1.25);
  border-color: var(--color-primary);
  border-width: 3px;
  box-shadow: 0 0 0 6px rgba(62,130,131,0.1), var(--shadow-teal);
  background: rgba(62,130,131,0.06);
}

.breathing-circle.inspirar::after {
  opacity: 0.4;
  inset: -20px;
  color: var(--color-primary);
  border-color: var(--color-primary);
}

.breathing-circle.mantenir {
  transform: scale(1.25);
  border-color: var(--color-secondary);
  box-shadow: 0 0 0 6px rgba(199,13,11,0.1), var(--shadow-red);
}

.breathing-circle.expirar {
  transform: scale(1);
  border-color: var(--color-text-muted);
  box-shadow: var(--shadow-md);
}

.breath-text {
  font-family: 'Courier New', monospace;
  font-size: 1.1rem;
  font-weight: 700;
  letter-spacing: 6px;
  text-transform: uppercase;
  color: var(--color-text);
  z-index: 1;
}

.relax-hint {
  font-family: 'Courier New', monospace;
  font-size: 0.7rem;
  letter-spacing: 2px;
  color: var(--color-text-muted);
  text-transform: uppercase;
}

/* ── Tips cards ─────────────────────────────────────── */
.tip-card {
  padding: 14px;
  background: var(--color-surface-alt);
  border: 1px solid #2A2A2A;
  border-left: 3px solid var(--color-primary);
  font-family: 'Courier New', monospace;
  font-size: 0.78rem;
  color: var(--color-text-secondary);
  line-height: 1.6;
}

@media (max-width: 900px) {
  .relax-layout   { flex-direction: column; }
  .relax-panel    { min-height: 280px; width: 100%; }
  .breathing-circle { width: 220px; height: 220px; }
}
```

---

## PROMPT E — `Header.module.css`: Brutalist Navigation Bar

Rewrite `/home/itramplay/Projects/UNI/FH/ClearMind/ClearMind/src/components/css/Header.module.css`.

CSS Modules file — keep all existing class names exactly.

```css
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
  background: #080808;
  border-bottom: 2px solid var(--color-secondary);
  position: sticky;
  top: 0;
  z-index: 1000;
  padding: 0 20px;
}

.logo {
  font-family: 'Courier New', monospace;
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 6px;
  text-transform: uppercase;
  color: var(--color-text);
  flex: 1;
}

.logo::before {
  content: '> ';
  color: var(--color-secondary);
}

.nav {
  flex: 2;
  display: flex;
  justify-content: center;
}

.tabList {
  list-style: none;
  display: flex;
  gap: 0;
  padding: 0;
  margin: 0;
  border: var(--border-brutal);
}

.tabItem {
  display: flex;
}

.tabButton {
  padding: 8px 24px;
  font-family: 'Courier New', monospace;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 3px;
  text-transform: uppercase;
  text-decoration: none;
  color: var(--color-text-muted);
  background: transparent;
  border: none;
  border-right: 1px solid #2A2A2A;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  white-space: nowrap;
}

.tabButton:hover {
  background: var(--color-surface);
  color: var(--color-text);
}

.tabButton.active {
  background: var(--color-secondary);
  color: var(--color-paper);
  font-weight: 700;
}

.spacer {
  flex: 1;
}
```

---

## PROMPT F — `Footer.module.css`: Minimal Footer

Rewrite `/home/itramplay/Projects/UNI/FH/ClearMind/ClearMind/src/components/css/Footer.module.css`.

Keep all existing class names exactly.

```css
.footer {
  padding: 16px 20px;
  margin-top: auto;
  border-top: 1px solid #1A1A1A;
  background: #080808;
}

.linksContainer {
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
  margin-bottom: 8px;
}

.linkGroup {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.groupTitle {
  font-family: 'Courier New', monospace;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--color-text-muted);
}

.link {
  font-family: 'Courier New', monospace;
  font-size: 0.7rem;
  color: var(--color-text-muted);
  text-decoration: none;
  letter-spacing: 1px;
  transition: color 0.15s;
}

.link:hover {
  color: var(--color-primary);
  text-decoration: underline;
}

.copyright {
  font-family: 'Courier New', monospace;
  font-size: 0.65rem;
  letter-spacing: 2px;
  color: var(--color-text-muted);
  text-align: center;
  margin-top: 6px;
}
```
