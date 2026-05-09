# PROMPT 1 — Visual Foundation & All Rooms
## For: Claude Design (1 of 2)

Build a complete React webapp using Vite. Create the following file structure with beautiful, cozy, ADHD-optimized visuals. Use ONLY static/mock data. No state management yet.

### Design Philosophy: "Warm Jazz Café Meets Cozy Diorama"
- Warm, intimate lighting like a Persona 5 café
- Cozy domestic feel like an isometric room scene
- Pure CSS/SVG — no images, no pixel art
- ADHD-optimized: warm muted backgrounds, clear hierarchy, generous spacing, nothing overwhelming

### Global Styles (`src/styles/globals.css`)
Create CSS custom properties:
```css
:root {
  /* ADHD-optimized warm palette — no harsh whites or pure blacks */
  --bg-page: #FBF7F0;        /* Warm cream page background */
  --bg-wall: #2C2218;        /* Deep wood wall */
  --bg-floor: #3D2E20;       /* Floor */
  --wood-dark: #4A3728;
  --wood-mid: #6B4E3D;
  --wood-light: #8B6F5C;
  --amber-glow: #D4A574;     /* Primary warm light */
  --amber-soft: #E8C9A0;     /* Soft highlights */
  --cream: #F5E6D3;          /* Paper, text on dark */
  --cork: #C4A882;
  --cork-dark: #8B7355;
  --text-heading: #3A271A;   /* Dark coffee — high contrast but warm */
  --text-body: #57493B;      /* Readable brown */
  --accent-study: #D4763A;   /* Warm orange for study */
  --accent-meditate: #5A8A8C;/* Soft teal for calm */
  --postit-yellow: #F5E6A3;
  --postit-rose: #E8B4B8;
  --postit-mint: #B8D8C8;
  --sphere-on: #F5A623;
  --sphere-off: #3D2E20;
  --focus-ring: #AE5815;     /* Clear focus indicator */
  
  /* Spacing — generous for ADHD readability */
  --space-xs: 0.5rem;
  --space-sm: 0.75rem;
  --space-md: 1.25rem;
  --space-lg: 2rem;
  --space-xl: 3rem;
  
  /* Shadows — soft ambient light */
  --shadow-sm: 0 1px 3px rgba(60, 40, 20, 0.15);
  --shadow-md: 0 4px 12px rgba(60, 40, 20, 0.2);
  --shadow-lg: 0 8px 24px rgba(60, 40, 20, 0.25);
  --glow-amber: 0 0 40px 10px rgba(212, 165, 116, 0.3);
}
```

Typography:
- Headings: "Playfair Display" or "Crimson Pro" (serif, elegant, from Google Fonts)
- Body: "Inter" (clean, highly readable)
- Numbers/Clocks: "JetBrains Mono"
- Base font-size: 18px (larger for ADHD readability)
- Line-height: 1.6

### Reusable Components

**`src/components/ui/Button.jsx`**
- Rounded corners (12px), generous padding
- Variants: primary (amber), secondary (wood), ghost
- Hover: subtle lift + glow
- Focus: 3px solid `--focus-ring` outline, offset 2px
- Minimum touch target: 48px height

**`src/components/ui/Modal.jsx`**
- Paper-like background (`--cream`)
- Soft shadow for depth
- Backdrop: semi-transparent dark with blur
- Close button in top-right

**`src/components/ui/VisuallyHidden.jsx`**
- Standard sr-only pattern for screen reader text

### PAGE 1: Hall (`src/pages/Hall.jsx`)

The landing page. A cozy room with two doors.

**Layout:**
- Full viewport, background: `--bg-wall` with subtle radial gradient vignette
- Floor at bottom 20%: `--bg-floor` with perspective transform

**Calendar Wall (upper center):**
- Grid of 35 spheres (7×5) representing days
- Each sphere: 24px diameter, `border-radius: 50%`
- CSS 3D sphere effect:
  ```css
  background: radial-gradient(circle at 35% 35%, var(--amber-soft), var(--sphere-on));
  box-shadow: 
    inset -2px -2px 4px rgba(0,0,0,0.3),
    inset 2px 2px 4px rgba(255,255,255,0.2),
    0 2px 4px rgba(0,0,0,0.3);
  ```
