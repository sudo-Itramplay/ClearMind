/* greeting-section.jsx — Benvinguda personalitzada amb missatge motivador */

import { Badge } from '../ui/badge'

/* Missatges motivadors que rotacionalment es mostren cada dia de la setmana */
const MOTIVATIONAL = [
  'Cada petit pas compta. Quin és el teu primer objectiu avui?',
  'El focus arriba un minut a la vegada. Comença ara i la resta vindrà.',
  'No cal la perfecció — prou amb avançar una mica cada dia.',
  'El teu cervell és capaç. Dona-li un inici clar i es posarà en marxa.',
  'Avui és un bon dia per completar una cosa important.',
  'La concentració és un múscul. Exercita\'l amb calma.',
  'Respira, organitza, comença. En aquest ordre.',
]

/* Salutació adaptada a l'hora del dia */
function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Bon dia'
  if (h < 20) return 'Bona tarda'
  return 'Bona nit'
}

/* Indicador d'estat de l'usuari — personalitzable en el futur */
function StatusPill() {
  return (
    <div
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-medium"
      style={{
        backgroundColor: 'var(--accent-primary-50)',
        borderColor: 'var(--accent-primary-light)',
        color: 'var(--accent-primary)',
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full animate-pulse"
        style={{ backgroundColor: 'var(--accent-calm)' }}
      />
      Focus mode actiu
    </div>
  )
}

export function GreetingSection({ username = 'Alex' }) {
  const greeting = getGreeting()
  const today = new Date().getDay()
  const message = MOTIVATIONAL[today % MOTIVATIONAL.length]

  return (
    <section className="space-y-3">
      {/* Línia principal de salutació */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <h1
          className="text-3xl font-bold tracking-tight leading-cozy heading-tracking"
          style={{ color: 'var(--text-primary)' }}
        >
          {greeting},{' '}
          <span style={{ color: 'var(--accent-primary)' }}>{username}</span>
          {' '}
          <span aria-hidden="true" className="text-2xl">👋</span>
        </h1>
        <StatusPill />
      </div>

      {/* Missatge motivador diari */}
      <p
        className="text-base leading-relaxed max-w-lg"
        style={{ color: 'var(--text-secondary)' }}
      >
        {message}
      </p>

      {/* Mini-estadística del dia — decorativa */}
      <div className="flex items-center gap-3 pt-1">
        <Badge variant="muted">
          {new Date().toLocaleDateString('ca-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
        </Badge>
      </div>
    </section>
  )
}
