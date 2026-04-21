// Les nostres dades inicials
const initialTodos = [
  { id: 1, task: 'Projecte React', date: '2026-04-21', completed: false },
  { id: 2, task: 'Meditació', date: '2026-04-21', completed: true },
  { id: 3, task: 'Revisar correus', date: '2026-04-22', completed: false },
];

// Un objecte que actua com la nostra Base de Dades Falsa
export const mockDB = {
  // Funció per obtenir els Todos
  getTodos: () => {
    return new Promise((resolve) => {
      // Simulem un retard de 400ms com si estiguéssim descarregant dades
      setTimeout(() => {
        resolve([...initialTodos]);
      }, 400);
    });
  }
};
