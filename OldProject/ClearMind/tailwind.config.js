/*
 * ============================================================
 * DESIGN_SYSTEM.md — Sistema de Disseny ClearMind
 * ============================================================
 *
 * CONVENCIÓ DE TOKENS (v2 — ADHD-optimized)
 * -----------------------------------------
 * Els tokens segueixen: {categoria}-{rol}[-{variant}]
 *
 *   color-accent-primary   → Terracota — accions principals, CTA, focus rings
 *   color-accent-reward    → Ambre daurat — rècords, recompenses, timer completat
 *   color-accent-calm      → Teal suau — èxit, respiració, calma
 *   color-accent-danger    → Vermell maó — NOMÉS errors, accions destructives
 *   color-surface-base     → Crema — fons de pàgina (mode clar)
 *   color-surface-card     → Vori — fons de targetes
 *   color-surface-rest     → Beige mut — zones de relax / respiració
 *   color-surface-overlay  → Blanc — superfícies elevades, modals
 *   color-text-heading     → Espresso — títols, text principal
 *   color-text-body        → Marró càlid — cos, descripcions
 *   color-text-muted       → Pedra → placeholder, desactivat
 *   color-border-default   → Vora estàndard
 *   color-border-subtle    → Divisor subtil
 *
 * Legacy aliases (accent-warm, accent-critical, etc.) are preserved
 * for backwards compatibility but prefer the new semantic names.
 *
 * ESCALA D'ARRODONIMENT
 *   sm=8px, md=12px, lg=16px, xl=24px, full=9999px
 *
 * ESCALA DE SHADOWS — ambient light feel
 *   card → paper sobre taula
 *   card-hover → paper lleugerament alçat
 *   button → botó en repòs (embossed)
 *   button-hover → botó al passar el cursor (lifted)
 *   ambient → brillantor tèbia d'accent
 *
 * ADHD DESIGN NOTES
 *   • accent-danger (red) is reserved for errors ONLY — never use
 *     for success/completion to avoid anxiety triggers.
 *   • accent-reward (amber) replaces red for timer-done flashes.
 *   • Warm surfaces reduce blue-light overstimulation.
 *   • prefers-reduced-motion is respected globally.
 * ============================================================
 */

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],

  /* Evita conflictes amb els estils existents de Hall/Study/Relax */
  corePlugins: {
    preflight: false,
  },

  theme: {
    extend: {
      colors: {
        /* ── Accents principals ────────────────────────── */
        'color-accent-primary':       '#AE5815',
        'color-accent-primary-light': '#D4956A',
        'color-accent-primary-50':    '#FDF5EE',

        'color-accent-reward':       '#AE8204',
        'color-accent-reward-light': '#D9B84F',

        'color-accent-calm':       '#3E8283',
        'color-accent-calm-light': '#7AB5B5',

        'color-accent-danger':       '#C70D0B',
        'color-accent-danger-light': '#E87878',

        /* ── Neutrals ──────────────────────────────────── */
        'color-text-body':    '#57493B',
        'color-surface-dark': '#203E39',
        'color-text-heading': '#3A271A',

        /* ── Superfícies ───────────────────────────────── */
        'color-surface-base':    '#FBF7F0',
        'color-surface-card':    '#F5EDE3',
        'color-surface-rest':    '#F0E8DC',
        'color-surface-overlay': '#FFFFFF',

        /* ── Text ──────────────────────────────────────── */
        'color-text-heading': '#3A271A',
        'color-text-body':    '#57493B',
        'color-text-muted':   '#8C7B6B',

        /* ── Vores ─────────────────────────────────────── */
        'color-border-default': '#D4C8BA',
        'color-border-subtle':  '#E8DDD0',

        /* ── Legacy aliases (backwards compatibility) ──── */
        'accent-primary':        '#AE5815',
        'accent-primary-light':  '#D4956A',
        'accent-primary-50':     '#FDF5EE',
        'surface-muted':  '#57493B',
        'base-dark':      '#203E39',
        'base-deep':      '#3A271A',
        'accent-warm':          '#AE8204',
        'accent-warm-light':    '#D9B84F',
        'accent-critical':      '#C70D0B',
        'accent-critical-light':'#E87878',
        'accent-calm':          '#3E8283',
        'accent-calm-light':    '#7AB5B5',
        'surface-light':    '#FBF7F0',
        'surface-card':     '#F5EDE3',
        'surface-elevated': '#FFFFFF',
        'text-primary':   '#3A271A',
        'text-secondary': '#57493B',
        'text-tertiary':  '#8C7B6B',
        'border-default': '#D4C8BA',
        'border-soft':    '#E8DDD0',
      },

      borderRadius: {
        sm:   '8px',
        md:   '12px',
        lg:   '16px',
        xl:   '24px',
        '2xl':'32px',
        full: '9999px',
      },

      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },

      lineHeight: {
        cozy:    '1.6',
        relaxed: '1.75',
      },

      boxShadow: {
        'card':          '0 2px 8px rgba(58,39,26,0.08), 0 1px 2px rgba(58,39,26,0.05)',
        'card-hover':    '0 8px 24px rgba(58,39,26,0.12), 0 2px 6px rgba(58,39,26,0.08)',
        'button':        '0 2px 4px rgba(58,39,26,0.12), inset 0 1px 0 rgba(255,255,255,0.12)',
        'button-hover':  '0 4px 10px rgba(58,39,26,0.18), inset 0 1px 0 rgba(255,255,255,0.18)',
        'button-active': 'inset 0 2px 4px rgba(58,39,26,0.2)',
        'ambient':       '0 4px 16px rgba(174,88,21,0.15)',
        'focus-warm':    '0 0 0 3px rgba(174,88,21,0.25)',
        'streak':        '0 2px 8px rgba(174,130,4,0.3)',
      },

      transitionDuration: {
        fast: '150ms',
        base: '200ms',
        slow: '300ms',
      },

      animation: {
        'pulse-warm': 'pulse 2s cubic-bezier(0.4,0,0.6,1) infinite',
      },
    },
  },

  plugins: [],
}
