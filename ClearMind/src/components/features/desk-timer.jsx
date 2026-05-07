/* desk-timer.jsx — Temporitzador Pomodoro estil dispositiu físic sobre la taula
   Glow progressiu via --timer-glow-color i --timer-glow-intensity (CSS custom props)
   Accessibilitat WCAG 2.1 AA: aria-live, role="timer", focus visible, reduced-motion  */

import { useState, useEffect, useRef, useCallback } from 'react'
import { cn } from '../../lib/utils'

/* Modes del temporitzador */
const MODES = {
  temporitzador: 'temporitzador',
  cronòmetre:    'cronòmetre',
}

/* Durada per defecte del Pomodoro */
const DEFAULT_MINUTES = 25

/* Calcula el color i intensitat del glow en funció del percentatge restant */
function computeGlow(pct, mode, isRunning) {
  if (!isRunning) {
    return { color: 'transparent', intensity: 0, duration: '3s' }
  }
  if (mode === MODES.cronòmetre) {
    return { color: 'var(--accent-calm)', intensity: 20, duration: '3s' }
  }
  if (pct > 50) {
    return { color: 'var(--accent-warm)', intensity: 20, duration: '3s' }
  }
  if (pct > 25) {
    return { color: 'var(--accent-primary)', intensity: 30, duration: '2s' }
  }
  if (pct > 0) {
    return { color: 'var(--accent-critical)', intensity: 40, duration: '1s' }
  }
  return { color: 'transparent', intensity: 0, duration: '3s' }
}

