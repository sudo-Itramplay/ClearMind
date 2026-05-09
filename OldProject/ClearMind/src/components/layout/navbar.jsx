/* navbar.jsx — Barra de navegació superior + nav mòbil inferior
   Exactament 3 ítems: Sala, Estudi, Relax.
   Compleix WCAG 2.1 AA: aria-current, aria-label, focus visible.   */

import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '../../lib/utils'

/* Exactament 3 ítems de navegació — especificació del producte */
const NAV_ITEMS = [
  { label: 'Sala',   href: '/hall',  icon: '⌂', ariaLabel: 'Anar a la sala' },
  { label: 'Estudi', href: '/study', icon: '✏', ariaLabel: "Anar a la sala d'estudi" },
  { label: 'Relax',  href: '/relax', icon: '◎', ariaLabel: 'Anar a la sala de meditació' },
]

export function Navbar({ username = 'Alex' }) {
  const location = useLocation()

  /* Gestió del tema — persistit a localStorage entre sessions */
  const [isDark, setIsDark] = useState(() => {
    try {
      const saved = localStorage.getItem('clearmind-theme')
      if (saved) return saved === 'dark'
    } catch {}
    return document.documentElement.getAttribute('data-theme') === 'dark'
  })

  function toggleTheme() {
    const next = !isDark
    if (next) {
      document.documentElement.setAttribute('data-theme', 'dark')
    } else {
      document.documentElement.removeAttribute('data-theme')
    }
    try { localStorage.setItem('clearmind-theme', next ? 'dark' : 'light') } catch {}
    setIsDark(next)
  }

  function isActive(href) {
    return location.pathname === href
  }

  return (
    <>
      {/* ── Barra superior (escriptori i mòbil) ── */}
      <header
        role="banner"
        className="sticky top-0 z-50 w-full border-b border-border-soft"
        style={{ backgroundColor: 'var(--surface-light)', borderColor: 'var(--border-soft)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">

            {/* Logo — apunta a /hall (la sala és la pàgina d'inici) */}
            <Link
              to="/hall"
              aria-label="ClearMind — Anar a la pàgina d'inici"
              className="flex items-center gap-2"
              style={{ textDecoration: 'none' }}
            >
              <span
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
                style={{ backgroundColor: 'var(--accent-primary)' }}
                aria-hidden="true"
              >
                C
              </span>
              <span
                className="text-xl font-bold tracking-tight heading-tracking"
                style={{ color: 'var(--text-primary)' }}
              >
                ClearMind
              </span>
            </Link>

            {/* Nav central — visible en pantalles grans */}
            <nav aria-label="Navegació principal" className="hidden md:flex items-center gap-1">
              {NAV_ITEMS.map(item => {
                const active = isActive(item.href)
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    aria-label={item.ariaLabel}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium',
                      'transition-colors duration-150 ease-out',
                      'focus-visible:outline-none focus-visible:ring-2',
                      'focus-visible:ring-offset-2',
                      active
                        ? 'bg-accent-primary text-white shadow-button'
                        : 'text-text-secondary hover:text-text-primary hover:bg-surface-card',
                    )}
                    style={{
                      '--tw-ring-color': 'var(--accent-primary)',
                      '--tw-ring-offset-color': 'var(--surface-light)',
                    }}
                  >
                    <span aria-hidden="true">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </nav>

            {/* Zona dreta — toggle de tema + avatar */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                aria-label={isDark ? 'Canviar a mode clar' : 'Canviar a mode fosc'}
                aria-pressed={isDark}
                className={cn(
                  'w-9 h-9 rounded-full flex items-center justify-center text-sm',
                  'border transition-colors duration-150',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                )}
                style={{
                  borderColor: 'var(--border-default)',
                  color: 'var(--text-tertiary)',
                  '--tw-ring-color': 'var(--accent-primary)',
                  '--tw-ring-offset-color': 'var(--surface-light)',
                }}
              >
                <span aria-hidden="true">{isDark ? '☀' : '☾'}</span>
              </button>

              {/* Avatar de l'usuari */}
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2"
                style={{
                  backgroundColor: 'var(--accent-primary-50)',
                  borderColor: 'var(--accent-primary-light)',
                  color: 'var(--accent-primary)',
                }}
                aria-label={`Usuari: ${username}`}
                title={username}
              >
                <span aria-hidden="true">{username[0].toUpperCase()}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ── Navegació inferior — mòbil únicament ── */}
      <nav
        aria-label="Navegació mòbil"
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t"
        style={{
          backgroundColor: 'var(--surface-light)',
          borderColor: 'var(--border-soft)',
          /* Espai per a la safe area en dispositius mòbils */
          paddingBottom: 'env(safe-area-inset-bottom, 0)',
        }}
      >
        <div className="flex items-stretch">
          {NAV_ITEMS.map(item => {
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                to={item.href}
                aria-label={item.ariaLabel}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex-1 flex flex-col items-center gap-0.5 py-3 px-1',
                  'text-xs font-medium transition-colors duration-150',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset',
                )}
                style={{
                  color: active ? 'var(--accent-primary)' : 'var(--text-tertiary)',
                  '--tw-ring-color': 'var(--accent-primary)',
                  /* Touch target mínim 44×44px (py-3 = 12px × 2 + ~20px icona/text ≈ 44px) */
                  minHeight: '44px',
                }}
              >
                <span
                  className="text-lg leading-none"
                  aria-hidden="true"
                  style={{
                    filter: active
                      ? 'drop-shadow(0 0 3px var(--accent-primary-light))'
                      : 'none',
                  }}
                >
                  {item.icon}
                </span>
                <span className="leading-tight">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
