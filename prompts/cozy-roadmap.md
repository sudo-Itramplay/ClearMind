# ClearMind — Cozy Isometric Pixel Art Refactor
## Full Roadmap & Prompt Guide

---

## TAULA RESUM

| # | Fase | Target AI | Complexity | Arxiu/Output | Depèn de |
|---|------|-----------|------------|--------------|----------|
| 1 | Design Tokens (CSS Variables) | Code AI | SIMPLE | `src/assets/index.css` | — |
| 2 | Font Integration (Pixelify Sans) | Code AI | SIMPLE | `index.html` + `index.css` | — |
| 3 | Sprites: Hall Room | Image AI | COMPLEX | `public/sprites/hall/` | — |
| 4 | Sprites: Study Desk Objects | Image AI | COMPLEX | `public/sprites/study/` | — |
| 5 | Sprites: Relax Space | Image AI | SIMPLE | `public/sprites/relax/` | — |
| 6 | Sprites: UI Kit Decorations | Image AI | SIMPLE | `public/sprites/ui/` | — |
| 7 | Hall.css — Cozy Isometric Room | Code AI | COMPLEX | `src/views/css/Hall.css` | 1, 2 |
| 8 | Study.css — Cute Desk | Code AI | COMPLEX | `src/views/css/Study.css` | 1, 2 |
| 9 | Relax.css — Soft Space | Code AI | SIMPLE | `src/views/css/Relax.css` | 1, 2 |
| 10 | Header.module.css | Code AI | SIMPLE | `src/components/css/Header.module.css` | 1, 2 |
| 11 | Footer.module.css | Code AI | SIMPLE | `src/components/css/Footer.module.css` | 1, 2 |
| 12 | Sprite Integration (JSX) | Code AI | COMPLEX | `Hall.jsx`, `Study.jsx`, `Relax.jsx` | 3,4,5,7,8,9 |

**Ordre d'execució:**
- **Grup A (paral·lel):** 1, 2, 3, 4, 5, 6
- **Grup B (paral·lel, esperar Grup A):** 7, 8, 9, 10, 11
- **Grup C (final):** 12

---

## COMANDES OPENCODE

```bash
# ── Grup A ──────────────────────────────────────────────────────────────────
opencode agent run code-executor "Modify ClearMind/src/assets/index.css following PROMPT 1 in prompts/cozy-roadmap.md"
opencode agent run code-executor "Modify ClearMind/index.html and ClearMind/src/assets/index.css following PROMPT 2 in prompts/cozy-roadmap.md"

# ── Grup B (després de Grup A) ──────────────────────────────────────────────
opencode agent run code-executor "Modify ClearMind/src/views/css/Hall.css following PROMPT 7 in prompts/cozy-roadmap.md"
opencode agent run code-executor "Modify ClearMind/src/views/css/Study.css following PROMPT 8 in prompts/cozy-roadmap.md"
opencode agent run code-executor "Modify ClearMind/src/views/css/Relax.css following PROMPT 9 in prompts/cozy-roadmap.md"
opencode agent run code-executor "Modify ClearMind/src/components/css/Header.module.css following PROMPT 10 in prompts/cozy-roadmap.md"
opencode agent run code-executor "Modify ClearMind/src/components/css/Footer.module.css following PROMPT 11 in prompts/cozy-roadmap.md"

# ── Grup C (després de Grups A+B) ───────────────────────────────────────────
opencode agent run code-executor "Modify ClearMind/src/views/Hall.jsx, Study.jsx and Relax.jsx following PROMPT 12 in prompts/cozy-roadmap.md"
```

---

## PROMPTS DETALLATS

---

### PROMPT 1 — Design Tokens
**Target AI:** Code AI (code-executor)
**Complexity:** [SIMPLE]
**Order:** 1

Rewrite the `:root` block in `/home/itramplay/Projects/UNI/FH/ClearMind/ClearMind/src/assets/index.css` with a Cozy Isometric Pixel Art / Unpacking-game-inspired design system. Keep every existing variable name but update all values. Add the new variables listed. Do not remove any existing variable — only update values and append new ones.

