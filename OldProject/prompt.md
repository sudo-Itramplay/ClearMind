# ClearMind v2 — Cozy Study & Meditation Webapp
## Complete Design & Technical Specification Prompt

---

## 1. VISUAL IDENTITY & ATMOSPHERE

### Core Aesthetic
Create a **cozy virtual home** that feels like stepping into a warm jazz café meets a comfortable personal study room. The visual style should evoke the **intimate warmth of the Persona 5 Leblanc café** (`maxresdefault.jpg`) combined with the **cozy domestic diorama feel** of the isometric room (`unboxing-juego-mudanza-1024x576.png`).

**Important:** This is NOT pixel art. Achieve the look using CSS, SVG, subtle gradients, box-shadows, and layered textures. Think "illustrated web experience" rather than game graphics.

### Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--bg-deep` | `#1A1410` | Deepest shadows, page background base |
| `--bg-wall` | `#2C2218` | Wall surfaces, room backgrounds |
| `--bg-floor` | `#3D2E20` | Floor/ground surfaces |
| `--wood-dark` | `#4A3728` | Dark wood furniture, door frames |
| `--wood-mid` | `#6B4E3D` | Medium wood, table surfaces |
| `--wood-light` | `#8B6F5C` | Light wood accents, cork board frame |
| `--amber-glow` | `#D4A574` | Primary warm light, lamp glow, highlights |
| `--amber-soft` | `#E8C9A0` | Secondary light, clock face, sphere highlights |
| `--cream` | `#F5E6D3` | Paper, notebook pages, text on dark |
| `--cork` | `#C4A882` | Cork board surface |
| `--cork-dark` | `#8B7355` | Cork texture shadows |
| `--postit-yellow` | `#F5E6A3` | Default todo note color |
| `--postit-rose` | `#E8B4B8` | High priority note color |
| `--postit-mint` | `#B8D8C8` | Completed note color |
| `--accent-study` | `#D4763A` | Study room active states |
| `--accent-meditate` | `#5A8A8C` | Meditation room, calm states |
| `--sphere-on` | `#F5A623` | Active calendar sphere |
| `--sphere-off` | `#3D2E20` | Inactive calendar sphere |

### Lighting Philosophy
- **Primary light sources** cast soft radial gradients (CSS `radial-gradient`)
- Lamps/wall sconces have a `box-shadow: 0 0 40px 10px rgba(212, 165, 116, 0.3)` glow
- Shadows are warm-toned, not black (`rgba(60, 40, 20, 0.4)`)
- Ambient occlusion achieved via layered pseudo-elements with subtle dark gradients
- Text uses `text-shadow: 0 1px 2px rgba(0,0,0,0.5)` for readability against textured backgrounds

### Texture Strategy
- **Wood grain**: Use subtle SVG data-URI patterns or `repeating-linear-gradient` at very low opacity (0.03-0.05)
- **Cork board**: Dotted noise texture via CSS or tiny SVG background
- **Paper**: Very subtle off-white gradient with `box-shadow` for thickness
- **Walls**: Smooth with slight vignette using `radial-gradient` overlay

---

## 2. ARCHITECTURE & TECH STACK

```
Framework:     React 19 + Vite
Routing:       React Router DOM v7 (BrowserRouter)
Styling:       CSS Custom Properties + Tailwind CSS v3 (preflight: false)
State:         React Context (TodoContext) + mock async database
Utilities:     clsx + tailwind-merge for class composition
Fonts:         
  - Headings: "Crimson Pro" or "Playfair Display" (serif, elegant)
  - Body/UI: "Inter" or "Source Sans 3" (clean, readable)
  - Decorative numbers: "JetBrains Mono" (clock, timer)
Icons:         Lucide React (consistent, accessible)
Sounds:        Web Audio API or Howler.js for soft UI sounds
Storage:       localStorage for preferences + mockDB for data
```

