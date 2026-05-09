# PROMPT 3 — Final Polish, Corrections & Architecture
## For: Claude Design (3 of 3 — USE REMAINING CAPACITY)

This is the final refinement pass. Take the current result and apply ALL corrections and additions below. Keep the warm, ADHD-optimized aesthetic. Do not redesign — refine and fix.

---

## 🚨 CRITICAL LAYOUT & VISUAL FIXES

### 1. Timer/Cronometer Number Centering
The timer numbers are NOT centered in the circular SVG display. Fix this:
- The `MM:SS` text must be **perfectly centered** both horizontally and vertically within the circle
- Use `display: flex`, `justify-content: center`, `align-items: center` on the container
- OR use SVG `text-anchor="middle"` and `dominant-baseline="middle"` if using SVG text
- The numbers (JetBrains Mono) should sit exactly in the middle of the ring, not offset to any side
- Test: the colon in "25:00" should align with the exact center point of the circle

### 2. Door Style Unification (Hall)
The two doors currently look DIFFERENT from each other. **Choose ONE style and apply to both**:
- Same frame width, height, and wood color
- Same 3D perspective and hover behavior
- Same door panel details (borders, shadows)
- The ONLY differences allowed:
  - Left door (Study): Warm amber light spilling from crack, brass plaque saying "Study Room"
  - Right door (Meditate): Soft teal glow at edges, brass plaque saying "Meditate"
- Do not make one door taller, wider, or differently styled than the other
- Both doors must feel like matching doors in the same house

### 3. Door-Calendar Collision (Hall) — CRITICAL
The doors are colliding/overlapping with the calendar area. Fix the layout:
- **Option A (Preferred)**: Adjust spacing and sizes so nothing collides
  - Reduce calendar sphere size to ~18px
  - Reduce gap between calendar and doors
  - Shrink doors slightly if needed (but keep them readable)
- **Option B**: If collision cannot be avoided without making things too small, remove ONE decorative element (suggestions: remove the table/lamp between doors, or make the clock smaller)
- **Rule**: Calendar must have clear space above doors. No overlapping.
- Use `display: flex` or `grid` with `gap` to enforce separation

### 4. Calendar Clarity (Hall)
Right now it's not obvious that the sphere grid is a calendar showing tasks. Make it unmistakable:
- Add a clear header above: **"May 2026"** (or current month/year) in serif font, `--amber-glow` color
- Add **day name labels** above the sphere grid: Mon, Tue, Wed, Thu, Fri, Sat, Sun
  - Small text (14px), uppercase, `--amber-soft` color
  - Each label centered above its column
- Add a **small legend** below the calendar:
  - "● Low activity" (dark sphere)
  - "● Medium" (medium amber)
  - "● High" (bright amber)
  - "✓ Done" (mint sphere with checkmark)
- Highlight the **current day** sphere with a white ring border (`2px solid rgba(255,255,255,0.6)`)
- On **hover** over a sphere: show a small tooltip with the date and task count (e.g., "May 12: 3 tasks")
- Ensure spheres are large enough to be recognizable as days (~18-20px)

---

## 🧘 MEDITATION ROOM — 3 BREATHING MODES

Replace the current single meditation mode with **3 distinct modes**. Add a mode selector above the breathing circle (three pill buttons).

### Mode 1: "Activation" (3 minutes)
- **Purpose**: Quick energy boost, morning wake-up
- **Breathing pattern**: Quick breaths
  - Inhale: 2 seconds
  - Hold: 1 second  
  - Exhale: 2 seconds
  - Hold: 1 second
- **Visual**: Breathing circle pulses rapidly but smoothly
- **Color**: Bright teal (`#6BA8A8`) — more energizing
- **Text cues**: "Inhale" → "Hold" → "Exhale" → "Hold" (fast rhythm)

### Mode 2: "Anxiety Relief" (4 minutes)
- **Purpose**: Calm nerves, reduce stress
- **Breathing pattern**: Box breathing (4-4-4)
  - Inhale: 4 seconds
  - Hold: 4 seconds
  - Exhale: 4 seconds
  - Hold: 4 seconds
- **Visual**: Steady, rhythmic expansion/contraction
- **Color**: Soft teal (`#5A8A8C`) — calming
- **Text cues**: "Breathe In..." → "Hold..." → "Breathe Out..." → "Hold..."

### Mode 3: "Sleep / Relaxation" (10 minutes)
- **Purpose**: Wind down, prepare for sleep
- **Breathing pattern**: 4-7-8 technique
  - Inhale: 4 seconds
  - Hold: 7 seconds
  - Exhale: 8 seconds
  - (No hold after exhale)
