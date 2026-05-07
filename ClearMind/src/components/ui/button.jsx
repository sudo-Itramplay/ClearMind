/* button.jsx — Component botó reutilitzable estil "segell embossat" */

import { cn } from '../../lib/utils'

/* Mapa de variants i mides — patró Shadcn/UI */
const variantClasses = {
  primary:   'bg-accent-primary text-white shadow-button hover:bg-accent-primary-light hover:shadow-button-hover active:scale-[0.97] active:shadow-button-active',
  secondary: 'bg-surface-card text-text-primary border border-border-default shadow-button hover:shadow-button-hover hover:bg-surface-elevated active:scale-[0.97]',
  ghost:     'bg-transparent text-text-secondary hover:bg-surface-card hover:text-text-primary active:scale-[0.97]',
  warm:      'bg-accent-warm text-white shadow-button hover:bg-accent-warm-light hover:shadow-button-hover active:scale-[0.97]',
  calm:      'bg-accent-calm text-white shadow-button hover:bg-accent-calm-light hover:shadow-button-hover active:scale-[0.97]',
  critical:  'bg-accent-critical text-white shadow-button hover:opacity-90 hover:shadow-button-hover active:scale-[0.97]',
}

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm gap-1.5',
  md: 'px-5 py-2 text-sm gap-2',
  lg: 'px-6 py-3 text-base gap-2',
  icon: 'p-2',
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}) {
  return (
    <button
      className={cn(
        /* Base — forma de pastilla, transicions suaus */
        'inline-flex items-center justify-center rounded-full font-medium',
        'transition-all duration-fast ease-out',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-light',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