### Responsive Breakpoints
| Name | Width | Layout Changes |
|------|-------|---------------|
| Mobile | < 640px | Single column, simplified 3D views become 2D cards |
| Tablet | 640-1024px | Two-column where applicable, reduced perspective |
| Desktop | > 1024px | Full experience with perspective transforms and ambient details |

---

## 3. DATA MODEL & MOCK DATABASE

Create `src/data/mockDB.js`:

```javascript
// Simulated async database with realistic delay
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

const generateId = () => Date.now() + Math.random().toString(36).substr(2, 9);

const today = new Date().toISOString().split('T')[0];

const initialTodos = [
  { id: 1, task: "Read chapter 3 of Calculus", description: "Focus on integrals", date: "2026-05-09", completed: false, priority: "normal", createdAt: Date.now() },
  { id: 2, task: "Practice Spanish vocabulary", description: "50 words from unit 4", date: "2026-05-09", completed: false, priority: "high", createdAt: Date.now() - 10000 },
  { id: 3, task: "Morning meditation", description: "", date: "2026-05-09", completed: true, priority: "low", createdAt: Date.now() - 20000 },
  { id: 4, task: "Write essay draft", description: "Introduction and outline", date: "2026-05-10", completed: false, priority: "high", createdAt: Date.now() - 30000 },
  { id: 5, task: "Review chemistry notes", description: "Organic compounds", date: "2026-05-08", completed: true, priority: "normal", createdAt: Date.now() - 40000 },
];

export const mockDB = {
  // Todos
  getTodos: () => delay().then(() => [...initialTodos]),
  addTodo: (todo) => delay().then(() => {
    const newTodo = { 
      ...todo, 
      id: generateId(), 
      createdAt: Date.now(),
      completed: false 
    };
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
      const removed = initialTodos.splice(idx, 1)[0];
      return removed;
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
  
  // Study sessions
  getSessions: () => delay().then(() => []), // Array of {id, startTime, duration, type, todoId}
  saveSession: (session) => delay().then(() => session),
  
  // Meditation sessions  
  getMeditations: () => delay().then(() => []),
  saveMeditation: (meditation) => delay().then(() => meditation),
};
```

### Todo Object Shape
```typescript
interface Todo {
  id: string;
  task: string;           // Required
  description?: string;   // Optional details
  date: string;           // ISO date "YYYY-MM-DD"
  completed: boolean;
  priority: 'low' | 'normal' | 'high';
  createdAt: number;      // timestamp
}
```

### Context API Structure
```jsx
// TodoContext provides:
const TodoContext = {
  todos: Todo[],
  isLoading: boolean,
  error: string | null,
  
  // Actions
  addTodo: (todo: Omit<Todo, 'id' | 'createdAt' | 'completed'>) => Promise<void>,
  updateTodo: (id: string, updates: Partial<Todo>) => Promise<void>,
  deleteTodo: (id: string) => Promise<void>,
  toggleTodo: (id: string) => Promise<void>,
  
  // Derived
  getTodosByDate: (date: string) => Todo[],
  getTodosForToday: () => Todo[],
  getCompletionStats: () => { total: number, completed: number, byDate: Record<string, number> }
};
```

---

## 4. ROOMS & PAGE SPECIFICATIONS

### ROUTING STRUCTURE
```
/           → Redirect to /hall
/hall       → Landing page (the cozy house entrance)
/study      → Study room (desk, notebook, timer, cork board)
/meditate   → Meditation room (simple, calm)
```

---

### ROOM 1: HALL (`/hall`) — "The Cozy Vestibule"

**Concept:** A warm entrance hall that feels like coming home. The user sees a comfortable room with two inviting doors leading to different spaces.

