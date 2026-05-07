/* cork-board.jsx — Tauler de suro amb notes adhesives (post-its)
   Integrat amb TodoContext. Accessibilitat WCAG 2.1 AA completa.
   Modal amb focus trap. Nth-child colors deterministes.           */

import { useState, useRef, useEffect, useCallback } from 'react'
import { useTodos } from '../../context/TodoContext'
import { cn } from '../../lib/utils'

/* Colors de les notes adhesives — cicle de 4 via nth-child en CSS */
/* La rotació i el color es gestionen des de Study.css             */

/* Hook de focus trap per a modals accessibles */
function useFocusTrap(isOpen, containerRef, onClose) {
  useEffect(() => {
    if (!isOpen || !containerRef.current) return

    const FOCUSABLE = [
      'button', '[href]', 'input', 'select',
      'textarea', '[tabindex]:not([tabindex="-1"])',
    ].join(',')

    const els   = Array.from(containerRef.current.querySelectorAll(FOCUSABLE))
    const first = els[0]
    const last  = els[els.length - 1]

    /* Porta el focus al primer element del modal */
    first?.focus()

    function trap(e) {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }
      if (e.key !== 'Tab') return
      if (els.length === 0) { e.preventDefault(); return }
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last?.focus()
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault()
          first?.focus()
        }
      }
    }

    document.addEventListener('keydown', trap)
    return () => document.removeEventListener('keydown', trap)
  }, [isOpen, containerRef, onClose])
}

/* Nota adhesiva individual */
function PostItNote({ todo, onToggle, index }) {
  function handleKeyDown(e) {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault()
      onToggle(todo.id)
    }
  }

  return (
    <div
      className={cn(
        'postit-note',
        todo.completed && 'postit-completed',
        `postit-${((index % 4) + 1)}`, /* Classe de color determinista */
      )}
      role="checkbox"
      aria-checked={todo.completed}
      aria-label={`Tasca: ${todo.task}${todo.completed ? ' — completada' : ''}`}
      tabIndex={0}
      onClick={() => onToggle(todo.id)}
      onKeyDown={handleKeyDown}
    >
      {/* Cinta adhesiva decorativa */}
      <span className="postit-tape" aria-hidden="true" />

      {/* Casella de verificació visual */}
      <span
        className={cn('postit-checkbox', todo.completed && 'postit-checkbox-checked')}
        aria-hidden="true"
        role="presentation"
      >
        {todo.completed && <span className="postit-checkmark">✓</span>}
      </span>

      {/* Text de la tasca */}
      <span className="postit-text">{todo.task}</span>

      {/* Descripció opcional */}
      {todo.description && (
        <span className="postit-desc">{todo.description}</span>
      )}
    </div>
  )
}

