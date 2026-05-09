/* mockDB.js — Base de dades simulada amb tasques repartides per la setmana */

const today = new Date()
const fmt   = (d) => d.toISOString().split('T')[0]
const day   = (n) => new Date(today.getTime() + n * 86400000)

/* Tasques repartides entre dies passats i la setmana vinent */
const initialTodos = [
  { id: 1,  task: 'Repassar apunts de Càlcul Diferencial',  date: fmt(today),   completed: false },
  { id: 2,  task: 'Entregar pràctica de Programació',       date: fmt(today),   completed: false },
  { id: 3,  task: 'Meditació matinal',                      date: fmt(today),   completed: true  },
  { id: 4,  task: 'Llegir capítol 4 de Física',             date: fmt(day(1)),  completed: false },
  { id: 5,  task: 'Fer esquema inicial del TFG',            date: fmt(day(1)),  completed: false },
  { id: 6,  task: "Estudiar per l'examen d'Ètica",          date: fmt(day(2)),  completed: false },
  { id: 7,  task: 'Enviar correu al tutor',                 date: fmt(day(2)),  completed: true  },
  { id: 8,  task: 'Resum de Teoria de Nombres',             date: fmt(day(-2)), completed: true  },
  { id: 9,  task: 'Pràctica de Laboratori',                 date: fmt(day(-3)), completed: true  },
  { id: 10, task: 'Presentació del projecte final',         date: fmt(day(7)),  completed: false },
]

export const mockDB = {
  getTodos: () =>
    new Promise(resolve => setTimeout(() => resolve([...initialTodos]), 300)),
}