#### Layout (Desktop)
```
┌─────────────────────────────────────────────────────────┐
│  [Wall with Calendar & Clock]                           │
│                                                         │
│    ○ ○ ○ ○ ○ ○ ○    ┌─────────┐                        │
│    ○ ○ ○ ● ● ○ ○    │  🕐     │   ← Analog-style clock │
│    ○ ● ● ● ● ● ○    │ 12:45   │      (CSS/SVG)         │
│    ○ ○ ○ ○ ○ ○ ○    └─────────┘                        │
│    Calendar Spheres                              [Lamp] │
│                                                         │
│  ┌─────────────┐              ┌─────────────┐           │
│  │             │              │             │           │
│  │   [DOOR]    │   [RUG]     │   [DOOR]    │           │
│  │   STUDY     │─────────────│  MEDITATE   │           │
│  │   ROOM      │              │   ROOM      │           │
│  │  /study →   │              │ /meditate → │           │
│  └─────────────┘              └─────────────┘           │
│        ↑                            ↑                   │
│   Left door                    Right door               │
│   (slightly ajar,              (closed, soft            │
│    warm light                  cool light               │
│    spilling out)               emanating)               │
│                                                         │
│  ═══════════════════ [Floor] ═════════════════════════  │
└─────────────────────────────────────────────────────────┘
```

#### Components

**1. Calendar Wall Display**
- Positioned upper-center on the wall
- Represents the current month as a grid of **spheres/circles** (7 columns × 5-6 rows)
- Each sphere represents one day
- **Color intensity logic:**
  - Past days with 0 todos: `--sphere-off` (dark wood)
  - Past days with completed todos: `--sphere-on` at 30% opacity
  - Current/future days with todos: `--sphere-on` opacity = `(todoCount / maxTodos) * 100%`
  - Current day gets a subtle pulse animation (if todos exist)
  - Days with all todos completed: sphere gets a small checkmark overlay
- Spheres have `border-radius: 50%` with a **3D CSS effect**:
  ```css
  .calendar-sphere {
    border-radius: 50%;
    background: radial-gradient(circle at 35% 35%, var(--amber-soft), var(--sphere-on));
    box-shadow: 
      inset -2px -2px 4px rgba(0,0,0,0.3),
      inset 2px 2px 4px rgba(255,255,255,0.2),
      0 2px 4px rgba(0,0,0,0.3);
  }
  ```
- **Accessibility:** `role="grid"`, `aria-label="Activity calendar for [Month Year]"`, each sphere has `aria-label="[Date]: [N] tasks, [M] completed"`

**2. Wall Clock**
- Positioned above and to the right of the calendar
- Analog clock face using **SVG** (not an image)
- Real-time updating via `requestAnimationFrame` or 1-second interval
- Warm cream face (`--cream`) with dark wood rim
- Hands: hour (short, thick), minute (long, medium), second (thin, `--accent-study`)
- Ticks for each hour, smaller ticks for minutes
- **Soft shadow** under the clock for depth
- **Accessibility:** `role="timer"`, `aria-label="Current time: [spoken time]"`, `aria-live="polite"` on a visually hidden text element

**3. Left Door → Study Room**
- Wooden door frame (`--wood-dark`) with panel details (CSS borders/shadows)
- Slightly ajar (rotateY -15deg using CSS `transform: perspective(600px) rotateY(-15deg)`)
- Warm amber light spilling from the crack (`box-shadow` or pseudo-element gradient)
- Hover: door opens a bit more (rotateY -25deg), light intensifies
- Label "Study Room" on a brass plaque below the door
- **Sound on hover:** Soft door creak (very subtle)
- **Click:** Navigates to `/study` with a smooth transition
- **Accessibility:** `role="link"`, `aria-label="Enter Study Room"`, focus ring visible

**4. Right Door → Meditation Room**
- Similar wooden frame but with softer styling
- Closed, but with a soft teal/blue glow at the edges (`--accent-meditate` with low opacity)
- Hover: glow intensifies, door handle subtly highlights
- Label "Meditate" on a wooden plaque
- **Sound on hover:** Soft wind chime (very subtle)
- **Click:** Navigates to `/meditate`
- **Accessibility:** `role="link"`, `aria-label="Enter Meditation Room"`