```css
/* ── Core palette ─────────────────────────────────────── */
--color-bg:             #F7F3EE;   /* warm cream canvas */
--color-surface:        #FFFDF7;   /* soft warm white for panels */
--color-surface-alt:    #FFF5F9;   /* light pink tinted surface */
--color-primary:        #9F7AEA;   /* soft lavender (replaces teal) */
--color-primary-bg:     #EDE9FE;   /* lavender wash */
--color-secondary:      #F687B3;   /* pastel pink accent */
--color-secondary-bg:   #FED7E2;   /* pink wash */
--color-text:           #2D3748;   /* deep soft blue-gray, not pure black */
--color-text-secondary: #718096;   /* medium gray */
--color-text-muted:     #A0AEC0;   /* light gray */
--color-error:          #FC8181;   /* soft red */
--color-success:        #68D391;   /* mint green */
--color-focus-ring:     #B794F4;   /* lilac ring */

/* ── Cozy extras ──────────────────────────────────────── */
--color-wood:           #E9D8A6;   /* light warm wood */
--color-wood-dark:      #C9A96E;   /* darker wood grain */
--color-wood-outline:   #8B6343;   /* wood border */
--color-sky:            #BEE3F8;   /* sky blue accent */
--color-sky-dark:       #90CDF4;
--color-lilac:          #B794F4;   /* main Persona accent */
--color-lilac-dark:     #805AD5;
--color-pink:           #FBD5E5;   /* pastel pink */
--color-mint:           #C6F6D5;   /* soft green */
--color-paper:          #FEFCF3;   /* notebook paper */
--color-paper-lines:    rgba(159, 122, 234, 0.12); /* ruled line color */

/* ── Cozy shadows (soft, pastel-tinted) ───────────────── */
--shadow-sm:    2px 3px 0px rgba(159,122,234,0.20);
--shadow-md:    3px 5px 0px rgba(159,122,234,0.18);
--shadow-lg:    4px 8px 0px rgba(159,122,234,0.15);
--shadow-pink:  3px 5px 0px rgba(246,135,179,0.30);
--shadow-sky:   3px 5px 0px rgba(144,205,244,0.35);
--shadow-inset: inset 2px 2px 6px rgba(0,0,0,0.06);

/* ── Borders ──────────────────────────────────────────── */
--border-cozy:      2px solid rgba(45,55,72,0.12);
--border-lilac:     2px solid var(--color-lilac);
--border-pink:      2px solid var(--color-secondary);
--border-sky:       2px solid var(--color-sky);
--border-dim:       1px solid rgba(45,55,72,0.08);

/* ── Radius — round & bubbly ──────────────────────────── */
--radius-sm:    6px;
--radius-md:    12px;
--radius-lg:    18px;
--radius-xl:    24px;
--radius-pill:  9999px;
```

Also update `body`:
- `background-color`: `var(--color-bg)`
- `font-family`: `'Pixelify Sans', 'Press Start 2P', system-ui, sans-serif`
- `color`: `var(--color-text)`

Update `#root`:
- `max-width`: `1200px`
- `background`: `var(--color-bg)`
- Remove any dark border styles, replace with `--border-dim`

---

### PROMPT 2 — Font Integration
**Target AI:** Code AI (code-executor)
**Complexity:** [SIMPLE]
**Order:** 1 (parallel with PROMPT 1)

