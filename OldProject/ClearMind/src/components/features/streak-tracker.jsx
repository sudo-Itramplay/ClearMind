/* streak-tracker.jsx — Ratxa d'estudi — 7 cercles estil "segells" */

import { Card, CardHeader, CardContent } from '../ui/card'
import { cn } from '../../lib/utils'

/* Noms dels dies en català — setmana comença dilluns */
const DAY_LABELS = ['Dl', 'Dm', 'Dc', 'Dj', 'Dv', 'Ds', 'Dg']

/*
 * Dades de mostra de la ratxa setmanal.
 * true = sessió completada, false = sense sessió.
 * Ordre: Dl, Dm, Dc, Dj, Dv, Ds, Dg
 */
const STREAK_DATA = [true, true, true, true, false, false, false]

/* Ajusta l'índex de dia: JS usa 0=Dg, nosaltres volem 0=Dl */
function getTodayIndex() {
  const jsDay = new Date().getDay() /* 0=Dg, 1=Dl, ..., 6=Ds */
  return jsDay === 0 ? 6 : jsDay - 1
}

/* Segell decoratiu per dia amb ratxa */
function StreakDot({ hasStreak, isToday, label }) {
  return (
    <div className="flex flex-col items-center gap-1.5 flex-1">
      {/* Cercle principal del dia */}
      <div
        className={cn(
          'w-full aspect-square rounded-full flex items-center justify-center',
          'text-xs font-bold transition-all duration-base',
          hasStreak && isToday   && 'ring-2 ring-offset-2',
          !hasStreak && isToday  && 'border-2 border-solid',
          !hasStreak && !isToday && 'border-2 border-dashed',
        )}
        style={{
          /* Estat: completat */
          ...(hasStreak && {
            backgroundColor: 'var(--accent-warm)',
            color: '#fff',
            boxShadow: '0 2px 8px rgba(174,130,4,0.3)',
          }),
          /* Estat: avui sense completar */
          ...(!hasStreak && isToday && {
            backgroundColor: 'var(--accent-primary-50)',
            borderColor: 'var(--accent-primary)',
            color: 'var(--accent-primary)',
          }),
          /* Estat: dia futur o omès */
          ...(!hasStreak && !isToday && {
            backgroundColor: 'var(--surface-light)',
            borderColor: 'var(--border-default)',
            color: 'var(--text-tertiary)',
          }),
          /* Ressaltat per al "avui completat" */
          ...(hasStreak && isToday && {
            ringColor: 'var(--accent-warm)',
            ringOffsetColor: 'var(--surface-card)',
          }),
        }}
      >
        {hasStreak ? '✦' : isToday ? '◉' : '·'}
      </div>

      {/* Etiqueta del dia */}
      <span
        className="text-[10px] font-medium"
        style={{ color: isToday ? 'var(--accent-primary)' : 'var(--text-tertiary)' }}
      >
        {label}
      </span>
    </div>
  )
}

export function StreakTracker() {
  const todayIndex = getTodayIndex()
  const streakCount = STREAK_DATA.filter(Boolean).length

  /* Calcula la ratxa consecutiva actual (dies seguits des d'avui cap enrere) */
  let consecutive = 0
  for (let i = todayIndex; i >= 0; i--) {
    if (STREAK_DATA[i]) consecutive++
    else break
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
            Ratxa d'Estudi
          </h2>

          {/* Comptador de ratxa — zona principal de recompensa */}
          <div className="flex items-center gap-1.5">
            <span className="text-xl" aria-hidden="true">🔥</span>
            <div className="flex items-baseline gap-0.5">
              <span className="text-2xl font-bold" style={{ color: 'var(--accent-warm)' }}>
                {consecutive}
              </span>
              <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                dies seguits
              </span>
            </div>
          </div>
        </div>

        {/* Subtítol contextual */}
        <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>
          {streakCount} de 7 dies amb sessió completada aquesta setmana
        </p>
      </CardHeader>

      <CardContent className="pb-6">
        {/* Visualitzador de 7 cercles — escriptori i mòbil */}
        <div className="flex items-end gap-1.5">
          {DAY_LABELS.map((label, i) => (
            <StreakDot
              key={label}
              hasStreak={STREAK_DATA[i]}
              isToday={i === todayIndex}
              label={label}
            />
          ))}
        </div>

        {/* Missatge de motivació adaptat a la ratxa */}
        <p
          className="mt-4 text-xs text-center font-medium"
          style={{ color: 'var(--text-tertiary)' }}
        >
          {consecutive >= 7
            ? '🏆 Setmana perfecta! Ets increïble.'
            : consecutive >= 5
            ? '🌟 Gairebé perfecte — segueix!'
            : consecutive >= 3
            ? '💪 Bona ratxa. No la trenquis.'
            : consecutive >= 1
            ? '🌱 Bon inici. Cada dia és un pas.'
            : '✨ Avui és el millor moment per començar.'}
        </p>
      </CardContent>
    </Card>
  )
}
