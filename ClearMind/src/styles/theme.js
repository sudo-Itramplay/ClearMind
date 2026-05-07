/*
 * theme.js — Tokens de color exportats com a constants JS
 * Útils per a lògica condicional, SVG inline, o Canvas.
 * Mantinguts en sincronia amb globals.css i tailwind.config.js.
 */

/** Paleta completa del sistema de disseny ClearMind */
export const colors = {
  /* Accents principals */
  accentPrimary:       '#AE5815',
  accentPrimaryLight:  '#D4956A',
  accentPrimary50:     '#FDF5EE',

  /* Neutrals càlids */
  surfaceMuted: '#57493B',
  baseDark:     '#203E39',
  baseDeep:     '#3A271A',

  /* Accents secundaris */
  accentWarm:          '#AE8204',
  accentWarmLight:     '#D9B84F',
  accentCritical:      '#C70D0B',
  accentCriticalLight: '#E87878',
  accentCalm:          '#3E8283',
  accentCalmLight:     '#7AB5B5',

  /* Superfícies — mode clar */
  surfaceLight:    '#FBF7F0',
  surfaceCard:     '#F5EDE3',
  surfaceElevated: '#FFFFFF',

  /* Text */
  textPrimary:   '#3A271A',
  textSecondary: '#57493B',
  textTertiary:  '#8C7B6B',

  /* Vores */
  borderDefault: '#D4C8BA',
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
