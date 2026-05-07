/*
 * ============================================================
 * DESIGN_SYSTEM.md — Sistema de Disseny ClearMind
 * ============================================================
 *
 * CONVENCIÓ DE TOKENS
 * -------------------
 * Els tokens de color segueixen el patró: {categoria}-{rol}[-{variant}]
 *
 *   accent-primary        → Terracota càlida — accions principals, CTA
 *   accent-warm           → Ambre daurat — insígnies, destacats
 *   accent-calm           → Teal suau — èxit, informació, calma
 *   accent-critical       → Vermell maó — errors, accions destructives
 *   surface-light         → Crema — fons de pàgina (mode clar)
 *   surface-card          → Vori — fons de targetes (mode clar)
 *   surface-elevated      → Blanc — superfícies elevades, modals
 *   text-primary          → Espresso — text principal
 *   text-secondary        → Marró càlid — text secundari
 *   text-tertiary         → Pedra → placeholder, desactivat
 *   border-default        → Vora estàndard
 *   border-soft           → Divisor subtil
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
 * TOTES les colors estan sincronitzades amb les variables CSS
 * definides a src/styles/globals.css (:root i [data-theme="dark"]).
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
        /* Accents principals — mirall de les variables CSS */
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

        /* Superfícies */
        'surface-light':    '#FBF7F0',
        'surface-card':     '#F5EDE3',
        'surface-elevated': '#FFFFFF',

        /* Text */
        'text-primary':   '#3A271A',
        'text-secondary': '#57493B',
        'text-tertiary':  '#8C7B6B',

        /* Vores */
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
