/* Dashboard.jsx — Panell principal del nou sistema de disseny ClearMind */

import { Navbar }          from '../components/layout/navbar'
import { Sidebar }         from '../components/layout/sidebar'
import { GreetingSection } from '../components/features/greeting-section'
import { FocusTimer }      from '../components/features/focus-timer'
import { TaskList }        from '../components/features/task-list'
import { StreakTracker }   from '../components/features/streak-tracker'

/*
 * Panell de benvinguda — targeta decorativa de context diari
 * Mostra un resum ràpid de l'estat de l'usuari
 */
function DailyContextBanner() {
  const now = new Date()
  const dayName = now.toLocaleDateString('ca-ES', { weekday: 'long' })
  const hour = now.getHours()

  /* Missatge contextual basat en l'hora */
  const contextMsg =
    hour < 9  ? 'Bon matí! Comença amb calma i una tassa de cafè.' :
    hour < 14 ? 'Bon moment per a una sessió de focus intensa.' :
    hour < 18 ? 'Tarda productiva — evita les distraccions.' :
                'Vespre tranquil. Repassa i planifica per a demà.'

  return (
    <div
      className="rounded-xl px-5 py-4 border flex items-center gap-4"
      style={{
        backgroundColor: 'var(--accent-primary-50)',
        borderColor: 'var(--accent-primary-light)',
        borderStyle: 'dashed',
      }}
    >
      {/* Icona decorativa estil "llum de taula" */}
      <span className="text-2xl shrink-0" aria-hidden="true">
        {hour < 9 ? '🌅' : hour < 14 ? '☀️' : hour < 18 ? '🌤' : '🌙'}
      </span>
      <div>
        <p className="text-sm font-semibold capitalize" style={{ color: 'var(--text-primary)' }}>
          {dayName}
        </p>
        <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
          {contextMsg}
        </p>
      </div>
    </div>
  )
}

/*
 * Component principal del Dashboard.
 * Estructura de quadrícula amb barra lateral (escriptori) i
 * contingut principal (universal).
 */
export default function Dashboard() {
  return (
    /* Embolcall del sistema de disseny ClearMind */
    <div
      className="clearmind-app min-h-screen theme-transition"
      style={{ backgroundColor: 'var(--surface-light)' }}
    >
      {/* Capa de textura de soroll CSS-only */}
      <div className="noise-overlay" aria-hidden="true" />

      {/* Barra de navegació superior + nav mòbil inferior */}
      <Navbar username="Alex" />

      {/* Contenidor principal centrat */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-28 md:pb-10">
        <div className="flex gap-8 items-start">

          {/* ---- Barra lateral (visible en lg+) ---- */}
          <Sidebar />

          {/* ---- Contingut principal ---- */}
          <main className="flex-1 min-w-0 space-y-6">

            {/* Salutació personalitzada */}
            <GreetingSection username="Alex" />

            {/* Banner contextual del dia — vora puntejada analògica */}
            <DailyContextBanner />

            {/* Quadrícula de 2 columnes — Temporitzador + Ratxa */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <FocusTimer />
              <StreakTracker />
            </div>

            {/* Llista de tasques — amplada completa */}
            <TaskList />
          </main>
        </div>
      </div>
    </div>
  )
}
