/*
 * theme.js — Tokens de color exportats com a constants JS
 * Útils per a lògica condicional, SVG inline, o Canvas.
 * Mantinguts en sincronia amb globals.css i tailwind.config.js.
 *
 * ADHD DESIGN TOKENS
 * ─────────────────
 * Accent naming prioritizes emotional/functional intent over hue:
 *   primary = main CTA, focus    (terracotta — warm, active)
 *   reward  = streaks, done      (amber — positive, cafe-bell)
 *   calm    = success, breathe   (teal — restorative, grounded)
 *   danger  = errors ONLY        (red — reserved, avoid overuse)
 *
 * Surface naming follows elevation:
 *   base    = page background    (lowest)
 *   card    = panels, cards      (mid)
 *   rest    = relax/breathe view (intentionally muted)
 *   overlay = modals, popovers   (highest)
 */

/** Paleta completa del sistema de disseny ClearMind */
export const colors = {
  /* Accents principals */
  accentPrimary:      '#AE5815',
  accentPrimaryLight: '#D4956A',
  accentPrimary50:    '#FDF5EE',

  accentReward:      '#AE8204',
  accentRewardLight: '#D9B84F',

  accentCalm:      '#3E8283',
  accentCalmLight: '#7AB5B5',

  accentDanger:      '#C70D0B',
  accentDangerLight: '#E87878',

  /* Neutrals càlids */
  surfaceDark: '#203E39',

  /* Superfícies — mode clar */
  surfaceBase:    '#FBF7F0',
  surfaceCard:    '#F5EDE3',
  surfaceRest:    '#F0E8DC',
  surfaceOverlay: '#FFFFFF',

  /* Text */
  textHeading: '#3A271A',
  textBody:    '#57493B',
  textMuted:   '#8C7B6B',

  /* Vores */
  borderDefault: '#D4C8BA',
  borderSubtle:  '#E8DDD0',

  /* Legacy aliases (kept for backwards compatibility) */
  accentWarm:          '#AE8204',
  accentWarmLight:     '#D9B84F',
  accentCritical:      '#C70D0B',
  accentCriticalLight: '#E87878',
  surfaceMuted:  '#57493B',
  baseDark:      '#203E39',
  baseDeep:      '#3A271A',
  surfaceLight:  '#FBF7F0',
  surfaceElevated: '#FFFFFF',
  textPrimary:   '#3A271A',
  textSecondary: '#57493B',
  textTertiary:  '#8C7B6B',
  borderSoft:    '#E8DDD0',
}

/** Radis de vora — escala estandarditzada */
export const radii = {
  sm:   '8px',
  md:   '12px',
  lg:   '16px',
  xl:   '24px',
  '2xl':'32px',
  full: '9999px',
}

/** Durades d'animació — subtils i càlides */
export const durations = {
  fast: 150,
  base: 200,
  slow: 300,
}

/** Ombres — ambient light feel (café warmth) */
export const shadows = {
  card:         '0 2px 8px rgba(58,39,26,0.08), 0 1px 2px rgba(58,39,26,0.05)',
  cardHover:    '0 8px 24px rgba(58,39,26,0.12), 0 2px 6px rgba(58,39,26,0.08)',
  button:       '0 2px 4px rgba(58,39,26,0.12), inset 0 1px 0 rgba(255,255,255,0.12)',
  buttonHover:  '0 4px 10px rgba(58,39,26,0.18), inset 0 1px 0 rgba(255,255,255,0.18)',
  buttonActive: 'inset 0 2px 4px rgba(58,39,26,0.2)',
  ambient:      '0 4px 16px rgba(174,88,21,0.15)',
  focusWarm:    '0 0 0 3px rgba(174,88,21,0.25)',
  streak:       '0 2px 8px rgba(174,130,4,0.3)',
}