**5. Ambient Details**
- A small table with a lamp between the doors (decorative)
- Lamp has an animated flicker effect (very subtle CSS opacity animation, 0.95-1.0)
- A rug on the floor (CSS patterned rectangle with shadow)
- Wall sconces with warm glow

#### Mobile Layout (< 640px)
- Doors become **vertical cards** stacked with generous spacing
- Calendar becomes a **horizontal scroll** or simplified 7-sphere week view
- Clock becomes a **digital display** (still elegant typography)
- Remove 3D transforms, keep flat but beautiful

---

### ROOM 2: STUDY ROOM (`/study`) — "The Focus Sanctuary"

**Concept:** A personal desk space where the user can manage tasks and run focused study sessions. The perspective is from the user's viewpoint sitting at their desk, looking at the wall in front.

#### Layout (Desktop)
```
┌─────────────────────────────────────────────────────────┐
│  [WALL IN FRONT] — Cork Board with Todos                │
│                                                         │
│  ┌──────────────────────────────────────────────────┐   │
│  │  📌  [Todo Post-it]  [Todo Post-it]  [Todo...]   │   │
│  │                                                   │   │
│  │  [Todo Post-it]  [Todo Post-it]  [Todo Post-it]   │   │
│  │                                                   │   │
│  │  [Todo Post-it]       [Done: ✓]      [Todo...]   │   │
│  └──────────────────────────────────────────────────┘   │
│                    CORK BOARD                           │
│                                                         │
│  ════════════════════════════════════════════════════   │
│                                                         │
│  ┌────────────────────┐    ┌────────────────────────┐   │
│  │                    │    │                        │   │
│  │   📓 NOTEBOOK      │    │      ⏱️ TIMER          │   │
│  │                    │    │                        │   │
│  │   [Open to write   │    │   ┌──────────────┐     │   │
│  │    new todos]      │    │   │   25:00      │     │   │
│  │                    │    │   │  [Start]     │     │   │
│  │   Date: [today]    │    │   │  Timer  ▼    │     │   │
│  │   Task: [_____]    │    │   └──────────────┘     │   │
│  │   [Add Todo]       │    │                        │   │
│  │                    │    │   Mode: [Timer] [Stopwatch]│
│  └────────────────────┘    └────────────────────────┘   │
│         DESK SURFACE                                    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

#### Components

**1. Cork Board (Wall Display)**
- Large rectangular board centered on the wall
- Frame: `--wood-light` with subtle wood grain texture
- Surface: `--cork` base color with SVG noise texture overlay
- **Todos displayed as post-it notes** pinned to the board:
  - Each note is a colored rectangle (`--postit-yellow`, `--postit-rose` for high priority, `--postit-mint` when done)
  - Notes have slight random rotation (-2deg to +2deg) for organic feel
  - Each note has a **pin** at top (small circle with shadow, CSS only)
  - Text uses a handwritten-style font or just elegant serif
  - **Completed todos:** Show a checkmark stamp effect, color shifts to mint, slight fade
  - **Interaction:** Click to toggle complete/incomplete
  - **Animation on complete:** 
    - Note subtly bounces (CSS keyframes: scale 1 → 1.05 → 1)
    - A satisfying "tick" sound plays (soft paper rustle + ding)
    - If all todos for today complete, a brief confetti burst (CSS particles, 1 second)
  - **Accessibility:** `role="list"`, each note is `role="listitem"` with `aria-checked` state, keyboard toggle with Enter/Space

**2. Notebook (Desk — Left)**
- Closed notebook visual when inactive (leather texture via CSS gradient, stitching via `border` with `dashed`)
- **Click to open** modal/popover:
  ```
  ┌────────────────────────────┐
  │  My Study Notebook  📅 [date picker]
  │  ══════════════════════════
  │  Today's Date: May 9, 2026
  │  
  │  New Task:
  │  ┌────────────────────────┐
  │  │ [Write your task...  ] │  ← textarea
  │  └────────────────────────┘
  │  
  │  Details (optional):
  │  ┌────────────────────────┐
  │  │ [Add description...   ] │
  │  └────────────────────────┘
  │  
  │  Priority: [Low] [Normal] [High ★]
  │  
  │         [Add to Board →]
  │  ══════════════════════════
  │  Recent tasks:
  │  • Review calculus (added 2m ago)
  │  • Practice Spanish (added 5m ago)
  └────────────────────────────┘
  ```
- Modal has **paper-like background** (`--cream`) with subtle shadow for depth
- Date picker uses native `input type="date"` but styled to match theme
- On submit: new todo appears on cork board with a "pinning" animation (drops from top with slight bounce)
- **Accessibility:** Focus trap inside modal, Escape to close, return focus to notebook button, `role="dialog"`, `aria-labelledby`

**3. Desk Timer (Desk — Right)**
- Circular SVG timer display (like a physical kitchen timer)
- **Two modes:** 
  - **Timer (Temporizador):** Countdown from set duration (default 25 min Pomodoro)
  - **Stopwatch (Chronómetro):** Count up from zero
- **Controls:**
  - Large central button: Start / Pause
  - Mode toggle: "Timer" | "Stopwatch" (pill buttons)
  - When in Timer mode: duration presets (15, 25, 45, 60 min) as small buttons
  - Reset button (appears when running or paused)
- **Visual design:**
  - Outer ring: `--wood-mid` with tick marks
  - Progress arc: `--accent-study` filling clockwise (SVG `stroke-dasharray`)
  - Center: Large digital time display (JetBrains Mono, `--cream`)
  - When timer completes: gentle pulse animation + soft chime sound (not jarring)
- **Study Session logging:** When timer is used, create a session record:
  ```typescript
  interface StudySession {
    id: string;
    todoId?: string;      // Optional: linked to a specific todo
    type: 'timer' | 'stopwatch';
    duration: number;     // seconds
    startTime: string;    // ISO timestamp
    endTime: string;      // ISO timestamp
  }
  ```
- **Accessibility:** `role="timer"`, `aria-live="polite"` for time announcements, `aria-label` on all controls

**4. Desk Surface**
- `--wood-mid` surface with wood grain
- Subtle edge shadow where desk meets wall
- Optional: a small cup of coffee/pen holder (decorative CSS element)

#### Mobile Layout
- Cork board becomes a **scrollable vertical list** of todo cards (still styled as notes)
- Notebook opens as **bottom sheet** or full-screen modal
- Timer becomes **full-width** with large touch targets (min 48px)

---

### ROOM 3: MEDITATION ROOM (`/meditate`) — "The Quiet Corner"

**Concept:** A minimalist, calming space. Keep it intentionally simple to avoid distraction.

#### Layout
```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│                                                         │
│              ┌─────────────────────┐                    │
│              │                     │                    │
│              │    ◉                │                    │
│              │         ◉           │   ← Breathing      │
│              │    ◉         ◉      │      Circle        │
│              │         ◉           │      (Animated)    │
│              │    ◉                │                    │
│              │                     │                    │
│              └─────────────────────┘                    │
│                                                         │
│              "Breathe In..."                            │
│              [Start Session]                            │
│                                                         │
│     Duration: [3 min] [5 min] [10 min] [Custom]         │
│                                                         │
│  ════════════════════════════════════════════════════   │
└─────────────────────────────────────────────────────────┘
```

#### Components

**1. Breathing Circle**
- Central visual element
- Large circle with soft `--accent-meditate` color
- **Animation cycle** (4 phases):
  - Inhale (4s): Circle expands, opacity increases
  - Hold (2s): Circle stays expanded, gentle pulse
  - Exhale (6s): Circle contracts, opacity decreases  
  - Hold (2s): Circle stays contracted
- Text below changes: "Breathe In..." → "Hold..." → "Breathe Out..." → "Hold..."
- **Reduced motion:** If `prefers-reduced-motion: reduce`, show static circle with text-only guidance
- **Accessibility:** `aria-live="polite"` for phase text, `role="region"`, `aria-label="Breathing exercise visualization"`

**2. Session Controls**
- Duration presets: 3, 5, 10 minutes + custom input
- Start / Pause / End buttons
- When session ends: soft gong sound + "Session complete" message
- Log meditation sessions to mockDB:
  ```typescript
  interface MeditationSession {
    id: string;
    duration: number;     // planned duration in minutes
    actualDuration: number; // actual seconds completed
    startTime: string;
    endTime: string;
  }
  ```

**3. Ambient Background**
- Very subtle gradient animation (colors shift between deep teal and soft blue, 20s cycle)
- No other distracting elements

#### Mobile Layout
- Breathing circle scales to fit width
- Controls stack vertically with large touch targets
- Full-screen immersive experience optional (hide browser chrome via scroll)

---

## 5. INTERACTION & ANIMATION SPECIFICATIONS

### Page Transitions
- **Hall → Study/Meditate:** "Walk through door" effect
  - Current page fades slightly and scales down (scale 0.95, opacity 0)
  - New page fades in from center (scale 1.02 → 1, opacity 0 → 1)
  - Duration: 400ms, easing: `cubic-bezier(0.4, 0, 0.2, 1)`
- Use React Router's `useLocation` + CSS transitions or Framer Motion if installed

### Micro-interactions
| Element | Hover | Active | Focus |
|---------|-------|--------|-------|
| Doors | Open wider, glow intensifies | Scale 0.98 | Outline: 2px solid `--amber-glow`, offset 2px |
| Post-it notes | Lift up (translateY -4px, shadow increases) | Scale 0.97 | Same as hover + ring |
| Timer button | Glow effect | Scale 0.96 | Outline ring |
| Notebook | Slight open hint (rotateZ 1deg) | Scale 0.98 | Outline ring |
| Calendar sphere | Scale 1.2, brighter | — | Outline ring |
| Cork board pin | — | Wiggle animation | — |

### Sound Design (Optional but Recommended)
- **Todo complete:** Soft paper rustle + gentle bell (0.5s max)
- **Timer complete:** Single soft chime (not alarm-like)
- **Door hover:** Very subtle wood creak (volume 0.1)
- **Button click:** Soft tap sound (wood block, very short)
- **Meditation gong:** Low-frequency bowl sound
- All sounds: **Muted by default**, user can enable. Respect `prefers-reduced-motion` for sound (offer toggle).
- Use Web Audio API for synthesizing these sounds (no external files needed):
  ```javascript
  // Example: soft bell using oscillator
  const ctx = new AudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.frequency.value = 523.25; // C5
  gain.gain.setValueAtTime(0.3, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.5);
  ```

---

## 6. ACCESSIBILITY REQUIREMENTS (MUST HAVE)

### WCAG 2.1 AA Compliance
- **Color contrast:** All text ≥ 4.5:1 against backgrounds (notes text on colored backgrounds must pass)
- **Focus indicators:** All interactive elements have visible focus rings (`outline: 2px solid var(--amber-glow)` with `outline-offset: 2px`)
- **Touch targets:** Minimum 44×44px on mobile, 36×36px on desktop

### Semantic HTML
```
<main role="main">           <!-- Each room -->
  <nav aria-label="Room navigation">...</nav>
  <section aria-labelledby="calendar-heading">...</section>
  <article role="listitem">   <!-- Each todo/note -->