1. In `/home/itramplay/Projects/UNI/FH/ClearMind/ClearMind/index.html`, add inside `<head>` before the closing `</head>` tag:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Pixelify+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
```

2. Verify that `body { font-family }` in `index.css` already has `'Pixelify Sans'` as the first font (from PROMPT 1). If PROMPT 1 hasn't run yet, prepend it: `font-family: 'Pixelify Sans', system-ui, sans-serif;`

---

### PROMPT 3 — Sprites: Hall Room
**Target AI:** Image AI (Midjourney / DALL-E 3 / Stable Diffusion)
**Complexity:** [COMPLEX]
**Order:** 1 (parallel)

Generate the following pixel art sprites for the ClearMind Hall view. Save each as a PNG with transparent background.

**Style guidelines for ALL sprites in this set:**
- Pixel art, isometric perspective (45° camera angle, looking slightly down-left)
- Palette: warm creams (#FEFCF3), light wood (#E9D8A6, #C9A96E), lavender (#B794F4), sky blue (#BEE3F8)
- Outlines: NOT pure black — use a dark version of the object's dominant color (e.g., dark wood outline #6B4226 for wooden objects)
- Style: clean, cute, "Unpacking" game aesthetic — chunky pixels, friendly shapes, no sharp industrial edges
- Shading: 2-3 tones maximum per object, cel-shading style

**Assets to generate:**

1. `hall-door-wood-closed.png` (128×192px) — Isometric wooden door, closed. Warm honey-brown wood with cute vertical grain lines, small rounded brass doorknob, decorative panel inset. Outline: dark brown #6B4226.

2. `hall-door-wood-open.png` (128×192px) — Same door, slightly ajar (~15°), revealing warm glow/light beyond.

3. `hall-floor-tile.png` (64×32px) — Isometric floor tile. Light cream/beige wood plank, subtle horizontal grain. Tileable.

4. `hall-corkboard.png` (160×120px) — Isometric bulletin/cork board. Warm cork texture, small colored pins (red, blue, yellow), a couple of tiny paper notes pinned to it.

5. `hall-clock-wall.png` (80×80px) — Cute round wall clock. Cream face, lavender (#B794F4) numbers/hour markers, simple hands, rounded frame in light wood color.

6. `hall-rug.png` (200×80px) — Isometric elliptical rug. Pastel colors: alternating lavender and sky blue concentric rings, soft fringe edges.

---

### PROMPT 4 — Sprites: Study Desk Objects
**Target AI:** Image AI (Midjourney / DALL-E 3 / Stable Diffusion)
**Complexity:** [COMPLEX]
**Order:** 1 (parallel)

Generate pixel art sprites for the ClearMind Study view (desk top-down/slight isometric angle).

**Style:** Same as PROMPT 3 — isometric pixel art, Unpacking aesthetic, pastel palette, colored outlines.

**Assets to generate:**

1. `study-notebook-cover.png` (120×160px) — Cute spiral-bound notebook, top-down slight angle. Pastel pink cover (#FBD5E5) with a small heart or star doodle. Spiral binding visible on left side. Outline: dark pink #C05080.

2. `study-notebook-open.png` (240×160px) — Same notebook, open flat. White ruled pages, light blue horizontal lines, faint pink margin line on left. A cute doodle in the corner.

3. `study-radio.png` (160×100px) — Vintage boombox/cassette radio. Isometric view. Pastel sky blue (#BEE3F8) body, two circular speaker grilles with pixel mesh pattern, small cassette window in center, big round dial knob, lavender accent buttons. Outline: dark sky blue #4A90BE.

4. `study-timer.png` (100×100px) — Cute desk egg timer / alarm clock. Round, cream-white body, lavender (#B794F4) face with simple number markers, small bell on top. Outline: purple #6B46C1.

5. `study-pencil-cup.png` (64×80px) — Small ceramic cup holding colored pencils. Pastel mint green cup, pencils in pink/yellow/blue sticking out top.

6. `study-coffee-mug.png` (64×64px) — Cute steaming coffee mug. Cream body, small lavender heart on the side, visible steam wisps.

---

### PROMPT 5 — Sprites: Relax Space
**Target AI:** Image AI (Midjourney / DALL-E 3 / Stable Diffusion)
**Complexity:** [SIMPLE]
**Order:** 1 (parallel)

Generate pixel art sprites for the ClearMind Relax view.

**Style:** Same as PROMPT 3 — isometric, Unpacking aesthetic, pastel palette, colored outlines.

**Assets to generate:**

1. `relax-cushion.png` (120×80px) — Isometric meditation floor cushion (zafu). Round, plump. Lavender (#B794F4) fabric with soft folds, small tassel.

2. `relax-plant.png` (80×120px) — Cute potted plant. Terra-cotta colored pot (pastel orange), round green succulent or small monstera leaf. Outline: dark earthy tone.

3. `relax-candle.png` (48×64px) — Small lit candle in a glass holder. Warm amber glow, small flame, cream wax. Cute pixel flame animation (2 frames).

4. `relax-stars.png` (128×64px) — Decorative element: 3-4 small pixel stars/sparkles in pastel yellow and white. For use as floating decoration.

---

### PROMPT 6 — Sprites: UI Kit Decorations
**Target AI:** Image AI (Midjourney / DALL-E 3 / Stable Diffusion)
**Complexity:** [SIMPLE]
**Order:** 1 (parallel)

Generate small pixel art UI decoration assets.

**Style:** Pixel art, flat/2D (not isometric), same pastel palette.

**Assets to generate:**

1. `ui-corner-flower.png` (32×32px) — Tiny cute flower (3 petals, circle center) in lavender. For modal corners.

2. `ui-divider.png` (256×16px) — Horizontal decorative divider. Alternating small stars ✦ and dots in lavender and pink.

3. `ui-checkmark.png` (24×24px) — Pixel art checkmark inside a small rounded square. Sky blue fill, white check.

4. `ui-pin.png` (24×32px) — Cute thumbtack/pin. Red round head, light metal pin. For bulletin board (Hall).

5. `ui-tab-left.png` + `ui-tab-right.png` (16×32px each) — Notebook tab decorations. Pastel colored ear tabs for panel headers.

---

### PROMPT 7 — Hall.css: Cozy Isometric Room
**Target AI:** Code AI (code-executor)
**Complexity:** [COMPLEX]
**Order:** 2 (after PROMPT 1 + 2)

Completely rewrite `/home/itramplay/Projects/UNI/FH/ClearMind/ClearMind/src/views/css/Hall.css`.

The Hall.jsx component renders these CSS class names (do NOT rename them):
`.hall-container`, `.door`, `.left-door`, `.right-door`, `.center-wall`, `.clock-circle`, `.calendar-board`, `.todo-list`, `.todo-list li`, `.done`, `.rug`

**Design Goal:** Replace the dark perspective hallway with a cozy, top-down slightly isometric room. The aesthetic is Unpacking / Animal Crossing: warm backgrounds, rounded corners, soft pastel shadows, cute wooden doors that look like real furniture items.

```css
/* ── Room background: warm cream with subtle tile pattern ─ */
.hall-container {
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 30px 50px;
  position: relative;
  background-color: var(--color-wood);
  background-image:
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 63px,
      rgba(139,99,67,0.07) 63px,
      rgba(139,99,67,0.07) 65px
    ),
    repeating-linear-gradient(
      90deg,
      transparent,
      transparent 63px,
      rgba(139,99,67,0.05) 63px,
      rgba(139,99,67,0.05) 65px
    );
  border-radius: var(--radius-lg);
  overflow: hidden;
}

/* ── Wall behind doors ─────────────────────────────────── */
.hall-container::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 45%;
  background: linear-gradient(
    to bottom,
    #F0EAF8 0%,
    #EDE4F5 60%,
    transparent 100%
  );
  border-bottom: 2px dashed rgba(183,148,244,0.2);
  z-index: 0;
}

/* ── Baseboard ─────────────────────────────────────────── */
.hall-container::after {
  content: '';
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 28px;
  background: var(--color-wood-dark);
  border-top: 3px solid var(--color-wood-outline);
  z-index: 0;
}

