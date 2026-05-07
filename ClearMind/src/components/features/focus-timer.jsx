/* focus-timer.jsx — Temporitzador Pomodoro estil rellotge analògic */

import { useState, useEffect, useRef } from 'react'
import { Button } from '../ui/button'
import { Card, CardHeader, CardContent } from '../ui/card'
import { cn } from '../../lib/utils'

/* Constants del Pomodoro */
const MODES = {
  pomodoro: { label: 'Pomodoro 🍅', duration: 25 * 60 },
  short:    { label: 'Pausa curta ☕', duration: 5 * 60 },
  long:     { label: 'Pausa llarga 🛋', duration: 15 * 60 },
}

/* Paràmetres del cercle SVG */
const R = 52
const CX = 60
const CIRCUMFERENCE = 2 * Math.PI * R  /* ≈ 326.73 */

export function FocusTimer() {
  const [mode, setMode] = useState('pomodoro')
  const [timeLeft, setTimeLeft] = useState(MODES.pomodoro.duration)
  const [isRunning, setIsRunning] = useState(false)
  const [sessions, setSessions] = useState(0)
  const intervalRef = useRef(null)

  /* Reinicialitza quan canvia el mode */
  useEffect(() => {
    setIsRunning(false)
    setTimeLeft(MODES[mode].duration)
  }, [mode])

  /* Lògica del compte enrere */
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            setIsRunning(false)
            setSessions(s => s + 1)
            return 0
          }
          return t - 1
        })
      }, 1000)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [isRunning])

  /* Format del temps — mm:ss */
  const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0')
  const seconds = (timeLeft % 60).toString().padStart(2, '0')

  /* Càlcul de l'arc de progrés */
  const total = MODES[mode].duration
  const filled = (timeLeft / total) * CIRCUMFERENCE
  const offset = CIRCUMFERENCE - filled

  /* Estat textual del temporitzador */
  const statusLabel = isRunning ? 'focus...' : timeLeft === total ? 'preparat' : 'pausat'

  /* Color de l'arc segons el mode */
  const arcColor = {
    pomodoro: 'var(--accent-primary)',
    short:    'var(--accent-calm)',
    long:     'var(--accent-warm)',
  }[mode]

  function handleReset() {
    setIsRunning(false)
    setTimeLeft(MODES[mode].duration)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
            Temporitzador de Focus
          </h2>

          {/* Selector de mode — estil pestanyes subtils */}
          <div
            className="flex items-center gap-0.5 p-1 rounded-lg"
            style={{ backgroundColor: 'var(--surface-light)', border: '1px solid var(--border-soft)' }}
          >
            {Object.entries(MODES).map(([key, cfg]) => (
              <button
                key={key}
                onClick={() => setMode(key)}
                className={cn(
                  'px-2.5 py-1 rounded-md text-[11px] font-medium transition-all duration-fast',
                  mode === key
                    ? 'bg-accent-primary text-white shadow-button'
                    : 'text-text-tertiary hover:text-text-secondary'
                )}
              >
                {key === 'pomodoro' ? '🍅' : key === 'short' ? '☕' : '🛋'}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col items-center gap-5 pb-6">
        {/* ---- Cercle de progrés estil rellotge ---- */}
        <div className="relative w-40 h-40">
          <svg
            viewBox="0 0 120 120"
            className="w-full h-full -rotate-90"
            aria-label={`Temps restant: ${minutes} minuts i ${seconds} segons`}
          >
            {/* Pista de fons — "marc del rellotge" */}
            <circle
              cx={CX} cy={CX} r={R}
              fill="none"
              stroke="var(--border-soft)"
              strokeWidth="8"
              strokeLinecap="round"
            />

            {/* Marc decoratiu exterior — vores del rellotge analògic */}
            <circle
              cx={CX} cy={CX} r={R + 6}
              fill="none"
              stroke="var(--border-default)"
              strokeWidth="1"
              strokeDasharray="3 6"
              opacity="0.6"
            />

            {/* Arc de progrés principal */}
            <circle
              cx={CX} cy={CX} r={R}
              fill="none"
              stroke={arcColor}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={offset}
              className="transition-all duration-1000 ease-out"
            />
          </svg>

          {/* Text central — temps i estat */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span
              className="text-2xl font-bold tabular-nums tracking-tight"
              style={{ color: 'var(--text-primary)' }}
            >
              {minutes}:{seconds}
            </span>
            <span
              className="text-xs mt-0.5 font-medium capitalize"
              style={{ color: 'var(--text-tertiary)' }}
            >
              {statusLabel}
            </span>
          </div>
        </div>

        {/* ---- Controls ---- */}
        <div className="flex items-center gap-3">
          <Button
            variant={isRunning ? 'secondary' : 'primary'}
            size="md"
            onClick={() => setIsRunning(r => !r)}
            disabled={timeLeft === 0}
          >
            {isRunning ? '⏸ Pausa' : '▶ Iniciar'}
          </Button>
          <Button variant="ghost" size="md" onClick={handleReset}>
            ↺ Reset
          </Button>
        </div>

        {/* Comptador de sessions completades */}
        {sessions > 0 && (
          <p className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>
            {sessions} {sessions === 1 ? 'sessió' : 'sessions'} completades avui 🎉
          </p>
        )}
      </CardContent>
    </Card>
  )
}