```

### ARIA Implementation
- **Calendar:** `role="grid"`, `aria-label="Activity calendar"`, spheres have `aria-label` with date and task count
- **Clock:** `role="timer"`, `aria-live="polite"` for spoken time updates
- **Doors:** `role="link"`, `aria-label="Enter [Room Name]"`
- **Post-it notes:** `role="checkbox"`, `aria-checked="true/false"`, `aria-label="[task text], [priority], [status]"`
- **Timer:** `role="timer"`, `aria-live="polite"`, mode switch as `role="radiogroup"`
- **Notebook modal:** `role="dialog"`, `aria-labelledby="notebook-title"`, `aria-modal="true"`
- **Breathing circle:** `aria-live="polite"` for phase changes

### Keyboard Navigation
- **Tab order:** Logical flow (left → right, top → bottom)
- **Doors:** Enter/Space to navigate
- **Post-its:** Enter/Space to toggle, Arrow keys to navigate between notes
- **Timer:** Space to start/pause, Escape to reset
- **Modal:** Tab traps focus, Escape closes, Shift+Tab reverses
- **Calendar:** Arrow keys navigate days, Enter opens that day's todos

### Screen Reader Support
- All icons accompanied by visually hidden text or `aria-label`
- Status announcements via `aria-live` regions:
  - Todo added/removed/completed
  - Timer state changes
  - Session start/end
- Skip link to main content

### Motion Preferences
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  /* Keep essential state changes as instant transitions */
  .todo-completed { transition: none; }
}
```

