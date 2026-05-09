/* desk-timer.jsx — Temporitzador circular sobre la taula
   Mode compte enrere i cronòmetre. Interruptor de mode sempre visible.
   Presets de temps (15/25/45/60 min). Glow progressiu via classes CSS.
   WCAG 2.1 AA: role="timer", aria-live, radiogroup, focus visible.    */

import { useState, useEffect, useRef, useCallback } from 'react'
import { cn } from '../../lib/utils'

const MODES = { countdown: 'countdown', stopwatch: 'stopwatch' }

/* Presets Pomodoro en minuts */
const PRESETS = [
  { label: '15 min', value: 15, ariaLabel: 'Establir 15 minuts' },
  { label: '25 min', value: 25, ariaLabel: 'Establir 25 minuts (Pomodoro)' },
  { label: '45 min', value: 45, ariaLabel: 'Establir 45 minuts' },
  { label: '60 min', value: 60, ariaLabel: 'Establir 60 minuts' },
]

const DEFAULT_MIN = 25

/* Determina la classe de glow en funció del percentatge restant */
function glowClass(pct, mode, isRunning, isDone) {
  if (isDone)        return 'glow-done'
  if (!isRunning)    return ''
  if (mode === MODES.stopwatch) return 'glow-calm'
  if (pct > 50)      return 'glow-amber'
  if (pct > 25)      return 'glow-terracotta'
  return 'glow-critical'
}

/* Formats mm:ss */
function fmtTime(s) {
  const m = Math.floor(Math.abs(s) / 60).toString().padStart(2, '0')
  const sec = (Math.abs(s) % 60).toString().padStart(2, '0')
  return `${m}:${sec}`
}

