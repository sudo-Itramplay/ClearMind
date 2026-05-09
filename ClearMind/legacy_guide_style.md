# ClearMind — Legacy Style Guide

This document describes the **original CSS system** used by `Hall.jsx`, `Study.jsx`, and `Relax.jsx` before the new design system was introduced. It exists so that:

1. You know exactly which CSS variables and patterns are still active in those three views.
2. You do not accidentally break them while working in the new system.
3. When the legacy views are eventually migrated, you have a clear diff target.

---

## What "legacy" means here

The three main views (`/hall`, `/study`, `/relax`) are wrapped in `LegacyLayout` in `main.jsx`. This layout renders `Header.jsx` and `Footer.jsx` — components that use `src/assets/index.css` and CSS Modules (`Header.module.css`, `Footer.module.css`).

The view-specific styles live in `src/views/css/`:

| File | View | Status |
|---|---|---|
| `Hall.css` | `/hall` | Legacy variables + new system aliases |
| `Study.css` | `/study` | Fully rewritten — uses new system variables |
| `Relax.css` | `/relax` | Rewritten — uses new system variables |
| `Header.module.css` | All legacy views | Legacy variables |
| `Footer.module.css` | All legacy views | Legacy variables |

`Study.css` and `Relax.css` have already been migrated to the new system. Only `Hall.css`, `Header.module.css`, and `Footer.module.css` still carry legacy variable references.

---

## Legacy CSS Variable System (`src/assets/index.css`)

These variables are set on `:root` by `index.css`. They are **not** aliases — they are the original values and are still consumed by `Header.module.css`, `Footer.module.css`, and partially by `Hall.css`.

### Colour

```css
--color-bg:        #F7F3EE   /* Page background — warm off-white */
--color-surface:   #FFFDF7   /* Card surface — nearly white cream */
--color-primary:   #9F7AEA   /* Lavender accent (old primary) */
--color-secondary: #F687B3   /* Pink accent (old secondary) */
--color-wood:      #8B6914   /* Wood tone (Hall doors) */
--color-sky:       #BAE6FD   /* Sky blue */
--color-lilac:     #E9D5FF   /* Pale purple */
--color-pink:      #FBCFE8   /* Pale pink */
--color-mint:      #A7F3D0   /* Pale mint */
--color-paper:     #FEF9F0   /* Paper white */
```

### Shadow

```css
--shadow-sm:     0 1px 3px rgba(0,0,0,0.08)
--shadow-md:     0 4px 12px rgba(0,0,0,0.10)
--shadow-lg:     0 8px 24px rgba(0,0,0,0.12)
--shadow-pink:   0 4px 14px rgba(246,135,179,0.35)
--shadow-sky:    0 4px 14px rgba(186,230,253,0.45)
--shadow-inset:  inset 0 2px 4px rgba(0,0,0,0.06)
```

### Border

```css
--border-brutal: 2px solid #080808   /* Old thick black border */
--border-cozy:   1px solid rgba(0,0,0,0.08)
--border-lilac:  1px solid #E9D5FF
--border-pink:   1px solid #FBCFE8
--border-sky:    1px solid #BAE6FD
```

### Radius

```css
--radius-sm:   6px
--radius-md:   12px
--radius-lg:   18px
--radius-xl:   24px
--radius-pill: 9999px
```

### Typography

```css
--sans:    'Inter', system-ui, sans-serif
--heading: 'Pixelify Sans', cursive
--mono:    'Courier New', monospace
```

---

## Header / Footer (Legacy Components)

`Header.jsx` renders the top navigation bar for the three main views. It uses `CSS Modules` from `src/components/css/`.

### Header.module.css — Key Rules

```css
.header        { background: #080808; sticky, z-1000, border-bottom var(--color-secondary) }
.logo          { font: Courier New; ::before content '>' }
.tabList       { display: flex; gap: 0; border: var(--border-brutal) }
.tabButton     { padding: 8px 24px; border-right between items; cursor pointer }
.tabButton:hover { background: rgba(255,255,255,0.05) }
.active        { background: var(--color-secondary); color: #080808 }
```

**Nav items** are hard-coded in `Header.jsx` as:
```js
[
  { name: 'STUDY', path: '/study' },
  { name: 'HALL',  path: '/hall'  },
  { name: 'RELAX', path: '/relax' },
]
```
These are in English (legacy) and uppercase. The new `Navbar` uses Catalan labels.

### Footer.module.css — Key Rules