---

## 7. RESPONSIVE BEHAVIOR

### Desktop (> 1024px)
- Full experience with 3D perspective transforms
- All ambient details visible (lamp flicker, wall textures)
- Side-by-side desk items in Study Room
- Full calendar grid in Hall

### Tablet (640-1024px)
- Reduced perspective (flatten 3D transforms)
- Desk items may stack vertically in Study Room
- Calendar grid maintained but smaller spheres
- Doors remain as door visuals but simplified

### Mobile (< 640px)
- **Hall:** 
  - Doors become large tap cards with icons
  - Calendar becomes horizontal week view (7 spheres)
  - Clock becomes elegant digital display
- **Study:**
  - Cork board → vertical scrollable card list
  - Notebook → bottom sheet or full-screen
  - Timer → full width, minimal surrounding UI
- **Meditate:**
  - Breathing circle fills width
  - Controls stack with large buttons
  - Consider full-screen mode

---

## 8. FILE STRUCTURE

```
src/
├── main.jsx                    # Entry, router, providers
├── App.jsx                     # Root wrapper
│
├── data/
│   └── mockDB.js              # Simulated async database
│
├── context/
│   └── TodoContext.jsx        # Global state management
│
├── hooks/
│   ├── useTodos.js            # Todo operations hook
│   ├── useTimer.js            # Timer/stopwatch logic
│   ├── useFocusTrap.js        # Modal accessibility
│   └── useSound.js            # Web Audio API helper
│
├── styles/
│   ├── globals.css            # CSS custom properties, reset, utilities
│   ├── animations.css         # Keyframe animations
│   └── responsive.css         # Breakpoint-specific overrides
│
├── components/
│   ├── ui/                    # Reusable primitives
│   │   ├── Button.jsx
│   │   ├── Modal.jsx
│   │   ├── IconButton.jsx
│   │   └── VisuallyHidden.jsx
│   │
│   ├── layout/
│   │   ├── RoomContainer.jsx  # Shared room wrapper with background
│   │   └── Navigation.jsx     # Minimal nav (back to hall)
│   │
│   ├── hall/
│   │   ├── HallRoom.jsx       # Main hall composition
│   │   ├── CalendarWall.jsx   # Sphere calendar + clock
│   │   ├── Clock.jsx          # SVG analog clock
│   │   ├── Door.jsx           # Reusable door component
│   │   └── Lamp.jsx           # Decorative lamp
│   │
│   ├── study/
│   │   ├── StudyRoom.jsx      # Main study composition
│   │   ├── CorkBoard.jsx      # Wall with pinned todos
│   │   ├── PostItNote.jsx     # Individual todo note
│   │   ├── Notebook.jsx       # Closed notebook + modal
│   │   ├── NotebookModal.jsx  # Todo creation form
│   │   ├── DeskTimer.jsx      # SVG timer/stopwatch
│   │   └── DeskSurface.jsx    # Table surface visual
│   │
│   └── meditate/
│       ├── MeditateRoom.jsx   # Main meditation composition
│       ├── BreathingCircle.jsx # Animated breathing guide
│       └── SessionControls.jsx # Duration + start/end
│
├── lib/
│   ├── utils.js               # cn() helper, date formatting
│   └── sounds.js              # Web Audio API sound generation
│
└── assets/
    └── textures/              # SVG patterns for wood, cork (optional)
```