export function DeskTimer() {
  const [mode,         setMode]         = useState(MODES.countdown)
  const [inputMinutes, setInputMinutes] = useState(DEFAULT_MIN)
  const [totalSeconds, setTotalSeconds] = useState(DEFAULT_MIN * 60)
  const [timeLeft,     setTimeLeft]     = useState(DEFAULT_MIN * 60)
  const [isRunning,    setIsRunning]    = useState(false)
  const [isDone,       setIsDone]       = useState(false)
  const [announcement, setAnnouncement] = useState('')
  const intervalRef = useRef(null)

  /* Minuts llegibles per a anuncis d'aria-live cada minut */
  const lastAnnouncedMin = useRef(null)

  const announce = useCallback((msg, delay = 2000) => {
    setAnnouncement(msg)
    setTimeout(() => setAnnouncement(''), delay)
  }, [])

  /* Lògica del compte enrere / cronòmetre */
  useEffect(() => {
    if (!isRunning) { clearInterval(intervalRef.current); return }

    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (mode === MODES.countdown) {
          if (prev <= 1) {
            clearInterval(intervalRef.current)
            setIsRunning(false)
            setIsDone(true)
            setAnnouncement('Temps acabat! Bona feina!')
            return 0
          }
          /* Anuncia cada minut sencer */
          const newVal = prev - 1
          const mins   = Math.floor(newVal / 60)
          if (newVal % 60 === 0 && mins !== lastAnnouncedMin.current) {
            lastAnnouncedMin.current = mins
            if (mins <= 5 && mins > 0) {
              setAnnouncement(mins === 1 ? '1 minut restant' : `${mins} minuts restants`)
            }
          }
          return newVal
        }
        /* Cronòmetre — cap amunt */
        return prev + 1
      })
    }, 1000)

    return () => clearInterval(intervalRef.current)
  }, [isRunning, mode])

  const pct = mode === MODES.countdown && totalSeconds > 0
    ? (timeLeft / totalSeconds) * 100
    : 100

  const glow = glowClass(pct, mode, isRunning, isDone)

  /* Etiquetes d'estat */
  const statusLabel = isDone
    ? 'TEMPS ACABAT!'
    : isRunning
      ? mode === MODES.countdown ? 'EN MARXA' : 'COMPTANT'
      : timeLeft === (mode === MODES.countdown ? totalSeconds : 0)
        ? 'PREPARAT'
        : 'EN PAUSA'

  const ariaTimeLabel = mode === MODES.countdown
    ? `${Math.floor(timeLeft / 60)} minuts i ${timeLeft % 60} segons restants`
    : `${Math.floor(timeLeft / 60)} minuts i ${timeLeft % 60} segons transcorreguts`

  /* Inici / pausa */
  function toggleTimer() {
    if (isDone) return
    if (timeLeft === 0 && mode === MODES.countdown) return
    const next = !isRunning
    setIsRunning(next)
    lastAnnouncedMin.current = null
    announce(next ? 'Temporitzador iniciat' : 'Temporitzador pausat')
  }

  /* Reinici */
  function resetTimer() {
    clearInterval(intervalRef.current)
    setIsRunning(false)
    setIsDone(false)
    setTimeLeft(mode === MODES.countdown ? totalSeconds : 0)
    announce('Temporitzador reiniciat')
  }

  /* Canvi de mode */
  function switchMode(newMode) {
    if (isRunning) return
    setMode(newMode)
    setIsDone(false)
    setTimeLeft(newMode === MODES.countdown ? totalSeconds : 0)
  }

  /* Ajust de minuts */
  function applyMinutes(min) {
    const v = Math.min(120, Math.max(1, min))
    setInputMinutes(v)
    if (!isRunning) {
      setTotalSeconds(v * 60)
      setTimeLeft(v * 60)
    }
  }

  /* Selecció de preset */
  function selectPreset(min) {
    applyMinutes(min)
    if (isRunning) {
      setIsRunning(false)
      clearInterval(intervalRef.current)
    }
    setIsDone(false)
  }

  const formattedTime = fmtTime(timeLeft)
  const isIdle = timeLeft === (mode === MODES.countdown ? totalSeconds : 0) && !isRunning && !isDone

  return (
    <div
      className="desk-timer-wrapper"
      role="region"
      aria-label="Temporitzador d'estudi"
    >
      {/* Anunci per a lectors de pantalla */}
      <div
        aria-live="assertive"
        aria-atomic="true"
        style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)' }}
      >
        {announcement}
      </div>

      {/* ── Cara del temporitzador ───────────────────────── */}
      <div
        className={cn('desk-timer-face', glow)}
        role="timer"
        aria-label="Temporitzador d'estudi"
      >
        <span className="timer-brand" aria-hidden="true">ClearMind</span>

        {/* Marques de tick decoratives */}
        <div className="timer-ticks" aria-hidden="true" />

        {/* Pantalla del temps */}
        <div
          className="timer-display"
          aria-live="polite"
          aria-label={ariaTimeLabel}
          aria-atomic="true"
        >
          <span className="timer-digits">{formattedTime}</span>
          <span
            className={cn(
              'timer-status',
              isDone              && 'is-done',
              !isDone && pct <= 25 && isRunning && 'is-critical',
            )}
            aria-live="polite"
            aria-atomic="true"
          >
            {statusLabel}
          </span>
        </div>

        {isIdle && (
          <span className="timer-hint" aria-hidden="true">Toca per configurar</span>
        )}
      </div>

      {/* Missatge de fi */}
      {isDone && (
        <p className="timer-done-msg" role="status" aria-live="polite">
          Sessió completada! 🎉 Bona feina.
        </p>
      )}

      {/* ── Interruptor de mode — sempre visible ─────────── */}
      <div
        role="radiogroup"
        aria-label="Mode del temporitzador"
        className={cn('timer-mode-toggle', isRunning && 'is-running')}
      >
        <button
          role="radio"
          aria-checked={mode === MODES.countdown}
          className={cn('mode-pill', mode === MODES.countdown && 'active')}
          onClick={() => switchMode(MODES.countdown)}
          aria-label="Mode temporitzador — compte enrere"
        >
          ⏱ Temporitzador
        </button>
        <button
          role="radio"
          aria-checked={mode === MODES.stopwatch}
          className={cn('mode-pill', mode === MODES.stopwatch && 'active')}
          onClick={() => switchMode(MODES.stopwatch)}
          aria-label="Mode cronòmetre — compte cap amunt"
        >
          ⏱ Cronòmetre
        </button>
      </div>

      {/* ── Presets (només mode temporitzador) ──────────── */}
      {mode === MODES.countdown && (
        <div
          className="timer-presets"
          role="group"
          aria-label="Durades predefinides"
        >
          {PRESETS.map(p => (
            <button
              key={p.value}
              className={cn('preset-pill', inputMinutes === p.value && 'active')}
              onClick={() => selectPreset(p.value)}
              aria-label={p.ariaLabel}
              aria-pressed={inputMinutes === p.value}
            >
              {p.label}
            </button>
          ))}
        </div>
      )}

      {/* ── Ajust fi de minuts ───────────────────────────── */}
      {mode === MODES.countdown && (
        <div className="timer-minutes-row" aria-label="Ajust de minuts">
          <button
            className="timer-adjust-btn"
            onClick={() => applyMinutes(inputMinutes - 5)}
            aria-label="Disminuir 5 minuts"
            disabled={inputMinutes <= 5}
          >−5</button>
          <button
            className="timer-adjust-btn"
            onClick={() => applyMinutes(inputMinutes - 1)}
            aria-label="Disminuir 1 minut"
            disabled={inputMinutes <= 1}
          >−1</button>

          <input
            type="number"
            className="timer-minutes-input"
            value={inputMinutes}
            min={1}
            max={120}
            aria-label="Minuts per al temporitzador"
            onChange={e => applyMinutes(Number(e.target.value) || 1)}
          />
          <span className="timer-minutes-label" aria-hidden="true">min</span>

          <button
            className="timer-adjust-btn"
            onClick={() => applyMinutes(inputMinutes + 1)}
            aria-label="Augmentar 1 minut"
            disabled={inputMinutes >= 120}
          >+1</button>
          <button
            className="timer-adjust-btn"
            onClick={() => applyMinutes(inputMinutes + 5)}
            aria-label="Augmentar 5 minuts"
            disabled={inputMinutes >= 120}
          >+5</button>
        </div>
      )}

      {/* ── Botons de control ────────────────────────────── */}
      <div className="timer-controls" role="group" aria-label="Controls del temporitzador">
        <button
          className={cn('timer-btn-start', isRunning && 'is-running')}
          onClick={isDone ? resetTimer : toggleTimer}
          aria-label={isDone ? 'Reiniciar temporitzador' : isRunning ? 'Pausar temporitzador' : 'Iniciar temporitzador'}
          aria-pressed={isRunning}
          disabled={!isDone && timeLeft === 0 && mode === MODES.countdown}
        >
          {isDone ? '↺ Reiniciar' : isRunning ? '⏸ Pausa' : '▶ Iniciar'}
        </button>

        {!isDone && (
          <button
            className="timer-btn-reset"
            onClick={resetTimer}
            aria-label="Reiniciar temporitzador"
          >
            ↺ Reiniciar
          </button>
        )}
      </div>
    </div>
  )
}