```css
.footer           { background: #080808; flex row centered; padding 24px }
.linksContainer   { display: flex; justify-content: center; gap 2rem; flex-wrap }
.linkGroup        { display: flex; gap .75rem; align-center }
.link             { color: rgba(255,255,255,0.7); hover → underline + primary colour }
.copyright        { color: rgba(255,255,255,0.3); font-size 0.8rem }
```

**Footer links** are hard-coded placeholder links (Vite docs, React docs, Vite GitHub). These are not product content — they are scaffolding artifacts left from `create vite@latest`.

---

## Hall.css — Variable Mapping

`Hall.css` was rewritten to use the new system variables but some structural rules reference both systems. Here is the mapping of what the old names became:

| Old variable | New variable | Value |
|---|---|---|
| `--color-wood-light` | `--wood-light` | `#C4A882` |
| `--color-wood-dark` | `--wood-dark` | `#6B4A28` |
| `--color-secondary` | `--accent-primary` | `#AE5815` |
| `--color-primary` | `--accent-calm` | `#3E8283` |
| `--color-paper` | `--surface-light` | `#FBF7F0` |
| `--border-brutal` | `1px solid var(--border-default) + border-radius` | softened |
| `--shadow-red` | `0 4px 16px rgba(58,39,26,0.10)` | warm tone |

`Hall.css` still references `--wood-light`, `--wood-mid`, `--wood-dark`, `--wood-grain`, `--hall-floor-dark`, `--hall-floor-mid`, `--hall-ceiling`. These are all defined in the new `globals.css` under `:root`.

---

## Component Architecture — Legacy vs New

```
LEGACY SYSTEM                        NEW SYSTEM
─────────────────────────────────    ─────────────────────────────────
Header.jsx (CSS Modules)             navbar.jsx (Tailwind + cn())
Footer.jsx (CSS Modules)             sidebar.jsx (Tailwind + cn())
index.css (root vars, raw CSS)       globals.css (root vars, keyframes)
Hall.css / Relax.css (raw CSS)       Study.css (raw CSS, new vars)
                                     ui/ (button, card, badge, progress)
```

The legacy and new systems **co-exist** and are both loaded in every page. They do not conflict because:

1. Tailwind's `preflight: false` leaves legacy element styles untouched.
2. New CSS variables override only through the alias chain in `globals.css`.
3. CSS Modules scope Header/Footer class names — no global leak.

---

## Migration Path (When Ready)

To fully migrate a legacy view:

1. **Hall:** Replace `Hall.css` references to `--wood-*`, `--hall-*` with inline comments; these are already in `globals.css`. Replace `Header.jsx` with `Navbar.jsx` in `main.jsx` by removing `LegacyLayout` and providing `Navbar` directly. Delete `Header.jsx`, `Footer.jsx`, and their CSS Modules.

2. **Relax / Study:** Already migrated. Their CSS files now use `globals.css` variables.

3. **Dashboard components (TaskList, StreakTracker):** Connect to `TodoContext` instead of using hardcoded data. `cork-board.jsx` is the reference implementation — follow that pattern.

4. **Remove `src/assets/index.css`** only after verifying no remaining `var(--color-bg)`, `var(--color-primary)`, `var(--border-brutal)` references exist anywhere.

---

## Authoring Rules That Apply to Both Systems

These rules apply to **any** code written in this project, regardless of which CSS system it uses:

### Language
- All **code comments** in Catalan.
- All **UI text** in Catalan.
- All **variable names, component names, CSS class names** in English.

### Accessibility
- Every interactive element needs `aria-label` or visible label.
- Every decorative element needs `aria-hidden="true"`.
- Focus rings must be visible: `outline: 2px solid var(--color-accent-primary); outline-offset: 2px`.
- Touch targets: minimum `44px × 44px` on mobile.
- Custom interactive roles need keyboard support (Space/Enter).

### Motion
- All animations must have a `@media (prefers-reduced-motion: reduce)` override.
- Movement-only overrides: replace `transform` with `opacity` or `color` changes.

### ADHD Design Constraints
- `--color-accent-danger` (red) is for **errors only**. Never use red for success or completion.
- Interactive elements must have an obvious affordance: floating animation, hover shadow lift, or cursor change.
- Decorative elements must be visually receded (lower opacity, no animation, `aria-hidden`).
- No pure black (`#000000`) anywhere. Use `#080808` or `#3A271A` (dark coffee) instead.
- No cold blues or greys. All colours must have warm undertones.
