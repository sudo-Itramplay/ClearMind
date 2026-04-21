import React, { createContext, useState, useContext, useEffect } from 'react';
import { mockDB } from '../data/mockDB'; // 1. Importem la base de dades

const TodoContext = createContext();

export const TodoProvider = ({ children }) => {
  // Inicialitzem els todos buits, ja que s'han de "descarregar"
  const [todos, setTodos] = useState([]); 
  const [isLoading, setIsLoading] = useState(true); // Opcional: per saber si estem carregant

  // 2. Cridem a la MOCKBD quan s'inicia el Provider
  useEffect(() => {
    mockDB.getTodos().then((data) => {
      setTodos(data);
      setIsLoading(false);
    });
  }, []); // L'array buit vol dir que només s'executa un cop al principi

  return (
    <TodoContext.Provider value={{ todos, setTodos, isLoading }}>
      {children}
    </TodoContext.Provider>
  );
};

export const useTodos = () => useContext(TodoContext);
