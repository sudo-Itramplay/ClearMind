/* desk-notebook.jsx — Llibreta tancada sobre la taula + modal Agenda Setmanal
   Clic a la llibreta obre el modal d'agenda (7 pestanyes de dia, afegir tasques).
   Focus trap al modal. Escape per tancar. Retorna el focus a la llibreta.
   WCAG 2.1 AA: role="dialog", aria-modal, aria-labelledby, focus trap.          */

import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { useTodos } from '../../context/TodoContext'
import { cn } from '../../lib/utils'

/* Noms de dia i mes en català */
const CAT_DAYS_SHORT  = ['Dg','Dl','Dm','Dc','Dj','Dv','Ds']
const CAT_DAYS_LONG   = ['Diumenge','Dilluns','Dimarts','Dimecres','Dijous','Divendres','Dissabte']
const CAT_MONTHS_SHORT = ['gen','feb','mar','abr','mai','jun','jul','ago','set','oct','nov','des']
const CAT_MONTHS_LONG  = ['gener','febrer','març','abril','maig','juny','juliol','agost','setembre','octubre','novembre','desembre']

function addDays(date, n) {
  const d = new Date(date)
  d.setDate(d.getDate() + n)
  return d
}

function toISO(date) {
  return date.toISOString().split('T')[0]
}

/* Hook de focus trap per a modals */
function useFocusTrap(isOpen, containerRef, onClose) {
  useEffect(() => {
    if (!isOpen || !containerRef.current) return
    const FOCUSABLE = 'button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])'
    const els   = Array.from(containerRef.current.querySelectorAll(FOCUSABLE))
    const first = els[0]
    const last  = els[els.length - 1]
    first?.focus()

    function trap(e) {
      if (e.key === 'Escape') { e.preventDefault(); onClose(); return }
      if (e.key !== 'Tab')    return
      if (els.length === 0)   { e.preventDefault(); return }
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last?.focus() }
      } else {
        if (document.activeElement === last)  { e.preventDefault(); first?.focus() }
      }
    }

    document.addEventListener('keydown', trap)
    return () => document.removeEventListener('keydown', trap)
  }, [isOpen, containerRef, onClose])
}

/* ── Modal de l'agenda setmanal ─────────────────────────────── */
export function AgendaModal({ isOpen, onClose, initialDate }) {
  const { todos, addTodo, toggleTodo } = useTodos()
  const today      = new Date()
  today.setHours(0, 0, 0, 0)

  /* 7 dies a partir del dilluns de la setmana actual */
  const weekDays = useMemo(() => {
    const mon = new Date(today)
    const dow  = today.getDay() === 0 ? 6 : today.getDay() - 1 /* Dilluns = 0 */
    mon.setDate(today.getDate() - dow)
    return Array.from({ length: 7 }, (_, i) => addDays(mon, i))
  }, [])

  /* Dia seleccionat per defecte: avui (o initialDate si ve del botó + del corkboard) */
  const defaultISO = initialDate || toISO(today)
  const [selectedISO, setSelectedISO] = useState(defaultISO)
  const [newTask,     setNewTask]      = useState('')
  const [newDate,     setNewDate]      = useState(defaultISO)

  const modalRef = useRef(null)

  const handleClose = useCallback(() => {
    setNewTask('')
    onClose()
  }, [onClose])

  useFocusTrap(isOpen, modalRef, handleClose)

  /* Tasques del dia seleccionat */
  const dayTasks = useMemo(
    () => todos.filter(t => t.date === selectedISO),
    [todos, selectedISO],
  )

  const pendingCount = useMemo(
    () => todos.filter(t => !t.completed).length,
    [todos],
  )

  /* Afegir tasca nova */
  function handleAdd(e) {
    e.preventDefault()
    const trimmed = newTask.trim()
    if (!trimmed) return
    addTodo({ task: trimmed, date: newDate, description: '' })
    setNewTask('')
  }

  if (!isOpen) return null

  return (
    <div
      role="presentation"
      className="modal-backdrop"
      onClick={handleClose}
      aria-hidden="true"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="agenda-title"
        ref={modalRef}
        className="agenda-modal"
        onClick={e => e.stopPropagation()}
      >
        {/* Botó de tancar */}
        <button
          className="agenda-btn-close"
          onClick={handleClose}
          aria-label="Tancar l'agenda setmanal"
        >
          ×
        </button>

        <h2 id="agenda-title" className="agenda-title">
          Agenda Setmanal
        </h2>

        {/* Pestanyes de dia */}
        <div
          role="tablist"
          aria-label="Dies de la setmana"
          className="day-tabs"
        >
          {weekDays.map(d => {
            const iso      = toISO(d)
            const active   = iso === selectedISO
            const isToday  = iso === toISO(today)
            const hasTasks = todos.some(t => t.date === iso && !t.completed)
            return (
              <button
                key={iso}
                role="tab"
                aria-selected={active}
                aria-controls="agenda-panel"
                className={cn('day-tab', active && 'active', hasTasks && 'has-tasks')}
                onClick={() => { setSelectedISO(iso); setNewDate(iso) }}
                aria-label={`${CAT_DAYS_LONG[d.getDay()]} ${d.getDate()} de ${CAT_MONTHS_LONG[d.getMonth()]}${isToday ? ' — avui' : ''}`}
              >
                {CAT_DAYS_SHORT[d.getDay()]}
                <br />
                <span style={{ fontSize: '0.7rem', opacity: 0.8 }}>{d.getDate()}</span>
              </button>
            )
          })}
        </div>

        <div className="day-tabs-border" aria-hidden="true" />

        {/* Panell de tasques del dia */}
        <div
          id="agenda-panel"
          role="tabpanel"
          aria-label={`Tasques del dia seleccionat`}
        >
          {dayTasks.length === 0 ? (
            <p className="agenda-empty">Cap tasca per aquest dia 📭</p>
          ) : (
            <ul className="agenda-task-list" aria-label="Llista de tasques del dia">
              {dayTasks.map(t => (
                <li key={t.id} className="agenda-task-item">
                  <button
                    className={cn('agenda-task-check', t.completed && 'checked')}
                    role="checkbox"
                    aria-checked={t.completed}
                    aria-label={`Marcar ${t.completed ? 'pendent' : 'completada'}: ${t.task}`}
                    onClick={() => toggleTodo(t.id)}
                  >
                    {t.completed && <span style={{ color: '#fff', fontSize: '0.6rem', fontWeight: 700 }}>✓</span>}
                  </button>
                  <span className={cn('agenda-task-text', t.completed && 'done')}>
                    {t.task}
                  </span>
                  <span className="agenda-task-date" aria-hidden="true">
                    {t.date.slice(8)} {CAT_MONTHS_SHORT[new Date(t.date).getMonth()]}
                  </span>
                </li>
              ))}
            </ul>
          )}

          {/* Formulari d'afegir tasca */}
          <form
            className="agenda-add-form"
            onSubmit={handleAdd}
            noValidate
            aria-label="Afegir nova tasca"
          >
            <input
              type="text"
              className="agenda-input"
              value={newTask}
              onChange={e => setNewTask(e.target.value)}
              placeholder="Què has de fer?"
              aria-label="Títol de la nova tasca"
              maxLength={120}
            />
            <div className="agenda-form-row">
              <input
                type="date"
                className="agenda-date-input"
                value={newDate}
                onChange={e => setNewDate(e.target.value)}
                aria-label="Data de la tasca"
              />
              <button
                type="submit"
                className="agenda-btn-add"
                aria-label="Afegir la tasca a l'agenda"
                disabled={!newTask.trim()}
              >
                Afegir
              </button>
            </div>
          </form>

          <p className="agenda-count" aria-live="polite">
            {pendingCount} {pendingCount === 1 ? 'tasca pendent' : 'tasques pendents'} aquesta setmana
          </p>
        </div>
      </div>
    </div>
  )
}

