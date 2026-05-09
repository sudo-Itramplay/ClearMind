# PROMPT 2 — Interactivity, Responsiveness & Living Experience
## For: Claude Design (2 of 2)

Take the visual shell from the previous result and add the following. Keep the same warm, ADHD-optimized aesthetic. Make it feel alive and responsive.

## 🚨 CRITICAL CORRECTIONS FROM PROMPT 1 — FIX THESE FIRST

Before adding new features, correct these issues from the previous result:

### 1. Calendar Sphere Color Fading (Hall)
The current sphere color intensity logic is not working well. Fix it:
- Each sphere represents ONE day of the month (35 spheres = 5 weeks)
- Color intensity must be based on **todo count for that specific day**:
  - 0 todos: `--sphere-off` (dark wood color, no glow)
  - 1 todo: `--sphere-on` at 20% opacity, subtle glow
  - 2-3 todos: `--sphere-on` at 50% opacity, medium glow
  - 4-5 todos: `--sphere-on` at 80% opacity, strong glow
  - 5+ todos: `--sphere-on` at 100% opacity, full glow + pulse animation
- The gradient must go from **dark/transparent to bright amber**, not the reverse
- Use `opacity` or `background-color` transitions, not transforms
- Ensure the color change is **visually obvious** — right now it's too subtle to notice

### 2. Hall Layout — Viewport Visibility (CRITICAL)
At 100% zoom on a standard screen (1920×1080 or 1366×768), **all elements must be visible without scrolling**:
- The calendar, clock, doors, and floor elements should fit in the viewport
- Use `vh` units and `flexbox`/`grid` to distribute space:
  - Top section (calendar + clock): ~35vh
  - Middle section (doors + ambient elements): ~45vh  
  - Bottom section (floor): ~20vh
- **Nothing should be cut off or hidden below the fold**
- Test mentally: on a 768px tall screen, can I see both doors AND the calendar? If not, shrink elements or use `scale()`
- Make elements **slightly smaller** if needed — prioritize showing everything
- The doors should be ~180px wide × ~200px tall max
- The calendar spheres should be ~20px diameter with ~8px gap
- Add `overflow: hidden` on the page container and ensure `min-height: 100vh` with proper distribution