---

## 9. KEY IMPLEMENTATION NOTES

### CSS 3D Effects (No libraries needed)
```css
/* Door perspective */
.door-frame {
  perspective: 800px;
}
.door {
  transform-origin: left center;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.door:hover {
  transform: rotateY(-20deg);
}

/* Post-it depth */
.post-it {
  transform: translateZ(0);
  transition: transform 0.2s, box-shadow 0.2s;
}
.post-it:hover {
  transform: translateY(-4px) translateZ(10px);
  box-shadow: 0 8px 16px rgba(0,0,0,0.2);
}
```

### Calendar Sphere Intensity Logic
```javascript
function getSphereStyle(date, todos) {
  const dayTodos = todos.filter(t => t.date === date);
  const completedCount = dayTodos.filter(t => t.completed).length;
  const totalCount = dayTodos.length;
  
  if (totalCount === 0) return { background: 'var(--sphere-off)' };
  
  const intensity = Math.min(totalCount / 5, 1); // Max intensity at 5+ todos
  const opacity = 0.3 + (intensity * 0.7);
  
  return {
    background: `radial-gradient(circle at 35% 35%, rgba(245, 166, 35, ${opacity}), rgba(212, 118, 58, ${opacity}))`,
    boxShadow: `0 0 ${10 * intensity}px rgba(245, 166, 35, ${0.3 * intensity})`
  };
}
```

