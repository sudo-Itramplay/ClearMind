/* task-list.jsx — Llista de tasques del dia estil "bloc de notes" */

import { useState } from 'react'
import { Card, CardHeader, CardContent } from '../ui/card'
import { Badge } from '../ui/badge'
import { cn } from '../../lib/utils'

/* Tasques de mostra — vindran de TodoContext en producció */
const INITIAL_TASKS = [
  { id: 1, text: 'Repassar apunts de Càlcul Diferencial', done: true,  priority: 'high'   },
  { id: 2, text: 'Entregar pràctica de Programació',      done: false, priority: 'high'   },
  { id: 3, text: 'Llegir capítol 4 de Física Quàntica',  done: false, priority: 'medium' },
  { id: 4, text: 'Fer esquema inicial del TFG',           done: false, priority: 'low'    },
]

/* Configuració visual per prioritat */
const PRIORITY = {
  high:   { badge: 'critical', label: 'Alta',  dot: 'var(--accent-critical)' },
  medium: { badge: 'warm',     label: 'Mitja', dot: 'var(--accent-warm)'     },
  low:    { badge: 'calm',     label: 'Baixa', dot: 'var(--accent-calm)'     },
}

/* Casella de verificació artesanal — ressembla un checkbox de paper */
function Checkbox({ checked, onChange, id }) {
  return (
    <button
      role="checkbox"
      aria-checked={checked}
      aria-labelledby={id}
      onClick={onChange}
      className={cn(
        'w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0',
        'transition-all duration-fast focus-visible:outline-none focus-visible:ring-2',
        'focus-visible:ring-accent-primary focus-visible:ring-offset-1',
        checked
          ? 'border-accent-calm bg-accent-calm'
          : 'border-border-default bg-surface-elevated hover:border-accent-primary',
      )}
    >
      {checked && (
        <svg width="10" height="8" viewBox="0 0 10 8" fill="none" aria-hidden="true">
          <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
    </button>
  )
}

export function TaskList() {
  const [tasks, setTasks] = useState(INITIAL_TASKS)

  function toggleTask(id) {
    setTasks(ts => ts.map(t => t.id === id ? { ...t, done: !t.done } : t))
  }

  const done = tasks.filter(t => t.done).length
  const total = tasks.length
  const pct = total > 0 ? (done / total) * 100 : 0

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
            Tasques d'Avui
          </h2>
          <Badge variant="muted">{done}/{total} fetes</Badge>
        </div>

        {/* Barra de progrés de les tasques */}
        <div className="mt-3 relative">
          <div
            className="h-1.5 rounded-full overflow-hidden"
            style={{ backgroundColor: 'var(--border-soft)' }}
          >
            <div
              className="h-full rounded-full transition-all duration-slow ease-out"
              style={{ width: `${pct}%`, backgroundColor: 'var(--accent-calm)' }}
            />
          </div>
          {pct === 100 && (
            <span className="absolute -top-0.5 right-0 text-xs" style={{ color: 'var(--accent-calm)' }}>
              ✓ Tot fet!
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent className="pb-5">
        {/* "Línia de marge" estil paper — franja vermella decorativa */}
        <div className="relative">
          <div
            className="absolute left-0 top-0 bottom-0 w-0.5 rounded-full opacity-30"
            style={{ backgroundColor: 'var(--accent-critical)' }}
          />

          <ul className="space-y-1.5 pl-3" role="list">
            {tasks.map(task => {
              const cfg = PRIORITY[task.priority]
              const rowId = `task-label-${task.id}`
              return (
                <li
                  key={task.id}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg border',
                    'transition-all duration-fast cursor-pointer group',
                    task.done
                      ? 'opacity-60 border-transparent'
                      : 'border-border-soft hover:border-accent-primary-light hover:bg-accent-primary-50',
                  )}
                  style={{
                    backgroundColor: task.done ? 'transparent' : 'var(--surface-elevated)',
                  }}
                  onClick={() => toggleTask(task.id)}
                >
                  <Checkbox
                    checked={task.done}
                    onChange={() => toggleTask(task.id)}
                    id={rowId}
                  />

                  {/* Punt de prioritat — discret però present */}
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0 opacity-70"
                    style={{ backgroundColor: cfg.dot }}
                  />

                  <span
                    id={rowId}
                    className={cn(
                      'flex-1 text-sm font-medium transition-colors duration-fast leading-snug',
                      task.done ? 'line-through' : '',
                    )}
                    style={{ color: task.done ? 'var(--text-tertiary)' : 'var(--text-primary)' }}
                  >
                    {task.text}
                  </span>
                </li>
              )
            })}
          </ul>
        </div>

        {/* Missatge motivador quan tot està fet */}
        {pct === 100 && (
          <p
            className="mt-4 text-center text-sm font-medium"
            style={{ color: 'var(--accent-calm)' }}
          >
            ✨ Increïble! Has completat totes les tasques d'avui.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