- **Visual**: Slow, deep expansion with long pauses
- **Color**: Deep blue-teal (`#4A7A7C`) — more subdued
- **Text cues**: "Inhale..." → "Hold..." → "Exhale..."

### Mode Selector UI:
- Three pill buttons side by side above the circle:
  - "⚡ Activation" — amber/orange accent when selected
  - "🌿 Anxiety" — teal accent when selected
  - "🌙 Sleep" — deep blue accent when selected
- Selected mode has filled background, unselected has ghost/outline style
- Changing mode resets and stops any active session
- Default selected mode: "Anxiety"

### Session Complete:
- All modes: show "Session Complete" text
- Sleep mode: add "Good night..." or "Rest well..." message
- Gentle fade out after 3 seconds

---

## ⏱️ STOPWATCH ENHANCEMENT — Objective Time Feature

Add a powerful new feature to the timer/stopwatch:

### Objective Work Time Setting:
- Add a small **"Set Objective"** button (gear icon or "⚙️") next to the timer mode switch
- Clicking opens a small inline panel or modal:
  ```
  Objective Time:
  [ 45 ] minutes
  [ 00 ] seconds
  [Set Objective]
  ```
- This sets a target duration for the stopwatch mode

### Color Behavior:
- **While counting AND below objective time**: 
  - Timer ring color: `--accent-study` (vivid warm orange `#D4763A`)
  - Text color: `--cream`
  - Subtle glow: `box-shadow: 0 0 20px rgba(212, 118, 58, 0.3)`
- **Once objective time is reached or exceeded**:
  - Timer ring color transitions to darker, muted orange `#8B4513` (saddle brown)
  - Text color: slightly dimmer
  - Glow fades out
  - This gives visual feedback that you've passed your goal — encouraging but not alarming
- **Color transition**: Smooth 1-second CSS transition when threshold is crossed

### Display:
- Show objective time below the main timer: "Goal: 45:00" in small text
- When exceeded: show "+02:15" (time over goal) in the muted color

---

## 🧭 HEADER & FOOTER ADDITION

### Header (`src/components/layout/Header.jsx`)
Create a simple, elegant header bar:
- **Background**: `--wood-dark` with slight transparency (`rgba(74, 55, 40, 0.95)`)
- **Height**: 56px
- **Content** (left to right):
  1. App name: "ClearMind" in serif font, `--amber-glow` color, 20px
  2. Navigation links (in this exact order):
     - **Study** → `/study`
     - **Hall** → `/hall` 
     - **Meditate** → `/meditate`
  3. Active link: `--amber-glow` color with underline
  4. Inactive links: `--cream` at 70% opacity
- **Position**: Fixed at top, `z-index: 100`
- **Mobile**: Hamburger menu or horizontal scroll
- **Shadow**: `box-shadow: 0 2px 8px rgba(0,0,0,0.3)`
- Remove any previous navigation elements (replace the temporary buttons)

### Footer (`src/components/layout/Footer.jsx`)
Create a VERY simple footer:
```
┌─────────────────────────────────────────────────────────┐
│  ClearMind — Your cozy focus space                      │
│  Built with ♥ for ADHD minds                            │
└─────────────────────────────────────────────────────────┘
```
- **Background**: `--wood-dark` or same as page background
- **Height**: ~48px
- **Text**: 14px, `--text-body` color, centered
- **Content**:
  - Left (or center): "ClearMind — Your cozy focus space"
  - Right (or below): "Built with ♥ for ADHD minds" or "Made for calm and focus"
