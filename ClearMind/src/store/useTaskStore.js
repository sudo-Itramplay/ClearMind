// src/store/useTaskStore.js
import { create } from 'zustand';

const useTaskStore = create((set) => ({
  // aquesta és la nostra "memòria" global per a les tasques
  tasks: [],

  // 2. Aquesta funció permet afegir una tasca nova
  addTask: (newTask) => set((state) => ({
    // Agafem les tasques que ja hi havia i hi afegim la nova al final
    tasks: [...state.tasks, newTask]
  })),

  removeTask: (taskId) => set((state) => ({
    // Retornem totes les tasques EXCEPTE la que té aquest ID
    tasks: state.tasks.filter((task) => task.id !== taskId)
  })),
}));

export default useTaskStore;