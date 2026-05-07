/* badge.jsx — Insígnia estil "etiqueta de paper" */

import { cn } from '../../lib/utils'

/* Mapa de variants d'insígnia */
const variantClasses = {
  warm:     'bg-amber-50     text-accent-warm     border-accent-warm-light',
  calm:     'bg-teal-50      text-accent-calm     border-accent-calm-light',
  critical: 'bg-red-50       text-accent-critical border-accent-critical-light',
  primary:  'bg-orange-50    text-accent-primary  border-accent-primary-light',
  muted:    'bg-surface-card text-text-secondary  border-border-default',
}

export function Badge({ variant = 'muted', className, children, ...props }) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        'transition-colors duration-fast',
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
