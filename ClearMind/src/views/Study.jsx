/* Study.jsx — Vista de la sala d'estudi
   Escriptori de fusta amb: tauler de suro, llibreta, temporitzador, ràdio
   WCAG 2.1 AA: aria-labels, role="main", aria-live, focus visible
   Accessibilitat del slider: aria-label, aria-valuenow               */

import { useState, useEffect, useRef } from 'react'
import { DeskTimer }    from '../components/features/desk-timer'
import { CorkBoard }    from '../components/features/cork-board'
import { DeskNotebook } from '../components/features/desk-notebook'
import './css/Study.css'

/* Sons ambientals disponibles */
const ambientSounds = [
  { id: 'pluja',      label: 'Pluja',      icon: '🌧', file: '/sounds/pluja.mp3'      },
  { id: 'cafeteria',  label: 'Cafeteria',  icon: '☕', file: '/sounds/cafeteria.mp3'  },
  { id: 'lofi',       label: 'Lo-Fi',      icon: '🎵', file: '/sounds/lofi.mp3'       },
]

/* Dispositiu de ràdio ambiental — component intern */
function RadioDevice({ currentSound, isPlaying, volume, onToggle, onVolume }) {
  return (
    <div
      className="radio-device"
      role="region"
      aria-label="Ràdio d'àudio ambiental"
    >
      {/* Reixeta decorativa del parlant */}
      <div className="radio-grille" aria-hidden="true" />

      {/* Etiqueta de marca — decorativa */}
      <span className="radio-brand" aria-hidden="true">AMBIENT</span>

      {/* Cos principal — botons + volum */}
      <div className="radio-body">
        {ambientSounds.map(sound => {
          const active = currentSound?.id === sound.id && isPlaying
          return (
            <button
              key={sound.id}
              className={`audio-btn${active ? ' active' : ''}`}
              onClick={() => onToggle(sound)}
              aria-pressed={active}
              aria-label={
                active
                  ? `Atura el so de ${sound.label}`
                  : `Reproduir so de ${sound.label}`
              }
            >
              {/* LED d'estat */}
              <span className="audio-led" aria-hidden="true" />
              <span aria-hidden="true">{sound.icon}</span>
              {sound.label}
            </button>
          )
        })}

        {/* Control de volum */}
        <div className="volume-row">
          <span className="volume-icon" aria-hidden="true">🔈</span>
          <input
            type="range"
            className="volume-slider"
            min={0}
            max={1}
            step={0.05}
            value={volume}
            onChange={e => onVolume(Number(e.target.value))}
            aria-label="Control de volum"
            aria-valuenow={Math.round(volume * 100)}
            aria-valuemin={0}
            aria-valuemax={100}
          />
          <span className="volume-icon" aria-hidden="true">🔊</span>
        </div>
      </div>
    </div>
  )
}

/* Component principal de la vista d'estudi */
const Study = () => {
  /* ── Estat de l'àudio ambiental ──────────────────────────── */
  const [currentSound, setCurrentSound] = useState(null)
  const [isPlaying,    setIsPlaying]    = useState(false)
  const [volume,       setVolume]       = useState(0.5)
  const audioRef = useRef(null)

  /* Sincronitza el volum amb l'element àudio */
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  /* Activa o canvia el so ambient */
  function handleToggleSound(sound) {
    /* Mateix so → pausa o reprèn */
    if (currentSound?.id === sound.id) {
      if (isPlaying) {
        audioRef.current?.pause()
        setIsPlaying(false)
      } else {
        audioRef.current?.play().catch(() => {})
        setIsPlaying(true)
      }
      return
    }

    /* So diferent → canvia la font i reprodueix */
    setCurrentSound(sound)
    setIsPlaying(true)
    /* El canvi de src dispararà l'effecte de play */
  }

  /* Quan canvia la font, inicia la reproducció */
  useEffect(() => {
    if (!currentSound || !isPlaying) return
    const el = audioRef.current
    if (!el) return
    el.load()
    el.play().catch(() => {})
  }, [currentSound])

  return (
    <main
      className="study-desk"
      role="main"
      aria-label="Sala d'estudi"
    >
      {/* Element àudio — invisible i accessible */}
      <audio
        ref={audioRef}
        src={currentSound ? currentSound.file : undefined}
        loop
        aria-hidden="true"
      />

      {/* Vinyeta decorativa d'ambient — aria-hidden */}
      <div className="study-vignette" aria-hidden="true" />

      {/* ── Disposició de tres columnes de l'escriptori ───── */}
      <div className="study-layout">

        {/* ── COLUMNA ESQUERRA: Llibreta + Ràdio ────────── */}
        <div className="study-left-col">
          <DeskNotebook />
          <RadioDevice
            currentSound={currentSound}
            isPlaying={isPlaying}
            volume={volume}
            onToggle={handleToggleSound}
            onVolume={setVolume}
          />
        </div>

        {/* ── CENTRE: Tauler de suro ─────────────────────── */}
        <CorkBoard />

        {/* ── DRETA: Temporitzador ───────────────────────── */}
        <DeskTimer />

      </div>
    </main>
  )
}

export default Study