export function DeskTimer() {
  const [mode, setMode]               = useState(MODES.temporitzador)
  const [inputMinutes, setInputMinutes] = useState(DEFAULT_MINUTES)
  const [totalSeconds, setTotalSeconds] = useState(DEFAULT_MINUTES * 60)
  const [timeLeft, setTimeLeft]       = useState(DEFAULT_MINUTES * 60)
  const [isRunning, setIsRunning]     = useState(false)
  const [isConfigOpen, setIsConfigOpen] = useState(false)
  const [announcement, setAnnouncement] = useState('')

  const intervalRef   = useRef(null)
  const startBtnRef   = useRef(null)
  const configRef     = useRef(null)

  /* Atura el temporitzador quan acaba */
  function handleTimerEnd() {
    setIsRunning(false)
    setAnnouncement('El temporitzador ha finalitzat!')
    setTimeout(() => setAnnouncement(''), 4000)
  }

  /* Lògica principal del compte enrere / cronòmetre */
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (mode === MODES.temporitzador) {
            if (prev <= 1) {
              clearInterval(intervalRef.current)
              handleTimerEnd()
              return 0
            }
            return prev - 1
          }
          /* Cronòmetre — compta cap amunt */
          return prev + 1
        })
      }, 1000)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [isRunning, mode])

  /* Format mm:ss */
  const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0')
  const seconds = (timeLeft % 60).toString().padStart(2, '0')
  const formattedTime = `${minutes}:${seconds}`

  /* Percentatge restant (per al glow) */
  const pct = mode === MODES.temporitzador && totalSeconds > 0
    ? (timeLeft / totalSeconds) * 100
    : 100

  /* Propietats del glow */
  const glow = computeGlow(pct, mode, isRunning)

  /* Etiqueta d'estat per a aria-live */
  const statusLabel =
    isRunning
      ? mode === MODES.temporitzador ? 'EN MARXA' : 'COMPTANT'
      : timeLeft === (mode === MODES.temporitzador ? totalSeconds : 0)
      ? 'PREPARAT'
      : 'EN PAUSA'

  /* Text llegible per a SR */
  const ariaTimeLabel =
    mode === MODES.temporitzador
      ? `${minutes} minuts i ${seconds} segons restants`
      : `${minutes} minuts i ${seconds} segons transcorreguts`

  /* Inici / pausa */
  function toggleTimer() {
    if (timeLeft === 0 && mode === MODES.temporitzador) return
    const next = !isRunning
    setIsRunning(next)
    setAnnouncement(next ? 'Temporitzador iniciat' : 'Temporitzador pausat')
    setTimeout(() => setAnnouncement(''), 2000)
    if (isConfigOpen) setIsConfigOpen(false)
  }

  /* Reinici */
  function resetTimer() {
    setIsRunning(false)
    setTimeLeft(mode === MODES.temporitzador ? totalSeconds : 0)
    setAnnouncement('Temporitzador reiniciat')
    setTimeout(() => setAnnouncement(''), 2000)
  }

  /* Canvi de mode */
  function switchMode(newMode) {
    setIsRunning(false)
    setMode(newMode)
    if (newMode === MODES.temporitzador) {
      setTimeLeft(totalSeconds)
    } else {
      setTimeLeft(0)
    }
  }

  /* Ajust de minuts via botons +/- */
  function adjustMinutes(delta) {
    const next = Math.min(120, Math.max(1, inputMinutes + delta))
    setInputMinutes(next)
    if (!isRunning) {
      setTotalSeconds(next * 60)
      setTimeLeft(next * 60)
    }
  }

  /* Inici des del panell de configuració */
  function startFromConfig() {
    setTotalSeconds(inputMinutes * 60)
    setTimeLeft(inputMinutes * 60)
    setIsRunning(true)
    setIsConfigOpen(false)
    setAnnouncement(`Temporitzador de ${inputMinutes} minuts iniciat`)
    setTimeout(() => setAnnouncement(''), 2000)
  }

  /* Tanca el panell de configuració amb Escape */
  useEffect(() => {
    if (!isConfigOpen) return
    function handleKey(e) {
      if (e.key === 'Escape') {
        setIsConfigOpen(false)
        startBtnRef.current?.focus()
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isConfigOpen])

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
        className="sr-only"
        style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)' }}
      >
        {announcement}
      </div>

      {/* ── Cara del temporitzador ─────────────────────── */}
      <div
        className={cn('desk-timer-face', isRunning && 'is-running')}
        role="timer"
        aria-label="Temporitzador d'estudi"
        style={{
          '--timer-glow-color':          glow.color,
          '--timer-glow-intensity':      String(glow.intensity),
          '--timer-glow-pulse-duration': glow.duration,
        }}
      >
        {/* Marca de marca — decorativa */}
        <span className="timer-brand" aria-hidden="true">ClearMind</span>

        {/* Marcadors de tick — decoratius */}
        <div className="timer-ticks" aria-hidden="true" />

        {/* Display principal del temps */}
        <div
          className="timer-display"
          aria-live="polite"
          aria-label={ariaTimeLabel}
          aria-atomic="true"
        >
          <span className="timer-digits">{formattedTime}</span>
          <span
            className="timer-status"
            aria-live="polite"
            aria-atomic="true"
          >
            {statusLabel}
          </span>
        </div>

        {/* Pista quan el timer no ha iniciat */}
        {!isRunning && timeLeft === (mode === MODES.temporitzador ? totalSeconds : 0) && (
          <span className="timer-hint" role="note">
            Toca per configurar
          </span>
        )}
      </div>

      {/* ── Botons de control principals ──────────────── */}
      <div className="timer-controls" role="group" aria-label="Controls del temporitzador">
        <button
          ref={startBtnRef}
          className={cn('timer-btn-primary', isRunning && 'is-active')}
          onClick={toggleTimer}
          aria-label="Iniciar o pausar el temporitzador"
          aria-pressed={isRunning}
          disabled={timeLeft === 0 && mode === MODES.temporitzador}
        >
          {isRunning ? '⏸ Pausa' : '▶ Iniciar'}
        </button>

        <button
          className="timer-btn-secondary"
          onClick={resetTimer}
          aria-label="Reiniciar el temporitzador"
        >
          ↺ Reiniciar
        </button>

        {/* Botó de configuració — obre el panell */}
        <button
          className="timer-btn-config"
          onClick={() => setIsConfigOpen(o => !o)}
          aria-label={isConfigOpen ? 'Tancar configuració del temporitzador' : 'Obrir configuració del temporitzador'}
          aria-expanded={isConfigOpen}
          aria-controls="timer-config-panel"
        >
          ⚙
        </button>
      </div>

      {/* ── Panell de configuració (amb transició max-height) ── */}
      <div
        id="timer-config-panel"
        ref={configRef}
        className={cn('timer-config-panel', isConfigOpen && 'is-open')}
        role="group"
        aria-label="Configuració del temporitzador"
        aria-hidden={!isConfigOpen}
        /* inert quan tancat — accessible amb CSS display:none no permetria focus */
        {...(!isConfigOpen && { inert: '' })}
      >
        {/* Toggle de mode — radiogroup */}
        <div
          role="radiogroup"
          aria-label="Mode del temporitzador"
          className="timer-mode-toggle"
        >
          <button
            role="radio"
            aria-checked={mode === MODES.temporitzador}
            className={cn('mode-pill', mode === MODES.temporitzador && 'active')}
            onClick={() => switchMode(MODES.temporitzador)}
          >
            Temporitzador
          </button>
          <button
            role="radio"
            aria-checked={mode === MODES.cronòmetre}
            className={cn('mode-pill', mode === MODES.cronòmetre && 'active')}
            onClick={() => switchMode(MODES.cronòmetre)}
          >
            Cronòmetre
          </button>
        </div>

        {/* Ajust de minuts (només mode temporitzador) */}
        {mode === MODES.temporitzador && (
          <div className="timer-minutes-row" aria-label="Ajust de minuts">
            <button
              className="timer-adjust-btn"
              onClick={() => adjustMinutes(-5)}
              aria-label="Disminuir 5 minuts"
              disabled={inputMinutes <= 1}
            >
              −5
            </button>
            <button
              className="timer-adjust-btn"
              onClick={() => adjustMinutes(-1)}
              aria-label="Disminuir 1 minut"
              disabled={inputMinutes <= 1}
            >
              −1
            </button>

            <input
              type="number"
              className="timer-minutes-input"
              value={inputMinutes}
              min={1}
              max={120}
              aria-label="Minuts per al temporitzador"
              onChange={e => {
                const v = Math.min(120, Math.max(1, Number(e.target.value) || 1))
                setInputMinutes(v)
                if (!isRunning) {
                  setTotalSeconds(v * 60)
                  setTimeLeft(v * 60)
                }
              }}
            />
            <span className="timer-minutes-label" aria-hidden="true">min</span>

            <button
              className="timer-adjust-btn"
              onClick={() => adjustMinutes(1)}
              aria-label="Augmentar 1 minut"
              disabled={inputMinutes >= 120}
            >
              +1
            </button>
            <button
              className="timer-adjust-btn"
              onClick={() => adjustMinutes(5)}
              aria-label="Augmentar 5 minuts"
              disabled={inputMinutes >= 120}
            >
              +5
            </button>
          </div>
        )}

        <button
          className="timer-start-btn"
          onClick={startFromConfig}
          aria-label={
            mode === MODES.temporitzador
              ? `Iniciar temporitzador de ${inputMinutes} minuts`
              : 'Iniciar el cronòmetre'
          }
        >
          Començar
        </button>
      </div>
    </div>
  )
}
