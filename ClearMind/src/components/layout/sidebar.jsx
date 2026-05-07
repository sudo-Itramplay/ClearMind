/* sidebar.jsx — Barra lateral d'escriptori (lg+)
   Exactament 3 ítems: Sala, Estudi, Relax.
   Compleix WCAG 2.1 AA: aria-current, focus visible.    */

import { Link, useLocation } from 'react-router-dom'
import { cn } from '../../lib/utils'

/* Exactament 3 ítems — sincronia amb navbar.jsx */
const NAV_ITEMS = [
  {
    label: 'Sala',
    href:  '/hall',
    icon:  '⌂',
    description: 'Vestíbul principal',
    ariaLabel: 'Anar a la sala',
  },
  {
    label: 'Estudi',
    href:  '/study',
    icon:  '✏',
    description: 'Tasques i temporitzador',
    ariaLabel: "Anar a la sala d'estudi",
  },
  {
    label: 'Relax',
    href:  '/relax',
    icon:  '◎',
    description: 'Meditació i respiració',
    ariaLabel: 'Anar a la sala de meditació',
  },
]

export function Sidebar() {
  const location = useLocation()

  return (
    /* Oculta en mòbil — la nav mòbil és la barra inferior */
    <aside
      aria-label="Navegació secundària"
      className="hidden lg:block w-52 shrink-0"
    >
      {/* Contenidor enganxós — sembla un quadern sobre la taula */}
      <div
        className="sticky top-24 rounded-xl border border-border-soft shadow-card p-2 space-y-1"
        style={{ backgroundColor: 'var(--surface-card)', borderColor: 'var(--border-soft)' }}
      >
        {/* Etiqueta decorativa tipus "pestanya de quadern" */}
        <div
          className="px-3 pb-2 pt-1 mb-1 border-b"
          style={{ borderColor: 'var(--border-soft)' }}
        >
          <span
            className="text-[10px] font-semibold uppercase tracking-widest"
            style={{ color: 'var(--text-tertiary)' }}
          >
            Navegació
          </span>
        </div>

        <nav aria-label="Navegació lateral">
          {NAV_ITEMS.map(item => {
            const active = location.pathname === item.href
            return (
              <Link
                key={item.href}
                to={item.href}
                aria-label={item.ariaLabel}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg w-full group',
                  'transition-colors duration-150 ease-out',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1',
                  active
                    ? 'border'
                    : 'border border-transparent',
                )}
                style={{
                  backgroundColor: active ? 'var(--accent-primary-50)' : 'transparent',
                  borderColor: active ? 'var(--accent-primary-light)' : 'transparent',
                  color: active ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  '--tw-ring-color': 'var(--accent-primary)',
                  '--tw-ring-offset-color': 'var(--surface-card)',
                }}
              >
                {/* Icona en quadrat arrodonit */}
                <span
                  className={cn(
                    'w-7 h-7 rounded-md flex items-center justify-center text-sm',
                    'transition-colors duration-150 shrink-0',
                  )}
                  style={{
                    backgroundColor: active
                      ? 'var(--accent-primary)'
                      : 'var(--surface-light)',
                    color: active ? '#fff' : 'var(--text-tertiary)',
                  }}
                  aria-hidden="true"
                >
                  {item.icon}
                </span>

                {/* Etiqueta i descripció */}
                <div className="min-w-0">
                  <p className="text-sm font-medium leading-none">{item.label}</p>
                  <p
                    className="text-[10px] mt-0.5 leading-none"
                    style={{ color: 'var(--text-tertiary)' }}
                  >
                    {item.description}
                  </p>
                </div>
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