/* ── Door base — cute furniture aesthetic ─────────────── */
.door {
  width: 150px;
  height: 280px;
  position: relative;
  cursor: pointer;
  text-decoration: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  padding-bottom: 24px;
  z-index: 2;
  border-radius: var(--radius-md) var(--radius-md) var(--radius-sm) var(--radius-sm);
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
              box-shadow 0.3s ease;

  /* Warm wood gradient */
  background:
    repeating-linear-gradient(
      180deg,
      transparent 0px, transparent 22px,
      rgba(139,99,67,0.07) 22px, rgba(139,99,67,0.07) 24px
    ),
    linear-gradient(170deg, #F0D9A8, var(--color-wood-dark) 90%);

  border: 2px solid var(--color-wood-outline);
  box-shadow: var(--shadow-md);
}

/* ── Door frame inset ──────────────────────────────────── */
.door::before {
  content: '';
  position: absolute;
  top: 16px; left: 14px; right: 14px; bottom: 50px;
  border: 2px solid rgba(139,99,67,0.35);
  border-radius: var(--radius-sm);
  background: linear-gradient(
    145deg,
    rgba(255,255,255,0.12),
    rgba(0,0,0,0.04)
  );
}

/* ── Doorknob ──────────────────────────────────────────── */
.door::after {
  content: '';
  position: absolute;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 30%, #FFE8B0, #C9A96E);
  border: 2px solid var(--color-wood-outline);
  box-shadow: 0 1px 2px rgba(0,0,0,0.2);
  bottom: 30px;
}

/* ── Door label ────────────────────────────────────────── */
.door span, .door > * {
  font-family: 'Pixelify Sans', monospace;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--color-wood-outline);
  z-index: 1;
  text-shadow: 0 1px 0 rgba(255,255,255,0.5);
}

/* ── Left door ─────────────────────────────────────────── */
.left-door {
  transform: perspective(600px) rotateY(12deg) translateX(-8px);
  transform-origin: left center;
}
.left-door::after { right: 20px; left: auto; }

.left-door:hover {
  transform: perspective(600px) rotateY(4deg) translateX(-4px) scale(1.04);
  box-shadow: var(--shadow-pink);
  border-color: var(--color-secondary);
}

/* ── Right door ────────────────────────────────────────── */
.right-door {
  transform: perspective(600px) rotateY(-12deg) translateX(8px);
  transform-origin: right center;
}
.right-door::after { left: 20px; right: auto; }

.right-door:hover {
  transform: perspective(600px) rotateY(-4deg) translateX(4px) scale(1.04);
  box-shadow: var(--shadow-sky);
  border-color: var(--color-sky);
}

/* ── Center wall / bulletin area ───────────────────────── */
.center-wall {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  z-index: 3;
  position: relative;
}

/* ── Clock ─────────────────────────────────────────────── */
.clock-circle {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: var(--color-paper);
  border: 3px solid var(--color-wood-outline);
  box-shadow: var(--shadow-md), var(--shadow-inset);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Pixelify Sans', monospace;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-primary);
  letter-spacing: 2px;
  position: relative;
}

.clock-circle::before {
  content: '';
  position: absolute;
  inset: 7px;
  border-radius: 50%;
  border: 1px solid rgba(159,122,234,0.2);
}

/* ── Calendar / corkboard ──────────────────────────────── */
.calendar-board {
  width: 260px;
  background: #D4A96A;
  background-image:
    repeating-linear-gradient(
      45deg,
      transparent 0px, transparent 8px,
      rgba(139,99,67,0.1) 8px, rgba(139,99,67,0.1) 10px
    );
  border: 3px solid var(--color-wood-outline);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  padding: 14px;
  position: relative;
}

.calendar-board::before {
  content: '📌';
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 1.2rem;
}

