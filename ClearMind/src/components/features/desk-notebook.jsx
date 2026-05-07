/* desk-notebook.jsx — Llibreta CSS + Llapis 100% CSS sobre la taula
   El llapis és decoratiu (aria-hidden) però clicable per a focus al textarea.
   Accessibilitat WCAG 2.1 AA: aria-label, textarea accessible, reduced-motion */

import { useState, useRef } from 'react'
import { cn } from '../../lib/utils'

export function DeskNotebook() {
  const [notes, setNotes]         = useState('')
  const [isExpanded, setExpanded] = useState(false)
  const textareaRef               = useRef(null)

  /* Clicar el llapis porta el focus al textarea */
  function focusNotebook() {
    setExpanded(true)
    setTimeout(() => textareaRef.current?.focus(), 50)
  }

  function handleTextareaFocus() {
    setExpanded(true)
  }

  function handleTextareaBlur() {
    if (!notes) setExpanded(false)
  }

  return (
    <div className="desk-notebook-wrapper">
      {/* ── Llibreta principal ─────────────────────────── */}
      <div
        className={cn('desk-notebook', isExpanded && 'is-expanded')}
        role="region"
        aria-label="Llibreta de notes ràpides"
      >
        {/* Enquadernació en espiral — decorativa */}
        <div className="notebook-spiral" aria-hidden="true">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="spiral-ring" />
          ))}
        </div>

        {/* Contingut de la llibreta */}
        <div className="notebook-content">
          {/* Capçalera de la llibreta */}
          <div className="notebook-header" aria-hidden="true">
            <span className="notebook-label">LLIBRETA</span>
          </div>

          {/* Línies pautades decoratives — aria-hidden */}
          <div className="notebook-lines" aria-hidden="true" />

          {/* Línia de marge vermella — aria-hidden */}
          <div className="notebook-margin" aria-hidden="true" />

          {/* Textarea de notes ràpides */}
          <textarea
            ref={textareaRef}
            className="notebook-textarea"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            onFocus={handleTextareaFocus}
            onBlur={handleTextareaBlur}
            aria-label="Escriure notes ràpides a la llibreta"
            aria-multiline="true"
            placeholder={isExpanded ? '' : 'Notes ràpides...'}
            rows={isExpanded ? 8 : 3}
            spellCheck
            lang="ca"
          />

          {/* Comptador de caràcters — visible quan expandit */}
          {isExpanded && notes.length > 0 && (
            <div
              className="notebook-char-count"
              aria-live="polite"
              aria-label={`${notes.length} caràcters escrits`}
            >
              {notes.length} car.
            </div>
          )}
        </div>
      </div>

      {/* ── Llapis CSS-only — element decoratiu/affordance ── */}
      {/* aria-hidden perquè el llapis és purament decoratiu.  */}
      {/* La seva acció (focus al textarea) és una conveniència, */}
      {/* no la única manera d'accedir al textarea.              */}
      <div
        className="css-pencil"
        aria-hidden="true"
        onClick={focusNotebook}
        title="Clicar per escriure notes"
      >
        {/* Goma d'esborrar */}
        <div className="pencil-eraser" />
        {/* Virolla metàl·lica */}
        <div className="pencil-ferrule" />
        {/* Cos del llapis */}
        <div className="pencil-body" />
        {/* Punta del llapis */}
        <div className="pencil-tip">
          <div className="pencil-graphite" />
        </div>
      </div>
    </div>
  )
}
