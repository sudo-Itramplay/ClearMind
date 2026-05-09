/* cork-board.jsx — Tauler de suro amb post-its per a les tasques d'avui
   Filtra el TodoContext per la data d'avui.
   WCAG 2.1 AA: role="checkbox", aria-checked, focus trap al modal extern.
   Animació de flotació per a tasques pendents (postit-float de globals.css). */

import { useMemo } from 'react'
import { useTodos } from '../../context/TodoContext'
import { cn } from '../../lib/utils'

/* Format de data llegible per a l'usuari (catalan) */
const CAT_DAYS  = ['Diumenge','Dilluns','Dimarts','Dimecres','Dijous','Divendres','Dissabte']
const CAT_MONTHS = ['gener','febrer','març','abril','maig','juny','juliol','agost','setembre','octubre','novembre','desembre']

function formatDateLabel(date) {
  return `${CAT_DAYS[date.getDay()]} ${date.getDate()} de ${CAT_MONTHS[date.getMonth()]}`
}

function todayISO() {
  return new Date().toISOString().split('T')[0]
}

/* Nota adhesiva individual */
function PostItNote({ todo, onToggle, index }) {
  const colorIndex = (index % 4) + 1

  function handleKeyDown(e) {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault()
      onToggle(todo.id)
    }
  }

  return (
    <button
      className={cn(
        'postit-note',
        todo.completed && 'postit-completed',
      )}
      style={{ '--rotation': [2, -2.5, 1.5, -1.8][index % 4] + 'deg' }}
      role="checkbox"
      aria-checked={todo.completed}
      aria-label={`Tasca: ${todo.task}. ${todo.completed ? 'Completada' : 'Pendent'}.`}
      tabIndex={0}
      onClick={() => onToggle(todo.id)}
      onKeyDown={handleKeyDown}
    >
      {/* Cinta adhesiva decorativa */}
      <span className="postit-tape" aria-hidden="true" />

      {/* Casella visual */}
      <span
        className={cn('postit-checkbox', todo.completed && 'postit-checkbox-checked')}
        aria-hidden="true"
      >
        {todo.completed && <span className="postit-checkmark">✓</span>}
      </span>

      {/* Text de la tasca */}
      <span className="postit-text">{todo.task}</span>

      {todo.description && (
        <span className="postit-desc">{todo.description}</span>
      )}
    </button>
  )
}

/* Component principal del tauler */
export function CorkBoard({ onAddTask }) {
  const { todos, toggleTodo, isLoading } = useTodos()
  const today = todayISO()
  const now   = new Date()

  /* Tasques d'avui: pendents primer, completades al final */
  const todayTodos = useMemo(() => {
    const todays = todos.filter(t => t.date === today)
    return [
      ...todays.filter(t => !t.completed),
      ...todays.filter(t =>  t.completed),
    ]
  }, [todos, today])

  const completedCount = todayTodos.filter(t => t.completed).length
  const totalCount     = todayTodos.length

  return (
    <section
      className="corkboard-outer"
      role="region"
      aria-label="Tasques d'avui — tauler de suro"
    >
      <div className="corkboard-frame" aria-hidden="false">
        <div className="corkboard-surface">

          {/* Capçalera del tauler */}
          <div className="corkboard-header">
            <div>
              <h2 className="corkboard-title">Avui</h2>
              <p className="corkboard-subtitle">
                {formatDateLabel(now)} · {totalCount > 0 ? `${completedCount}/${totalCount} completades` : 'Cap tasca'}
              </p>
            </div>
            <span className="corkboard-date" aria-hidden="true">
              {now.getDate()}.{String(now.getMonth() + 1).padStart(2, '0')}
            </span>
          </div>

          {/* Barra de progrés */}
          {totalCount > 0 && (
            <div
              className="corkboard-progress-bar"
              role="progressbar"
              aria-valuenow={Math.round((completedCount / totalCount) * 100)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${completedCount} de ${totalCount} tasques completades avui`}
            >
              <div
                className="corkboard-progress-fill"
                style={{ width: `${(completedCount / totalCount) * 100}%` }}
              />
            </div>
          )}

          {/* Estat carregant */}
          {isLoading && (
            <p role="status" aria-live="polite" className="corkboard-loading">
              Carregant tasques…
            </p>
          )}

          {/* Estat buit */}
          {!isLoading && todayTodos.length === 0 && (
            <div className="corkboard-empty" role="status" aria-live="polite">
              <p>Cap tasca per avui ✨</p>
              <p style={{ fontSize: '0.72rem', marginTop: '8px', opacity: 0.75 }}>
                Afegeix-ne una tocant el quadern o el botó +
              </p>
            </div>
          )}

          {/* Graella de post-its */}
          {!isLoading && (
            <div
              className="postits-grid"
              role="list"
              aria-label="Tasques d'avui com a notes adhesives"
            >
              {todayTodos.map((todo, i) => (
                <div key={todo.id} role="listitem">
                  <PostItNote todo={todo} onToggle={toggleTodo} index={i} />
                </div>
              ))}

              {/* Botó d'afegir nova tasca */}
              <div role="listitem">
                <button
                  className="postit-add"
                  onClick={onAddTask}
                  aria-label="Afegir una nova tasca per avui"
                  aria-haspopup="dialog"
                >
                  <span className="postit-add-icon" aria-hidden="true">+</span>
                  <span className="postit-add-text">Nova tasca</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  )
}
