/* card.jsx — Targeta base que simula paper sobre una taula */

import { cn } from '../../lib/utils'

/* Targeta contenidora principal */
export function Card({ className, children, ...props }) {
  return (
    <div
      className={cn(
        'bg-surface-card rounded-xl border border-border-soft shadow-card',
        'transition-shadow duration-base hover:shadow-card-hover',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

/* Capçalera de la targeta — zona de títol i subtítol */
export function CardHeader({ className, children, ...props }) {
  return (
    <div className={cn('px-6 pt-5 pb-3', className)} {...props}>
      {children}
    </div>
  )
}

/* Cos principal de la targeta */
export function CardContent({ className, children, ...props }) {
  return (
    <div className={cn('px-6 pb-4', className)} {...props}>
      {children}
    </div>
  )
}

/* Peu de la targeta — accions i metadades */
export function CardFooter({ className, children, ...props }) {
  return (
    <div
      className={cn('px-6 pb-5 pt-2 flex items-center gap-3', className)}
      {...props}
    >
      {children}
    </div>
  )
}