### Cork Board Pin Effect (Pure CSS)
```css
.post-it {
  position: relative;
  /* ... note styles ... */
}
.post-it::before {
  content: '';
  position: absolute;
  top: -6px;
  left: 50%;
  transform: translateX(-50%);
  width: 8px;
  height: 8px;
  background: radial-gradient(circle at 30% 30%, #ddd, #888);
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0,0,0,0.3);
}
```

### SVG Clock Implementation
- Use React state with `useEffect` interval (1 second)
- Calculate rotation: `hourDeg = (hours % 12) * 30 + minutes * 0.5`
- Hands as `<line>` or `<rect>` elements with `transform: rotate(deg, cx, cy)`
- Markers as `<circle>` or short `<line>` elements at calculated positions

---

## 10. PERFORMANCE & BEST PRACTICES

- Use `will-change: transform` on animated elements (doors, post-its)
- Lazy load room components with `React.lazy()` + `Suspense`
- Debounce calendar re-renders when todo count changes
- Use CSS transforms instead of layout properties (avoid animating `width`, `height`, `top`, `left`)
- Preload critical fonts in `index.html`
- Keep sound synthesis lightweight (simple oscillators, short durations)

---

## SUMMARY FOR THE AI DEVELOPER

Build a **single-page React webapp** with three rooms that feels like a cozy virtual home. Use CSS to create a warm, jazz-café-meets-cozy-bedroom atmosphere with rich wood tones and amber lighting.

**Hall:** Calendar made of glowing spheres that intensify with todo count + analog clock + two doors leading to other rooms.

**Study Room:** Cork board with interactive post-it todos that make a sound when completed + a desk with a notebook for creating todos and a timer/stopwatch for focused sessions.

**Meditation Room:** Simple breathing circle with session timer.

**Data:** Use the provided mockDB pattern with async simulation.

**Accessibility:** WCAG 2.1 AA compliant with full keyboard navigation, screen reader support, ARIA labels, and `prefers-reduced-motion` respect.

**Responsive:** Beautiful on desktop with subtle 3D effects, functional and clean on mobile.

Make it feel **warm, personal, and encouraging** — like a digital sanctuary for focus and calm.