/* ── Todo list ─────────────────────────────────────────── */
.todo-list {
  list-style: none;
  padding: 0;
  margin: 10px 0 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.todo-list li {
  font-family: 'Pixelify Sans', monospace;
  font-size: 0.78rem;
  color: #4A2E0A;
  padding: 6px 10px;
  background: rgba(255,255,255,0.55);
  border-radius: var(--radius-sm);
  border: 1px solid rgba(139,99,67,0.2);
  box-shadow: 0 1px 0 rgba(255,255,255,0.6);
  /* look like a pinned paper note */
  letter-spacing: 0.3px;
}

.todo-list li.done {
  text-decoration: line-through;
  opacity: 0.45;
  background: rgba(255,255,255,0.25);
}

/* ── Rug ───────────────────────────────────────────────── */
.rug {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  width: 400px;
  height: 90px;
  border-radius: 50%;
  background: repeating-radial-gradient(
    ellipse at center,
    var(--color-lilac) 0px,
    var(--color-lilac) 8px,
    var(--color-sky) 8px,
    var(--color-sky) 18px,
    var(--color-pink) 18px,
    var(--color-pink) 26px,
    transparent 26px,
    transparent 34px
  );
  opacity: 0.55;
  border: 2px solid var(--color-lilac-dark);
  z-index: 1;
}

/* ── Responsive ────────────────────────────────────────── */
@media (max-width: 768px) {
  .hall-container { flex-direction: column; align-items: center; gap: 20px; padding: 20px; }
  .door { width: 120px; height: 220px; transform: none !important; }
  .rug  { width: 250px; height: 60px; }
}
```

---

### PROMPT 8 — Study.css: Cute Desk
**Target AI:** Code AI (code-executor)
**Complexity:** [COMPLEX]
**Order:** 2 (after PROMPT 1 + 2)

Completely rewrite `/home/itramplay/Projects/UNI/FH/ClearMind/ClearMind/src/views/css/Study.css`.

Study.jsx uses these class names (do NOT rename):
`.study-container`, `.study-layout`, `.study-panel`, `.tasks-panel`, `.audio-panel`, `.panel-header`, `.tasks-list-container`, `.simple-task-list`, `.simple-task-list li`, `.done`, `.add-btn`, `.study-center`, `.timer-circle`, `.active`, `.timer-val`, `.timer-label`, `.timer-actions`, `.timer-settings`, `.audio-options`, `.audio-btn`, `.volume-slider-container`, `.simple-modal-overlay`, `.simple-modal`, `.modal-btns`

**Design Goal:** The screen looks like looking at a real desk from above. Panels are physical desk objects: tasks panel = open spiral notebook, audio panel = pastel boombox/cassette radio, center = cute alarm clock timer.

```css
/* ── Desk mat background ────────────────────────────────── */
.study-container {
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  padding: 20px 0;
  background:
    repeating-linear-gradient(
      90deg, transparent 0px, transparent 98px,
      rgba(159,122,234,0.05) 98px, rgba(159,122,234,0.05) 100px
    ),
    linear-gradient(160deg, #F0EAF8 0%, var(--color-bg) 100%);
}

.study-layout {
  display: flex;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  gap: 20px;
  width: 100%;
  padding: 0 16px;
  align-items: flex-start;
}

/* ── Shared panel base ──────────────────────────────────── */
.study-panel {
  flex: 1;
  min-height: 420px;
  display: flex;
  flex-direction: column;
  border-radius: var(--radius-lg);
  overflow: hidden;
}

/* ── Tasks panel: spiral notebook ──────────────────────── */
.tasks-panel {
  background: var(--color-paper);
  border: var(--border-cozy);
  box-shadow: var(--shadow-pink);
  background-image:
    repeating-linear-gradient(
      transparent 0px, transparent 27px,
      var(--color-paper-lines) 27px, var(--color-paper-lines) 28px
    );
  background-size: 100% 28px;
  position: relative;
}

/* Notebook cover header (pink) */
.tasks-panel .panel-header {
  background: var(--color-secondary);
  color: white;
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
  padding: 12px 16px;
  font-family: 'Pixelify Sans', monospace;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  border-bottom: none;
  box-shadow: 0 2px 0px rgba(200,90,130,0.25);
}

/* Red margin line */
.tasks-panel::after {
  content: '';
  position: absolute;
  top: 52px;
  left: 38px;
  bottom: 12px;
  width: 2px;
  background: rgba(246,135,179,0.4);
  pointer-events: none;
}

.tasks-list-container {
  padding: 8px 12px 12px 44px;
  overflow-y: auto;
  flex: 1;
}

.simple-task-list {
  list-style: none;
  padding: 0; margin: 0;
  display: flex; flex-direction: column;
}

.simple-task-list li {
  font-family: 'Pixelify Sans', monospace;
  font-size: 0.8rem;
  color: var(--color-text);
  padding: 4px 6px;
  cursor: pointer;
  border-bottom: 1px solid rgba(159,122,234,0.1);
  line-height: 28px;
  transition: background 0.15s;
  border-radius: var(--radius-sm);
}

.simple-task-list li:hover {
  background: var(--color-primary-bg);
}

.simple-task-list li.done {
  text-decoration: line-through;
  opacity: 0.4;
}

.add-btn {
  width: 28px; height: 28px;
  border-radius: 50%;
  background: var(--color-secondary);
  color: white;
  border: none;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  box-shadow: var(--shadow-sm);
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.add-btn:hover {
  transform: scale(1.2) rotate(15deg);
  box-shadow: var(--shadow-pink);
}

/* ── Center: cute timer ─────────────────────────────────── */
.study-center {
  flex: 1.5;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.timer-circle {
  width: 240px; height: 240px;
  border-radius: 50%;
  background: var(--color-surface);
  border: 4px solid var(--color-lilac);
  box-shadow: var(--shadow-md), var(--shadow-inset);
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  cursor: pointer;
  transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1),
              border-color 0.4s, box-shadow 0.4s;
  position: relative;
}

/* Tick ring */
.timer-circle::before {
  content: '';
  position: absolute;
  inset: 12px;
  border-radius: 50%;
  border: 1px solid rgba(183,148,244,0.2);
}

/* Minute markers — conic */
.timer-circle::after {
  content: '';
  position: absolute;
  inset: 18px;
  border-radius: 50%;
  background: repeating-conic-gradient(
    rgba(183,148,244,0.15) 0deg 3deg,
    transparent 3deg 30deg
  );
}

.timer-circle.active {
  border-color: var(--color-secondary);
  box-shadow: var(--shadow-pink), var(--shadow-inset);
  transform: scale(1.04);
}

.timer-val {
  font-family: 'Pixelify Sans', monospace;
  font-size: 3rem; font-weight: 700;
  color: var(--color-text);
  letter-spacing: 3px;
  z-index: 1;
}

.timer-circle.active .timer-val {
  color: var(--color-secondary);
}

.timer-label {
  font-family: 'Pixelify Sans', monospace;
  font-size: 0.6rem; font-weight: 700;
  letter-spacing: 5px; text-transform: uppercase;
  color: var(--color-primary); z-index: 1;
  margin-top: 2px;
}

.timer-actions { display: flex; gap: 8px; }

.timer-actions button,
.timer-settings button,
.timer-settings input {
  font-family: 'Pixelify Sans', monospace;
  font-size: 0.72rem;
  letter-spacing: 2px; text-transform: uppercase;
  background: var(--color-surface);
  color: var(--color-text);
  border: var(--border-cozy);
  border-radius: var(--radius-md);
  padding: 8px 16px;
  cursor: pointer;
  box-shadow: var(--shadow-sm);
  transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s;
}

.timer-actions button:hover,
.timer-settings button:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-pink);
  border-color: var(--color-secondary);
}

/* ── Audio panel: pastel boombox ────────────────────────── */
.audio-panel {
  background: var(--color-sky);
  border: 2px solid var(--color-sky-dark);
  box-shadow: var(--shadow-sky);
  border-radius: var(--radius-lg);
  overflow: hidden;
  position: relative;
}

/* Speaker grille: pixel mesh pattern */
.audio-panel::before {
  content: '';
  display: block;
  height: 54px;
  background:
    radial-gradient(circle, rgba(45,55,72,0.18) 1.5px, transparent 1.5px),
    linear-gradient(var(--color-sky-dark), var(--color-sky));
  background-size: 8px 8px, 100% 100%;
  border-bottom: 2px solid var(--color-sky-dark);
}

/* Brand label overlay */
.audio-panel::after {
  content: '♫ FM';
  position: absolute;
  top: 16px; left: 50%;
  transform: translateX(-50%);
  font-family: 'Pixelify Sans', monospace;
  font-size: 0.6rem; font-weight: 700;
  letter-spacing: 4px;
  color: rgba(45,55,72,0.6);
  z-index: 1;
}

.audio-panel .panel-header {
  background: rgba(144,205,244,0.6);
  border-bottom: 1px solid var(--color-sky-dark);
  padding: 10px 14px;
  font-family: 'Pixelify Sans', monospace;
  font-size: 0.72rem; font-weight: 700;
  letter-spacing: 3px; text-transform: uppercase;
  color: var(--color-text);
}

.audio-options { display: flex; flex-direction: column; gap: 6px; padding: 10px; }

.audio-btn {
  width: 100%; padding: 10px 14px; text-align: left;
  background: rgba(255,255,255,0.5);
  color: var(--color-text-secondary);
  border: 1px solid rgba(144,205,244,0.5);
  border-radius: var(--radius-md);
  cursor: pointer;
  font-family: 'Pixelify Sans', monospace;
  font-size: 0.78rem; letter-spacing: 1px;
  transition: background 0.15s, border-color 0.15s, transform 0.15s;
}

.audio-btn::before { content: '▷ '; font-size: 0.65rem; color: var(--color-text-muted); }

.audio-btn.active {
  background: white;
  color: var(--color-primary);
  border-color: var(--color-primary);
  box-shadow: var(--shadow-sm);
  transform: translateX(2px);
}

.audio-btn.active::before { content: '◉ '; color: var(--color-primary); }

.volume-slider-container {
  padding: 10px 14px;
  border-top: 1px solid rgba(144,205,244,0.4);
}

.volume-slider-container input[type="range"] {
  width: 100%; accent-color: var(--color-primary);
  cursor: pointer; height: 4px;
}

/* ── Modal ──────────────────────────────────────────────── */
.simple-modal-overlay {
  position: fixed; inset: 0;
  background: rgba(45,55,72,0.35);
  display: flex; align-items: center; justify-content: center;
  z-index: 100; backdrop-filter: blur(6px);
}

.simple-modal {
  background: var(--color-paper);
  border: var(--border-cozy);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-pink);
  max-width: 420px; width: 90%;
  padding: 28px;
  position: relative;
}