- No links, no complex layout — just 1-2 lines of text
- **Position**: At bottom of page, not fixed (appears after scrolling, but since rooms are viewport-height, it's minimal)

---

## ✅ CONFIRMATION POPUPS

Add elegant confirmation dialogs for destructive or important actions. Use the existing Modal component style.

### When to show:
1. **Deleting a todo**: "Remove this task?" — "Cancel" / "Remove" (Remove in muted red)
2. **Clearing all completed todos**: "Clear all completed tasks?" — "Cancel" / "Clear"
3. **Resetting timer**: "Reset timer? Progress will be lost." — "Cancel" / "Reset"
4. **Closing notebook with unsaved changes**: "You have unsaved changes. Discard?" — "Keep editing" / "Discard"

### Popup Style:
- Same modal style as notebook (cream background, wood border)
- Title: 18px serif, `--text-heading`
- Message: 16px sans-serif, `--text-body`
- Buttons: "Cancel" (ghost style), "Confirm" (primary amber)
- Focus trap inside modal
- Escape key cancels

---

## 🏗️ CODE QUALITY — SOLID ARCHITECTURE & NAMING

Refactor for clean, maintainable code:

### Naming Conventions:
- **Components**: PascalCase (`Hall.jsx`, `BreathingCircle.jsx`)
- **Hooks**: camelCase starting with "use" (`useTimer.js`, `useFocusTrap.js`)
- **CSS classes**: kebab-case (`calendar-sphere`, `post-it-note`, `door-frame`)
- **CSS custom properties**: Already established, keep consistent
- **Constants**: UPPER_SNAKE_CASE for true constants

### File Organization:
Ensure this structure exists:
```
src/
├── components/
│   ├── layout/
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   └── PageTransition.jsx
│   ├── ui/
│   │   ├── Button.jsx
│   │   ├── Modal.jsx
│   │   └── VisuallyHidden.jsx
│   ├── hall/
│   │   ├── CalendarWall.jsx
│   │   ├── Clock.jsx
│   │   └── Door.jsx
│   ├── study/
│   │   ├── CorkBoard.jsx
│   │   ├── PostItNote.jsx
│   │   ├── Notebook.jsx
│   │   ├── NotebookModal.jsx
│   │   └── DeskTimer.jsx
│   └── meditate/
│       ├── BreathingCircle.jsx
│       ├── ModeSelector.jsx
│       └── SessionControls.jsx
├── pages/
│   ├── Hall.jsx
│   ├── Study.jsx
│   └── Meditate.jsx
├── hooks/
│   ├── useTimer.js
│   ├── useFocusTrap.js
│   ├── useSound.js
│   └── useTodos.js
├── context/
│   └── TodoContext.jsx
├── data/
│   └── mockDB.js
├── lib/
│   ├── utils.js
│   └── sounds.js
└── styles/
    ├── globals.css
    ├── animations.css
    └── responsive.css
```

### Component Principles:
- **Single Responsibility**: Each component does ONE thing
  - `Door.jsx` only handles door visuals + navigation
  - `Clock.jsx` only handles time display
  - `BreathingCircle.jsx` only handles animation + visual
- **Props over State**: Pass data down, lift state up to context
- **No prop drilling**: Use context for global state (todos, sound settings)
- **Reusability**: `Button.jsx`, `Modal.jsx` should be reusable across rooms

### Accessibility (CRITICAL — Double Check):
- EVERY interactive element must have:
  - `aria-label` if no visible text
  - `role` attribute if not native HTML (e.g., `role="timer"`, `role="checkbox"`)
  - Visible `:focus-visible` outline (3px solid `--focus-ring`)
- Images/icons: `alt` text or `aria-label` (even decorative ones need `alt=""` or `aria-hidden="true"`)
- Color alone NEVER conveys meaning — always pair with icon or text
  - Example: priority dots need `aria-label="High priority"` even if color is visible
- Form inputs: `label` elements with `htmlFor` matching input `id`
- Live regions: `aria-live="polite"` for:
  - Timer updates
  - Todo completion announcements
  - Breathing phase changes

### CSS Best Practices:
- Use CSS custom properties for ALL colors, spacing, shadows
- No magic numbers — use variables
- Mobile-first media queries
- BEM-like naming if using plain CSS (`.hall__door`, `.hall__door--open`)

---

## 📋 FINAL CHECKLIST — VERIFY ALL OF THESE:

Before finishing, ensure:
- [ ] Timer numbers are perfectly centered in the circle
- [ ] Both doors in Hall are identical in style (only light color differs)
- [ ] Doors do NOT collide with calendar — clear separation
- [ ] Calendar has month label, day names, and legend
- [ ] Meditation room has 3 modes with correct breathing timings
- [ ] Stopwatch has objective time setting and color change when exceeded
- [ ] Header exists with order: Study — Hall — Meditate
- [ ] Footer exists with simple text
- [ ] Confirmation dialogs appear for delete/reset/discard actions
- [ ] All files follow the folder structure above
- [ ] All interactive elements have focus rings
- [ ] All icons/images have alt text or aria-labels
- [ ] No console errors or warnings
- [ ] Page fits in viewport without scrolling (Hall)

---

## KEY RULES FOR THIS PROMPT:
- **Refine, don't redesign** — keep the existing warm aesthetic
- **Fix layout issues first** — collision and centering are top priority
- **Architecture matters** — clean code is as important as visuals
- **Accessibility is non-negotiable** — every user must be able to use this
- **ADHD-friendly** — clear feedback, no surprises, calming interactions
- **Use remaining capacity wisely** — prioritize fixes over new features if space is limited
