/* utils.js — Utilitats generals del projecte ClearMind */

import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Combina classes de Tailwind i clsx de forma segura,
 * resolent conflictes amb tailwind-merge.
 * Segueix el patró estàndard de Shadcn/UI.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
