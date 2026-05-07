/* Hall.jsx — Vista Sala: vestíbul principal de l'aplicació
   Estètica: cafè / sala d'estar residencial (Le Blanc)
   Accessibilitat: WCAG 2.1 AA — aria-labels, focus, SR-friendly */

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTodos } from '../context/TodoContext'
import './css/Hall.css'

function Hall() {
  const { todos, isLoading } = useTodos()

  /* Rellotge en temps real — actualitzat cada minut */
  const [time, setTime] = useState(
    new Date().toLocaleTimeString('ca-ES', { hour: '2-digit', minute: '2-digit' })
  )

  useEffect(() => {
    /* Actualitza el rellotge cada 30 segons (prou granularitat per mm:ss) */
    const interval = setInterval(() => {
      setTime(
        new Date().toLocaleTimeString('ca-ES', { hour: '2-digit', minute: '2-digit' })
      )
    }, 30_000)
    return () => clearInterval(interval)
  }, [])

  /* Separa les tasques pendents de les completades */
  const pendingTodos  = todos.filter(t => !t.completed)
  const doneTodos     = todos.filter(t =>  t.completed)
  const sortedTodos   = [...pendingTodos, ...doneTodos].slice(0, 5) /* Mostra màxim 5 */

  return (
    <div className="hall-container" role="main" aria-label="Sala principal de ClearMind">

      {/* ── Porta esquerra — accés a l'Estudi ──────────── */}
      <Link
        to="/study"
        className="door left-door"
        aria-label="Entrar a la sala d'estudi"
      >
        {/* Marc decoratiu interior */}
        <div className="door-frame" aria-hidden="true" />
        {/* Etiqueta visible de la porta */}
        <div className="door-label">ESTUDI</div>
      </Link>

      {/* ── Paret central — rellotge i tauler de tasques ─ */}
      <section className="center-wall" aria-label="Paret central de la sala">

        {/* Rellotge decoratiu — element purament visual */}
        <div
          className="clock-circle"
          role="img"
          aria-label={`Rellotge decoratiu. Hora actual: ${time}`}
        >
          <span className="clock-time" aria-hidden="true">{time}</span>
          <p aria-hidden="true">RELLOTGE</p>
        </div>

        {/* Tauler de tasques — resum de l'estat actual */}
        <div
          className="calendar-board"
          role="region"
          aria-label="Resum de tasques al tauler"
        >
          <h2>TASQUES D'AVUI</h2>

          {isLoading ? (
            /* Estat de càrrega accessible */
            <p
              role="status"
              aria-live="polite"
              style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', fontFamily: 'monospace' }}
            >
              Carregant tasques…
            </p>
          ) : sortedTodos.length === 0 ? (
            /* Estat buit */
            <p
              role="status"
              style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', fontFamily: 'monospace' }}
            >
              Cap tasca per avui! 🌿
            </p>
          ) : (
            <ul
              className="todo-list"
              aria-label={`${pendingTodos.length} tasques pendents, ${doneTodos.length} completades`}
            >
              {sortedTodos.map(todo => (
                <li
                  key={todo.id}
                  className={todo.completed ? 'done' : ''}
                  aria-label={
                    todo.completed
                      ? `Tasca completada: ${todo.task}`
                      : `Tasca pending: ${todo.task}`
                  }
                >
                  {todo.task}
                </li>
              ))}
            </ul>
          )}

          {/* Indicador de tasques addicionals */}
          {todos.length > 5 && (
            <p
              style={{
                fontSize: '0.6rem',
                color: 'var(--text-tertiary)',
                fontFamily: 'monospace',
                marginTop: '6px',
                textAlign: 'right',
              }}
              aria-label={`i ${todos.length - 5} tasques més a la vista d'estudi`}
            >
              +{todos.length - 5} més...
            </p>
          )}
        </div>
      </section>

      {/* ── Porta dreta — accés a la Meditació ─────────── */}
      <Link
        to="/relax"
        className="door right-door"
        aria-label="Entrar a la sala de meditació"
      >
        <div className="door-frame" aria-hidden="true" />
        <div className="door-label">MEDITACIÓ</div>
      </Link>

      {/* ── Catifa decorativa del terra ─────────────────── */}
      <div className="rug" aria-hidden="true" role="presentation" />
    </div>
  )
}

export default Hall