/* ── Llibreta tancada + llapis CSS ─────────────────────────── */
export function DeskNotebook({ onOpen }) {
  const { todos } = useTodos()
  const notebookRef = useRef(null)

  /* Recompte de tasques pendents per a la vista prèvia */
  const pendingCount = useMemo(
    () => todos.filter(t => !t.completed).length,
    [todos],
  )

  function handleKeyDown(e) {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault()
      onOpen?.()
    }
  }

  return (
    <div className="desk-notebook-wrapper">
      {/* Llibreta tancada — botó interactiu */}
      <button
        ref={notebookRef}
        className="desk-notebook"
        onClick={onOpen}
        onKeyDown={handleKeyDown}
        aria-label="Obrir agenda setmanal i afegir tasques"
        aria-haspopup="dialog"
        style={{ '--rotation': '0deg' }}
      >
        {/* Espiral de la llibreta */}
        <div className="notebook-spiral" aria-hidden="true">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="spiral-ring" />
          ))}
        </div>

        {/* Línies pautades */}
        <div className="notebook-lines"  aria-hidden="true" />
        {/* Línia de marge */}
        <div className="notebook-margin" aria-hidden="true" />

        {/* Contingut visible */}
        <div className="notebook-header" aria-hidden="true">
          <span className="notebook-label">LLIBRETA</span>
          <span className="notebook-subtitle">La teva agenda setmanal</span>
        </div>

        <p className="notebook-preview" aria-hidden="true">
          {pendingCount > 0
            ? `${pendingCount} ${pendingCount === 1 ? 'tasca pendent' : 'tasques pendents'} aquesta setmana`
            : 'Tot al dia! ✨'}
        </p>
      </button>

      {/* Llapis CSS — decoratiu, aria-hidden */}
      {/* Llapis CSS purament decoratiu — la llibreta és el focus interactiu */}
      <div
        className="css-pencil"
        aria-hidden="true"
        onClick={onOpen}
      >
        <div className="pencil-eraser"  />
        <div className="pencil-ferrule" />
        <div className="pencil-body"    />
        <div className="pencil-tip">
          <div className="pencil-graphite" />
        </div>
      </div>
    </div>
  )
}

/* ── Component contenidor amb estat del modal ──────────────── */
export function DeskNotebookWithModal({ initialOpen = false, openOnDate }) {
  const [isOpen, setIsOpen]   = useState(initialOpen)
  const triggerRef            = useRef(null)

  function openModal()  { setIsOpen(true) }
  function closeModal() {
    setIsOpen(false)
    /* Retorna el focus a la llibreta quan es tanca el modal */
    setTimeout(() => triggerRef.current?.querySelector('.desk-notebook')?.focus(), 50)
  }

  return (
    <div ref={triggerRef}>
      <DeskNotebook onOpen={openModal} />
      <AgendaModal
        isOpen={isOpen}
        onClose={closeModal}
        initialDate={openOnDate}
      />
    </div>
  )
}
