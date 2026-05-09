/* Study.jsx — Vista de la sala d'estudi
   Metàfora espacial: PARET (61.8vh) + TAULA (38.2vh) — ràtio àuria φ ≈ 1.618
   Paret: tauler de suro amb tasques d'avui.
   Taula: llibreta (38.2%) + temporitzador (61.8%) + ràdio ambiental.
   WCAG 2.1 AA: role="main", seccions semàntiques, focus trap al modal.          */

import { useState, useEffect, useRef } from 'react'
import { CorkBoard }                         from '../components/features/cork-board'
import { DeskTimer }                          from '../components/features/desk-timer'
import { DeskNotebook, AgendaModal }          from '../components/features/desk-notebook'
import './css/Study.css'

/* Sons ambientals disponibles */
const AMBIENT_SOUNDS = [
  { id: 'pluja',     label: 'Pluja suau',    icon: '🌧', file: '/sounds/pluja.mp3'      },
  { id: 'cafeteria', label: 'Cafeteria',      icon: '☕', file: '/sounds/cafeteria.mp3'  },
  { id: 'lofi',      label: 'Ritmes Lo-Fi',  icon: '🎵', file: '/sounds/lofi.mp3'       },
]

/* Dispositiu de ràdio ambiental — component intern */
function RadioDevice({ currentSound, isPlaying, volume, onToggle, onVolume }) {
  return (
    <div
      className="radio-device"
      role="region"
      aria-label="Ràdio d'àudio ambiental"
    >
      {/* Reixeta decorativa */}
      <div className="radio-grille" aria-hidden="true">
        <span className="radio-brand" aria-hidden="true">ClearMind-FM</span>
      </div>

      <div className="radio-body">
        {AMBIENT_SOUNDS.map(sound => {
          const active = currentSound?.id === sound.id && isPlaying
          return (
            <button
              key={sound.id}
              className={`audio-btn${active ? ' active' : ''}`}
              onClick={() => onToggle(sound)}
              aria-pressed={active}
              aria-label={active ? `Atura el so de ${sound.label}` : `Reproduir so de ${sound.label}`}
            >
              <span className="audio-led" aria-hidden="true" />
              <span aria-hidden="true">{sound.icon}</span>
              {sound.label}
            </button>
          )
        })}

        {/* Slider de volum */}
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
            aria-label="Volum ambiental"
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

/* Component principal */
const Study = () => {
  /* ── Estat del modal de l'agenda — gestionat aquí per poder-lo
     obrir tant des del corkboard (botó +) com des de la llibreta */
  const [agendaOpen,   setAgendaOpen]   = useState(false)
  const [agendaDate,   setAgendaDate]   = useState(null)

  /* ── Estat de l'àudio ambiental ─────────────────────────── */
  const [currentSound, setCurrentSound] = useState(null)
  const [isPlaying,    setIsPlaying]    = useState(false)
  const [volume,       setVolume]       = useState(0.5)
  const audioRef = useRef(null)

  /* Sincronitza el volum amb l'element àudio */
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume
  }, [volume])

  /* Quan canvia la font, inicia la reproducció */
  useEffect(() => {
    if (!currentSound || !isPlaying) return
    const el = audioRef.current
    if (!el) return
    el.load()
    el.play().catch(() => {})
  }, [currentSound])

  /* Alterna so ambiental */
  function handleToggleSound(sound) {
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
    setCurrentSound(sound)
    setIsPlaying(true)
  }

  /* Obre l'agenda des del botó + del corkboard */
  function handleAddTaskFromCorkboard() {
    setAgendaDate(new Date().toISOString().split('T')[0])
    setAgendaOpen(true)
  }

  /* Tanca el modal i torna el focus a la llibreta */
  const notebookBtnRef = useRef(null)
  function handleCloseAgenda() {
    setAgendaOpen(false)
    setTimeout(() => notebookBtnRef.current?.focus(), 50)
  }

  return (
    <main
      className="study-page"
      role="main"
      aria-label="Sala d'estudi"
    >
      {/* Element àudio — invisible */}
      <audio
        ref={audioRef}
        src={currentSound?.file}
        loop
        aria-hidden="true"
      />

      {/* ══ ZONA DE PARET (61.8vh) — Tauler de suro ════════ */}
      <section
        className="study-wall"
        aria-label="Paret de l'estudi — tauler de tasques"
      >
        <CorkBoard onAddTask={handleAddTaskFromCorkboard} />
      </section>

      {/* Modal de l'agenda setmanal — controlat des d'aquí */}
      <AgendaModal
        isOpen={agendaOpen}
        onClose={handleCloseAgenda}
        initialDate={agendaDate}
      />

      {/* ══ ZONA DE TAULA (38.2vh) — Llibreta + Timer + Ràdio */}
      <section
        className="study-desk"
        aria-label="Taula d'estudi — temporitzador i eines"
      >
        <div className="study-desk-layout">

          {/* ── Columna esquerra: Llibreta (38.2%) + Ràdio ── */}
          <div className="study-desk-left">
            <DeskNotebook onOpen={() => {
              setAgendaDate(new Date().toISOString().split('T')[0])
              setAgendaOpen(true)
            }} />
            <RadioDevice
              currentSound={currentSound}
              isPlaying={isPlaying}
              volume={volume}
              onToggle={handleToggleSound}
              onVolume={setVolume}
            />
          </div>

          {/* ── Columna dreta: Temporitzador (61.8%) ─────── */}
          <div className="study-desk-right">
            <DeskTimer />
          </div>

        </div>
      </section>
    </main>
  )
}

export default Study
