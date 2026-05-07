/* Relax.jsx — Vista de Meditació i Relaxació
   WCAG 2.1 AA: aria-live, role="button", aria-pressed, focus visible
   Estètica: càlida, cercle de respiració animat, consells       */

import { useState, useEffect, useRef } from 'react'
import './css/Relax.css'

/* Guies de meditació disponibles */
const meditationGuides = [
  {
    id: 'm1',
    title: 'Respiració Conscient',
    ariaLabel: "Iniciar meditació: Respiració Conscient — 5 minuts",
    description: '5 minuts de respiració guiada per calmar la ment.',
    steps: [
      "Seu amb l'esquena recta.",
      'Inspira pel nas (4s).',
      "Mantén l'aire (2s).",
      'Expira per la boca (6s).',
      'Repeteix el cicle.',
    ],
  },
  {
    id: 'm2',
    title: 'Escaneig Corporal',
    ariaLabel: 'Iniciar meditació: Escaneig Corporal — 10 minuts',
    description: '10 minuts per relaxar cada zona del cos.',
    steps: [
      'Tanca els ulls.',
      'Porta l\'atenció als peus.',
      'Puja gradualment per les cames.',
      'Relaxa abdomen i pit.',
      'Relaxa espatlles i cara.',
    ],
  },
  {
    id: 'm3',
    title: 'Visualització',
    ariaLabel: 'Iniciar meditació: Visualització — 8 minuts',
    description: '8 minuts per recuperar la calma.',
    steps: [
      'Imagina un lloc segur.',
      "Afegeix-hi sons i colors.",
      "Sent-te protegit.",
      'Allibera preocupacions.',
      'Torna suaument al present.',
    ],
  },
]

/* Consells de benestar */
const wellnessTips = [
  'Redueix les distraccions del voltant.',
  'Troba un lloc còmode per a la teva pràctica.',
  "No et jutgis si et distreus — és normal.",
  'Torna suaument a la respiració quan et perdis.',
]

const Relax = () => {
  const [selectedGuide, setSelectedGuide] = useState(null)
  const [isBreathing,   setIsBreathing]   = useState(false)
  const [breathStage,   setBreathStage]   = useState('Inspirar')

  /* Ref per retornar el focus al cercle quan es para */
  const circleRef = useRef(null)

  /* Lògica de la respiració guiada — cicle de 3 fases */
  useEffect(() => {
    let timer
    if (isBreathing) {
      if (breathStage === 'Inspirar') {
        timer = setTimeout(() => setBreathStage('Mantenir'), 4000)
      } else if (breathStage === 'Mantenir') {
        timer = setTimeout(() => setBreathStage('Expirar'), 2000)
      } else {
        /* Expirar — torna a inspirar */
        timer = setTimeout(() => setBreathStage('Inspirar'), 6000)
      }
    }
    return () => clearTimeout(timer)
  }, [isBreathing, breathStage])

  /* Activa / desactiva el cicle de respiració */
  function handleBreathingToggle() {
    setIsBreathing(prev => !prev)
    setBreathStage('Inspirar')
  }

  /* Suport de teclat per al cercle de respiració */
  function handleCircleKeyDown(e) {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault()
      handleBreathingToggle()
    }
  }

  /* Nom llegible de la fase actual per a aria-live */
  const breathStageReadable = {
    Inspirar: 'Inspirar — 4 segons',
    Mantenir: "Mantenir l'aire — 2 segons",
    Expirar:  'Expirar — 6 segons',
  }[breathStage] ?? breathStage

  return (
    <div
      className="relax-container"
      role="main"
      aria-label="Sala de meditació i relaxació"
    >
      <section
        className="relax-layout"
        aria-label="Contingut de la sala de relaxació"
      >

        {/* ── COLUMNA ESQUERRA: Guies de meditació ─────── */}
        <div
          className="relax-panel guides-panel"
          role="region"
          aria-label="Guies de meditació"
        >
          <div className="panel-header">
            <h2>Guies</h2>
          </div>

          <div className="guides-list-container">
            {meditationGuides.map(guide => (
              <button
                key={guide.id}
                className={`guide-btn ${selectedGuide?.id === guide.id ? 'active' : ''}`}
                aria-label={guide.ariaLabel}
                aria-pressed={selectedGuide?.id === guide.id}
                onClick={() =>
                  setSelectedGuide(prev =>
                    prev?.id === guide.id ? null : guide
                  )
                }
              >
                {guide.title}
              </button>
            ))}
          </div>

          {/* Detalls de la guia seleccionada */}
          {selectedGuide && (
            <div
              className="guide-details-box"
              role="region"
              aria-label={`Passos de ${selectedGuide.title}`}
              aria-live="polite"
            >
              <h3>{selectedGuide.title}</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', marginBottom: '10px' }}>
                {selectedGuide.description}
              </p>
              <ol aria-label={`Instruccions: ${selectedGuide.title}`}>
                {selectedGuide.steps.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            </div>
          )}
        </div>

        {/* ── CENTRE: Cercle de respiració animat ─────── */}
        <div
          className="relax-center"
          role="region"
          aria-label="Exercici de respiració guiada"
        >
          {/* Cercle interactiu — inicia / atura la respiració */}
          <div
            ref={circleRef}
            className={`breathing-circle ${isBreathing ? breathStage.toLowerCase() : ''}`}
            role="button"
            tabIndex={0}
            aria-label={
              isBreathing
                ? `Atura la respiració guiada. Fase actual: ${breathStageReadable}`
                : 'Cercle de respiració. Clica per començar.'
            }
            aria-pressed={isBreathing}
            onClick={handleBreathingToggle}
            onKeyDown={handleCircleKeyDown}
          >
            {/* Fase de respiració — anunciada per screen readers */}
            <span
              className="breath-text"
              aria-live="polite"
              aria-atomic="true"
            >
              {isBreathing ? breathStage : 'COMENÇAR'}
            </span>

            {/* Durada de la fase — info visual i auditiva */}
            {isBreathing && (
              <span
                style={{
                  fontSize: '0.65rem',
                  color: 'currentColor',
                  opacity: 0.7,
                  letterSpacing: '2px',
                  marginTop: '4px',
                  fontFamily: 'monospace',
                }}
                aria-hidden="true" /* aria-live ja ho cobreix */
              >
                {breathStage === 'Inspirar' ? '4s' : breathStage === 'Mantenir' ? '2s' : '6s'}
              </span>
            )}
          </div>

          {/* Pista textual sota el cercle */}
          <p className="relax-hint" role="note">
            {isBreathing
              ? 'Segueix el ritme suau del cercle'
              : 'Prem el cercle per iniciar la respiració guiada'}
          </p>
        </div>

        {/* ── COLUMNA DRETA: Consells de benestar ─────── */}
        <div
          className="relax-panel tips-panel"
          role="region"
          aria-label="Consells de benestar"
        >
          <div className="panel-header">
            <h2>Recorda</h2>
          </div>

          <div className="tips-content">
            {wellnessTips.map((tip, i) => (
              <div
                key={i}
                className="tip-card"
                role="note"
                aria-label={`Consell ${i + 1}: ${tip}`}
              >
                {tip}
              </div>
            ))}
          </div>
        </div>

      </section>
    </div>
  )
}

export default Relax