### 3. Meditation Room — Visual Redesign
The current meditation room is all blue and the breathing circle blends into the background. **Redesign it:**
- **Background**: Should be a **WALL** (like the study room's cork board wall), not a gradient
  - Use `--bg-wall` (dark wood brown `#2C2218`) for the wall
  - Add subtle wall texture (same as hall)
- **Breathing Circle**: Must **stand out clearly** from the wall:
  - Use `--accent-meditate` (soft teal `#5A8A8C`) for the circle
  - Add a **glow effect** around the circle: `box-shadow: 0 0 60px 20px rgba(90, 138, 140, 0.4)`
  - Add an **inner light**: `radial-gradient(circle at 40% 40%, rgba(255,255,255,0.3), transparent 70%)`
  - The circle should look like a **soft, glowing orb** floating in front of the wall
  - Border: 2px solid `rgba(255,255,255,0.2)` for definition
- **Floor**: Add a small floor area at the bottom (like hall) using `--bg-floor`
- **Ambient light**: Add a subtle teal light source effect behind the circle (larger, more diffuse glow)
- **Text**: "Breathe In..." etc. should be `--cream` color for contrast against dark wall
- **Controls**: Place below the circle on the floor area or on a small platform/shelf
- The overall feel: **a calm corner of the house**, not an abstract blue void

## 1. ROUTING & NAVIGATION

Install `react-router-dom`. Update `src/App.jsx`:
- `/` → redirects to `/hall`
- `/hall` → Hall page
- `/study` → Study page
- `/meditate` → Meditate page

Make the **doors in Hall** functional links using `react-router-dom`'s `<Link>` or `useNavigate`:
- Left door navigates to `/study`
- Right door navigates to `/meditate`
- Add a subtle "back to hall" button in Study and Meditate (small, top-left, wood-styled)

## 2. PAGE TRANSITIONS

Create `src/components/layout/PageTransition.jsx`:
- When navigating between rooms, animate the transition:
  - Current page: fade out + scale down (scale 0.95, opacity 0, 300ms)
  - New page: fade in + scale up (scale 1.02 → 1, opacity 0 → 1, 400ms)
  - Easing: `cubic-bezier(0.4, 0, 0.2, 1)`
- Use React's `useLocation` from react-router and CSS transitions
- Wrap each page component with this transition

## 3. RESPONSIVE DESIGN

Add `src/styles/responsive.css` with media queries:

**Mobile (< 640px):**
- Hall: 
  - Doors become large vertical cards (full width, stacked) with icons instead of 3D transforms
  - Calendar becomes a 7-sphere horizontal week view (showing current week only)
  - Clock becomes a beautiful digital display (JetBrains Mono, large)
- Study:
  - Cork board: post-its stack vertically as cards (keep colors and pins)
  - Notebook modal: becomes a bottom sheet (slides up from bottom, 90vh height)
  - Timer: full width, minimum 200px diameter
- Meditate:
  - Breathing circle: 80% of viewport width
  - Controls stack vertically with 48px minimum touch targets

**Tablet (640-1024px):**
- Reduce 3D transforms (flatten doors to 2D but keep wood styling)
- Two-column layouts where applicable
- Maintain sphere calendar but smaller

**All sizes:**
- Minimum touch target: 48px × 48px for all interactive elements
- Font sizes: never smaller than 16px on mobile
- Generous padding: at least 16px from screen edges

## 4. MOCK DATABASE & STATE

Create `src/data/mockDB.js`:
```javascript
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));
const generateId = () => Date.now() + Math.random().toString(36).substr(2, 9);

const today = new Date().toISOString().split('T')[0];

const initialTodos = [
  { id: '1', task: 'Read chapter 3 of Calculus', description: 'Focus on integrals', date: today, completed: false, priority: 'normal', createdAt: Date.now() },
  { id: '2', task: 'Practice Spanish vocabulary', description: '50 words from unit 4', date: today, completed: false, priority: 'high', createdAt: Date.now() - 10000 },
  { id: '3', task: 'Morning meditation', description: '', date: today, completed: true, priority: 'low', createdAt: Date.now() - 20000 },
  { id: '4', task: 'Write essay draft', description: 'Introduction and outline', date: today, completed: false, priority: 'high', createdAt: Date.now() - 30000 },
  { id: '5', task: 'Review chemistry notes', description: 'Organic compounds', date: today, completed: true, priority: 'normal', createdAt: Date.now() - 40000 },
];

export const mockDB = {
  getTodos: () => delay().then(() => [...initialTodos]),
  addTodo: (todo) => delay().then(() => {
    const newTodo = { ...todo, id: generateId(), createdAt: Date.now(), completed: false };
    initialTodos.push(newTodo);
    return newTodo;
  }),
  updateTodo: (id, updates) => delay().then(() => {
    const idx = initialTodos.findIndex(t => t.id === id);
    if (idx !== -1) {
      initialTodos[idx] = { ...initialTodos[idx], ...updates };
      return initialTodos[idx];
    }
    throw new Error('Todo not found');
  }),
  deleteTodo: (id) => delay().then(() => {
    const idx = initialTodos.findIndex(t => t.id === id);
    if (idx !== -1) {
      return initialTodos.splice(idx, 1)[0];
    }
    throw new Error('Todo not found');
  }),
  toggleTodo: (id) => delay().then(() => {
    const todo = initialTodos.find(t => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
      return todo;
    }
    throw new Error('Todo not found');
  }),
};
```

Create `src/context/TodoContext.jsx`:
- Provides: `todos`, `isLoading`, `addTodo`, `updateTodo`, `deleteTodo`, `toggleTodo`
- Loads from mockDB on mount
- All actions async with loading states
- Wrap App with this provider

## 5. INTERACTIVE FEATURES

### Calendar Spheres (Hall)
- Make the spheres reactive to actual todo data:
  - Get todos from TodoContext
  - Group by date
  - Each sphere's intensity = `(number of todos for that day / 5) * 100%` (cap at 100%)
  - If all todos completed for a day: add a small checkmark (::after pseudo-element)
  - If no todos: use `--sphere-off` color
  - Current day gets a gentle pulse animation if todos exist

### Post-It Notes (Study Room)
- Connect to TodoContext instead of mock data
- Click to toggle completion:
  - Animate: scale 1 → 1.05 → 1 (200ms bounce)
  - Change color to `--postit-mint` when completed
  - Add checkmark stamp effect
- Show actual task text from todos
- Priority indicator: small dot (rose for high, yellow for normal, mint for low)

### Notebook Form (Study Room)
- Modal form with fields:
  - Task input (required, text)
  - Description textarea (optional)
  - Priority selector: Low / Normal / High (radio buttons styled as pills)
  - Date picker (default today)
  - Submit button: "Pin to Board"
- On submit:
  - Call `addTodo` from context
  - Close modal
  - New note "pins" to board with animation (drops from top with bounce)
- Form validation: task required, show error in red (`--accent-danger: #C70D0B`)

### Timer (Study Room)
Create `src/hooks/useTimer.js`:
- **Timer mode**: Countdown from selected duration (default 25 minutes = 1500 seconds)
- **Stopwatch mode**: Count up from 0
- Controls: Start, Pause, Reset
- Preset durations in Timer mode: 15, 25, 45, 60 minutes
- Display: `MM:SS` format
- SVG ring progress: stroke-dasharray updates based on percentage complete
- When timer reaches 0: gentle pulse animation on the ring + show "Done!" briefly
- When switching modes: reset automatically

### Breathing Circle (Meditate)
- Make it interactive:
  - Start button begins the 4-phase cycle
  - Pause button stops (maintains current phase)
  - Duration presets: 3, 5, 10 minutes
  - When time is up: show "Session Complete" + gentle fade out
  - Track actual duration vs planned

## 6. SOUND INTEGRATION

Create `src/lib/sounds.js` using Web Audio API (no external files):
```javascript
// Synthesize sounds with oscillators
export const playTickSound = () => { /* soft paper rustle + bell using multiple oscillators */ };
export const playTimerComplete = () => { /* gentle chime */ };
export const playButtonClick = () => { /* short wood tap */ };
export const playMeditationGong = () => { /* low-frequency bowl */ };
```
- All sounds: short duration (< 0.5s), low volume (0.1-0.3)
- Create `src/hooks/useSound.js` to manage AudioContext lifecycle
- Sounds should be **opt-in**: add a small mute/unmute toggle in the corner (speaker icon)
- Default: muted

## 7. ACCESSIBILITY & KEYBOARD

### Focus Management
- All interactive elements must have visible focus rings:
  ```css
  :focus-visible {
    outline: 3px solid var(--focus-ring);
    outline-offset: 2px;
  }
  ```
- Modal focus trap: when modal opens, focus first input. Tab cycles within modal. Escape closes. Return focus to trigger on close.
- Create `src/hooks/useFocusTrap.js` for this.

### Keyboard Navigation
- Doors: Enter or Space to navigate
- Post-it notes: Tab to navigate between, Enter/Space to toggle
- Timer: Space to start/pause, Escape to reset
- Calendar: Arrow keys to navigate days (if interactive)
- Breathing circle: Space to start/pause

### ARIA Labels
- Hall doors: `aria-label="Enter Study Room"`, `aria-label="Enter Meditation Room"`
- Clock: `role="timer"`, `aria-live="polite"`, update hidden text with spoken time
- Post-it notes: `role="checkbox"`, `aria-checked="true/false"`, `aria-label="[task], [priority] priority, [completed/not completed]"`
- Timer: `role="timer"`, `aria-live="polite"`
- Breathing circle: `aria-live="polite"` for phase text ("Breathe In", "Hold", etc.)
- Modal: `role="dialog"`, `aria-modal="true"`, `aria-labelledby` pointing to title

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```
- Replace animations with instant state changes
- Breathing circle: static with text-only guidance
- Page transitions: instant swap

## 8. PERSISTENCE

- Save todos to `localStorage` key: `clearmind-todos`
- On app load: check localStorage first, fallback to mockDB initial data
- On todo change: debounce save to localStorage (300ms)
- Save sound preference to `localStorage` key: `clearmind-sound-enabled`

## 9. LOADING & ERROR STATES

- Add `isLoading` state to TodoContext
- While loading: show a warm, minimal loading indicator (pulsing amber sphere, not a spinner)
- Error state: gentle message in cream box with wood border, no red alerts

## 10. FINAL POLISH

### Micro-interactions
- Door hover: creak sound (if unmuted) + light spill intensifies
- Button hover: translateY(-2px) + shadow increase (200ms ease)
- Button active: scale(0.97) + shadow decrease
- Post-it hover: lift + shadow (as before)
- Sphere hover: scale(1.2) + brightness increase

### Visual Refinements
- Add subtle grain/noise texture overlay to walls (very low opacity SVG pattern)
- Cork board: add random darker speckles for realism (CSS radial-gradient dots)
- Wood surfaces: subtle horizontal lines (`repeating-linear-gradient`, opacity 0.03)
- All shadows should be warm-toned, never black

### Performance
- Use `will-change: transform` on animated elements
- Debounce calendar re-renders
- Use CSS transforms only (no animating width/height/top/left)

## KEY RULES FOR THIS PROMPT:
- Build on top of the previous visual shell — don't redesign, enhance
- Keep the warm, cozy aesthetic — no harsh colors or aggressive animations
- ADHD-friendly: clear feedback, no surprises, generous spacing, readable fonts
- All code must be accessible (keyboard, screen reader, focus management)
- Make it feel like a living, breathing space