- Mock data: random spheres lit up with varying opacity (0.3 to 1.0)
- Label above: "Your Month" in serif heading

**Wall Clock (upper right):**
- SVG analog clock, 120px diameter
- Cream face, dark wood rim, amber hands
- Real-time updating (use setInterval)
- Hour markers as small lines, minute markers smaller

**Left Door → Study:**
- Wooden frame (`--wood-dark`), 180px wide, 240px tall
- CSS 3D: `perspective: 800px`, slightly ajar (`rotateY(-15deg)`)
- Warm light spilling from crack (pseudo-element with gradient)
- Brass plaque below: "Study Room"
- Hover: opens more (`rotateY(-25deg)`), light intensifies

**Right Door → Meditate:**
- Same frame style
- Closed, soft teal glow at edges
- Plaque: "Meditate"
- Hover: glow intensifies

**Ambient Details:**
- Small table with lamp between doors (decorative divs with gradients)
- Lamp has subtle flicker animation (opacity 0.95-1.0, 4s loop)
- Rug on floor: patterned rectangle with shadow

### PAGE 2: Study Room (`src/pages/Study.jsx`)

First-person view sitting at a desk, looking at a wall.

**Cork Board (upper 60% of viewport):**
- Large rectangle, `--cork` background with subtle noise texture
- Wood frame (`--wood-light`, 8px border)
- 6-8 post-it notes pinned to it:
  - Each note: rectangle with slight random rotation (-2deg to +2deg)
  - Colors: mostly yellow, 1-2 rose, 1-2 mint
  - CSS pin: small circle at top center (::before pseudo-element, gradient for 3D effect)
  - Text: "Review calculus", "Spanish vocab", etc. (mock tasks)
  - Shadow for depth
  - Hover: lift up (translateY -4px), shadow increases

**Desk Surface (bottom 40%):**
- `--wood-mid` surface, full width
- Left side: **Notebook**
  - Closed book visual: leather brown, stitching effect (dashed border)
  - Label: "My Tasks"
  - Click: opens empty Modal (placeholder)
- Right side: **Timer**
  - Circular SVG ring, 140px diameter
  - Outer ring: `--wood-mid` with tick marks
  - Center text: "25:00" in JetBrains Mono
  - Below: two pill buttons "Timer" and "Stopwatch" (Timer active/selected)
  - Start button below

### PAGE 3: Meditate Room (`src/pages/Meditate.jsx`)

Minimal and calm.

- Background: gradient from deep teal (`#1A2E2E`) to soft blue (`#2E4A4A`)
- Center: Large breathing circle, 200px diameter
  - `--accent-meditate` color
  - Animated: scale 1.0 → 1.3 over 4s (inhale), hold 2s, scale 1.3 → 1.0 over 6s (exhale), hold 2s
  - Subtle opacity change synced with scale
- Below circle: Text changing with animation: "Breathe In..." → "Hold..." → "Breathe Out..." → "Hold..."
- Below text: Duration buttons: "3 min", "5 min", "10 min" (pill shape, ghost style)
- Start button (primary amber style)

### App Shell (`src/App.jsx`)
- Simple state-based page switcher (no router yet, just conditional rendering)
- Buttons or links to switch between Hall, Study, Meditate
- This is temporary for previewing — we'll add real routing later

### KEY RULES FOR THIS PROMPT:
- Use React functional components only
- All styling via CSS custom properties + inline styles where dynamic
- NO external UI libraries (no MUI, no Chakra)
- Icons: use simple text or SVG, or Lucide if you must
- NO complex state — useState ONLY for: clock time, breathing animation phase, modal open/close
- Make it visually stunning — this is the portfolio piece
- Every interactive element must have a visible focus ring
- Animations must be smooth and calming, never jarring
- Generous whitespace — ADHD brains need breathing room