.simple-modal::before {
  content: '✦ NOTA';
  position: absolute;
  top: -13px; left: 20px;
  font-family: 'Pixelify Sans', monospace;
  font-size: 0.65rem; font-weight: 700; letter-spacing: 3px;
  background: var(--color-secondary); color: white;
  padding: 3px 10px; border-radius: var(--radius-pill);
}

.simple-modal input,
.simple-modal textarea {
  width: 100%; background: transparent;
  border: none; border-bottom: 2px solid rgba(159,122,234,0.25);
  font-family: 'Pixelify Sans', monospace; font-size: 0.9rem;
  color: var(--color-text); padding: 8px 0; outline: none;
  box-sizing: border-box; margin-bottom: 14px;
}

.simple-modal input:focus,
.simple-modal textarea:focus { border-bottom-color: var(--color-primary); }

.modal-btns { display: flex; gap: 10px; margin-top: 16px; }

.modal-btns button {
  flex: 1; padding: 10px;
  font-family: 'Pixelify Sans', monospace;
  font-size: 0.75rem; font-weight: 700;
  letter-spacing: 2px; text-transform: uppercase;
  cursor: pointer; border-radius: var(--radius-md);
  transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1);
}

.modal-btns button:hover { transform: translateY(-2px); }

.modal-btns button:first-child {
  background: var(--color-primary); color: white;
  border: var(--border-lilac); box-shadow: var(--shadow-md);
}

.modal-btns button:last-child {
  background: transparent; color: var(--color-text-secondary);
  border: var(--border-cozy);
}