/* Modal d'afegir nova tasca — amb focus trap i estil de quadern */
function AddTaskModal({ isOpen, onClose, onAdd }) {
  const [taskText, setTaskText] = useState('')
  const [taskDesc, setTaskDesc] = useState('')
  const [error,    setError]    = useState('')
  const modalRef  = useRef(null)
  const triggerEl = useRef(null) /* Guardat per retornar focus en tancar */

  const handleClose = useCallback(() => {
    setTaskText('')
    setTaskDesc('')
    setError('')
    onClose()
  }, [onClose])

  useFocusTrap(isOpen, modalRef, handleClose)

  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = taskText.trim()
    if (!trimmed) {
      setError('El títol de la tasca no pot estar buit.')
      return
    }
    onAdd({ task: trimmed, description: taskDesc.trim() })
    handleClose()
  }

  if (!isOpen) return null

  return (
    /* Teló de fons — no accessible per a lectors de pantalla */
    <div
      role="presentation"
      className="modal-backdrop"
      onClick={handleClose}
      aria-hidden="true"
    >
      {/* Diàleg real del modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title-add"
        ref={modalRef}
        className="task-modal"
        onClick={e => e.stopPropagation()}
      >
        {/* Línies pautades decoratives del quadern */}
        <div className="modal-notebook-lines" aria-hidden="true" />
        <div className="modal-margin-line"    aria-hidden="true" />

        {/* Títol del modal — referenciat per aria-labelledby */}
        <h2 id="modal-title-add" className="modal-title">
          Nova Tasca
        </h2>

        <form onSubmit={handleSubmit} noValidate>
          {/* Camp de títol */}
          <div className="modal-field">
            <label htmlFor="task-title-input" className="modal-label">
              Títol <span aria-hidden="true">*</span>
            </label>
            <input
              id="task-title-input"
              type="text"
              className="modal-input"
              value={taskText}
              onChange={e => { setTaskText(e.target.value); setError('') }}
              aria-required="true"
              aria-describedby={error ? 'task-title-error' : undefined}
              aria-invalid={!!error}
              placeholder="Què vols fer?"
              maxLength={120}
            />
            {error && (
              <span
                id="task-title-error"
                role="alert"
                className="modal-error"
              >
                {error}
              </span>
            )}
          </div>

          {/* Camp de descripció opcional */}
          <div className="modal-field">
            <label htmlFor="task-desc-input" className="modal-label">
              Descripció (opcional)
            </label>
            <textarea
              id="task-desc-input"
              className="modal-textarea"
              value={taskDesc}
              onChange={e => setTaskDesc(e.target.value)}
              placeholder="Detalls addicionals..."
              rows={3}
              maxLength={300}
              lang="ca"
            />
          </div>

          {/* Botons d'acció */}
          <div className="modal-actions">
            <button
              type="button"
              className="modal-btn-cancel"
              onClick={handleClose}
              aria-label="Cancel·lar i tancar el diàleg"
            >
              Cancel·lar
            </button>
            <button
              type="submit"
              className="modal-btn-submit"
              aria-label="Afegir la nova tasca al tauler"
            >
              Afegir
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

/* Component principal: tauler de suro */
export function CorkBoard() {
  const { todos, addTodo, toggleTodo, isLoading } = useTodos()
  const [modalOpen, setModalOpen]                 = useState(false)
  const addBtnRef                                 = useRef(null)

  /* Retorna el focus al botó d'afegir quan es tanca el modal */
  function handleCloseModal() {
    setModalOpen(false)
    setTimeout(() => addBtnRef.current?.focus(), 50)
  }

  function handleAddTodo({ task, description }) {
    addTodo({ id: Date.now(), task, description, completed: false })
  }

  /* Ordena: pendents primer, completades al final */
  const sortedTodos = [
    ...todos.filter(t => !t.completed),
    ...todos.filter(t =>  t.completed),
  ]

  const completedCount = todos.filter(t => t.completed).length
  const totalCount     = todos.length

  return (
    <div
      className="corkboard-wrapper"
      role="region"
      aria-label="Tauler de tasques"
    >
      {/* Capçalera del tauler */}
      <div className="corkboard-header">
        <h2 className="corkboard-title">Tasques</h2>

        {/* Resum de progrés */}
        <div
          className="corkboard-progress"
          aria-label={`${completedCount} de ${totalCount} tasques completades`}
        >
          <span className="corkboard-count">
            {completedCount}/{totalCount}
          </span>
          {/* Barra de progrés mini */}
          <div
            className="corkboard-progress-bar"
            role="progressbar"
            aria-valuenow={totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Progrés de les tasques"
          >
            <div
              className="corkboard-progress-fill"
              style={{
                width: totalCount > 0
                  ? `${(completedCount / totalCount) * 100}%`
                  : '0%',
              }}
            />
          </div>
        </div>
      </div>

      {/* Superfície del tauler de suro */}
      <div
        className="corkboard-surface"
        aria-label={`Tauler amb ${sortedTodos.length} tasques`}
      >
        {/* Textura de suro decorativa */}
        <div className="corkboard-texture" aria-hidden="true" />

        {/* Estat de càrrega */}
        {isLoading && (
          <p
            role="status"
            aria-live="polite"
            className="corkboard-loading"
          >
            Carregant tasques…
          </p>
        )}

        {/* Estat buit */}
        {!isLoading && sortedTodos.length === 0 && (
          <p
            role="status"
            aria-live="polite"
            className="corkboard-empty"
          >
            Cap tasca al tauler. Afegeix-ne una! 📌
          </p>
        )}

        {/* Notes adhesives */}
        <div
          className="postits-grid"
          role="list"
          aria-label="Llista de tasques com a notes adhesives"
        >
          {sortedTodos.map((todo, i) => (
            <div key={todo.id} role="listitem">
              <PostItNote
                todo={todo}
                onToggle={toggleTodo}
                index={i}
              />
            </div>
          ))}

          {/* Post-it d'afegir nova tasca */}
          <div role="listitem">
            <button
              ref={addBtnRef}
              className="postit-add"
              onClick={() => setModalOpen(true)}
              aria-label="Afegir nova tasca al tauler"
              aria-haspopup="dialog"
            >
              <span className="postit-add-icon" aria-hidden="true">+</span>
              <span className="postit-add-text">Nova tasca</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal d'afegir tasca */}
      <AddTaskModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onAdd={handleAddTodo}
      />
    </div>
  )
}
