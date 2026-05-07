/* progress.jsx — Barra de progrés lineal, estil analògic */

import { cn } from '../../lib/utils'

/* Colors de la pista de progrés */
const trackColors = {
  primary:  'bg-accent-primary',
  warm:     'bg-accent-warm',
  calm:     'bg-accent-calm',
  critical: 'bg-accent-critical',
}

export function Progress({
  value = 0,
  max = 100,
  variant = 'primary',
  className,
  ...props
}) {
  const pct = Math.min(Math.max((value / max) * 100, 0), 100)

  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      className={cn(
        'w-full h-2 bg-border-soft rounded-full overflow-hidden',
        className
      )}
      {...props}
    >
      <div
        className={cn(
          'h-full rounded-full transition-all duration-slow ease-out',
          trackColors[variant]
        )}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