/* ── Responsive ─────────────────────────────────────────── */
@media (max-width: 900px) {
  .study-layout { flex-direction: column; }
  .study-panel  { min-height: 280px; width: 100%; }
  .timer-circle { width: 190px; height: 190px; }
  .timer-val    { font-size: 2.2rem; }
}
```

---

### PROMPT 9 — Relax.css: Soft Cozy Space
**Target AI:** Code AI (code-executor)
**Complexity:** [SIMPLE]
**Order:** 2 (after PROMPT 1 + 2)

Completely rewrite `/home/itramplay/Projects/UNI/FH/ClearMind/ClearMind/src/views/css/Relax.css`.

Class names in Relax.jsx (do NOT rename):
`.relax-container`, `.relax-layout`, `.relax-panel`, `.guides-panel`, `.tips-panel`, `.panel-header`, `.guides-list-container`, `.guide-btn`, `.active`, `.guide-details-box`, `.relax-center`, `.breathing-circle`, `.inspirar`, `.mantenir`, `.expirar`, `.breath-text`, `.relax-hint`, `.tips-content`, `.tip-card`

Design: Soft, airy lavender-and-sky-blue palette. Round panels. Breathing circle glows with pastel colors per stage.

```css
.relax-container {
  min-height: 80vh;
  display: flex; flex-direction: column;
  padding: 20px 0;
  background: linear-gradient(160deg, #EDE9FE 0%, var(--color-bg) 50%);
}

.relax-layout {
  display: flex; justify-content: space-between;
  max-width: 1200px; margin: 0 auto;
  gap: 20px; width: 100%; padding: 0 16px;
  align-items: flex-start;
}

.relax-panel {
  flex: 1; min-height: 450px;
  background: var(--color-surface);
  border: var(--border-cozy);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
  display: flex; flex-direction: column;
  overflow: hidden;
}

.panel-header {
  padding: 14px 18px;
  border-bottom: var(--border-dim);
  display: flex; justify-content: space-between; align-items: center;
  font-family: 'Pixelify Sans', monospace;
  font-size: 0.72rem; font-weight: 700;
  letter-spacing: 4px; text-transform: uppercase;
  color: var(--color-text);
  background: var(--color-primary-bg);
  border-radius: var(--radius-xl) var(--radius-xl) 0 0;
}

.guides-list-container, .tips-content {
  padding: 12px; display: flex; flex-direction: column; gap: 6px;
  overflow-y: auto;
}

.guide-btn {
  width: 100%; padding: 12px 14px; text-align: left;
  background: var(--color-surface-alt);
  color: var(--color-text-secondary);
  border: var(--border-dim);
  border-radius: var(--radius-md);
  cursor: pointer;
  font-family: 'Pixelify Sans', monospace;
  font-size: 0.8rem; letter-spacing: 1px;
  transition: border-color 0.2s, color 0.2s, transform 0.2s;
}

.guide-btn:hover { transform: translateX(3px); }

.guide-btn.active {
  background: var(--color-primary-bg);
  color: var(--color-primary);
  border-color: var(--color-primary);
  border-radius: var(--radius-md);
}

.guide-details-box {
  margin: 0 12px 12px;
  padding: 14px; border-top: var(--border-lilac);
  font-family: 'Pixelify Sans', monospace;
  font-size: 0.78rem; color: var(--color-text-secondary);
  line-height: 1.8;
  background: var(--color-primary-bg);
  border-radius: 0 0 var(--radius-md) var(--radius-md);
}

.guide-details-box ol {
  padding-left: 16px; margin: 8px 0 0;
  color: var(--color-text);
}

/* ── Breathing center ───────────────────────────────────── */
.relax-center {
  flex: 1.5; display: flex; flex-direction: column;
  align-items: center; justify-content: center; gap: 20px;
}

.breathing-circle {
  width: 260px; height: 260px;
  border-radius: 50%;
  background: var(--color-surface);
  border: 3px solid var(--color-text-muted);
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  cursor: pointer;
  transition: all 4s ease-in-out;
  position: relative;
  box-shadow: var(--shadow-md);
}

.breathing-circle::after {
  content: '';
  position: absolute; inset: -10px;
  border-radius: 50%;
  border: 2px solid transparent;
  opacity: 0;
  transition: opacity 2s, inset 4s ease-in-out, border-color 2s;
}

.breathing-circle.inspirar {
  transform: scale(1.22);
  border-color: var(--color-primary);
  background: var(--color-primary-bg);
  box-shadow: 0 0 0 8px rgba(183,148,244,0.12), var(--shadow-md);
}

.breathing-circle.inspirar::after {
  opacity: 1; inset: -20px;
  border-color: var(--color-primary);
}

.breathing-circle.mantenir {
  transform: scale(1.22);
  border-color: var(--color-secondary);
  background: var(--color-secondary-bg);
  box-shadow: 0 0 0 8px rgba(246,135,179,0.12), var(--shadow-pink);
}

.breathing-circle.expirar {
  transform: scale(1);
  border-color: var(--color-sky-dark);
  background: rgba(190,227,248,0.15);
  box-shadow: var(--shadow-sky);
}

.breath-text {
  font-family: 'Pixelify Sans', monospace;
  font-size: 1.1rem; font-weight: 700;
  letter-spacing: 5px; text-transform: uppercase;
  color: var(--color-text); z-index: 1;
}

.relax-hint {
  font-family: 'Pixelify Sans', monospace;
  font-size: 0.68rem; letter-spacing: 2px;
  color: var(--color-text-muted); text-transform: uppercase;
}

/* ── Tips ───────────────────────────────────────────────── */
.tip-card {
  padding: 14px 16px;
  background: var(--color-surface-alt);
  border: var(--border-dim);
  border-left: 3px solid var(--color-primary);
  border-radius: 0 var(--radius-md) var(--radius-md) 0;
  font-family: 'Pixelify Sans', monospace;
  font-size: 0.78rem; color: var(--color-text-secondary);
  line-height: 1.6;
  box-shadow: var(--shadow-sm);
}

@media (max-width: 900px) {
  .relax-layout   { flex-direction: column; }
  .relax-panel    { min-height: 280px; width: 100%; }
  .breathing-circle { width: 210px; height: 210px; }
}
```

---

### PROMPT 10 — Header.module.css: Cute Pastel Navigation
**Target AI:** Code AI (code-executor)
**Complexity:** [SIMPLE]
**Order:** 2 (after PROMPT 1 + 2)

Rewrite `/home/itramplay/Projects/UNI/FH/ClearMind/ClearMind/src/components/css/Header.module.css`. Keep all existing CSS Module class names exactly as they are.

```css
.header {
  display: flex; align-items: center; justify-content: space-between;
  height: 60px;
  background: var(--color-surface);
  border-bottom: var(--border-dim);
  box-shadow: 0 2px 8px rgba(183,148,244,0.1);
  position: sticky; top: 0; z-index: 1000;
  padding: 0 24px;
}

.logo {
  font-family: 'Pixelify Sans', monospace;
  font-size: 1rem; font-weight: 700;
  letter-spacing: 4px; text-transform: uppercase;
  color: var(--color-primary);
  flex: 1;
}

.logo::before { content: '✦ '; color: var(--color-secondary); font-size: 0.7rem; }

.nav { flex: 2; display: flex; justify-content: center; }

.tabList {
  list-style: none; display: flex; gap: 6px;
  padding: 6px; margin: 0;
  background: var(--color-primary-bg);
  border-radius: var(--radius-pill);
  border: var(--border-dim);
}

.tabItem { display: flex; }

.tabButton {
  padding: 6px 20px;
  font-family: 'Pixelify Sans', monospace;
  font-size: 0.72rem; font-weight: 700;
  letter-spacing: 2px; text-transform: uppercase;
  text-decoration: none;
  color: var(--color-text-secondary);
  background: transparent;
  border: none; border-radius: var(--radius-pill);
  cursor: pointer; white-space: nowrap;
  transition: background 0.2s, color 0.2s, transform 0.2s cubic-bezier(0.34,1.56,0.64,1);
}

.tabButton:hover {
  background: var(--color-surface);
  color: var(--color-text);
  transform: translateY(-1px);
}

.tabButton.active {
  background: var(--color-primary);
  color: white;
  box-shadow: var(--shadow-sm);
}

.spacer { flex: 1; }
```

---

### PROMPT 11 — Footer.module.css: Minimal Cozy Footer
**Target AI:** Code AI (code-executor)
**Complexity:** [SIMPLE]
**Order:** 2 (after PROMPT 1 + 2)

Rewrite `/home/itramplay/Projects/UNI/FH/ClearMind/ClearMind/src/components/css/Footer.module.css`. Keep all existing CSS Module class names exactly.

```css
.footer {
  padding: 16px 24px; margin-top: auto;
  border-top: var(--border-dim);
  background: var(--color-surface);
}

.linksContainer {
  display: flex; justify-content: center;
  gap: 2rem; flex-wrap: wrap; margin-bottom: 6px;
}

.linkGroup { display: flex; gap: 0.75rem; align-items: center; }

.groupTitle {
  font-family: 'Pixelify Sans', monospace;
  font-size: 0.65rem; font-weight: 700;
  letter-spacing: 3px; text-transform: uppercase;
  color: var(--color-text-muted);
}

.link {
  font-family: 'Pixelify Sans', monospace;
  font-size: 0.7rem; color: var(--color-text-muted);
  text-decoration: none; letter-spacing: 1px;
  transition: color 0.2s;
}

.link:hover { color: var(--color-primary); text-decoration: underline; }

.copyright {
  font-family: 'Pixelify Sans', monospace;
  font-size: 0.62rem; letter-spacing: 2px;
  color: var(--color-text-muted); text-align: center; margin-top: 6px;
}

.copyright::before { content: '✦ '; color: var(--color-secondary); }
```

---

### PROMPT 12 — Sprite Integration (JSX)
**Target AI:** Code AI (code-executor)
**Complexity:** [COMPLEX]
**Order:** 3 (after Prompts 3-11 are complete)

Add pixel art sprite assets as decorative background images in the three views. The sprites generated in PROMPTS 3-6 are located in `ClearMind/public/sprites/`. Do NOT modify any JSX logic (state, event handlers, router links). Only add/modify CSS class names for background-image decorations.

**In `Hall.jsx`:**
Add an inline style or a CSS class `hall-door-sprite` on each `.door` div to use `url('/sprites/hall/hall-door-wood-closed.png')` as `background-image` with `background-size: contain` and `background-repeat: no-repeat`. This replaces the CSS-only wood gradient background only if the sprite exists; wrap with a feature-detection comment.

Add the `.rug` element `background-image: url('/sprites/hall/hall-rug.png')` (optional override from CSS).

Add a new `<div className="hall-clock-sprite">` inside `.clock-circle` (or use background-image on the `.clock-circle` div itself).

**In `Study.jsx`:**
Add `background-image: url('/sprites/study/study-notebook-open.png')` to `.tasks-panel` with `background-position: bottom right`, `background-size: 80px auto`, `background-repeat: no-repeat`.

Add `background-image: url('/sprites/study/study-radio.png')` to `.audio-panel` with `background-position: top center`, `background-size: contain`, `background-repeat: no-repeat`, `background-origin: content-box`.

**In `Relax.jsx`:**
Add a `<div className="relax-deco">` element inside `.relax-center` (before the breathing circle) containing a `<img src="/sprites/relax/relax-plant.png" alt="" aria-hidden="true">` at 64px height.

All `<img>` decorative sprites must have `alt=""` and `aria-hidden="true"`. No functional code changes.
