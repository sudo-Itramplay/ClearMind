import React, { createContext, useContext, useEffect, useState } from "react";
import { useSoundCtx } from "./SoundContext";
import { mockDB, resetSeed } from "../data/mockDB";

const TodoCtx = createContext(null);

export const useTodos = () => useContext(TodoCtx);

export const TodoProvider = ({ children }) => {
  const [todos, setTodos] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { play } = useSoundCtx();

  useEffect(() => {
    let alive = true;
    mockDB
      .getTodos()
      .then((d) => {
        if (alive) {
          setTodos(d);
          setLoading(false);
        }
      })
      .catch((e) => {
        if (alive) {
          setError(e.message);
          setLoading(false);
        }
      });
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    window.resetDemo = () => {
      resetSeed();
      setLoading(true);
      mockDB.getTodos().then((d) => {
        setTodos(d);
        setLoading(false);
      });
    };
    return () => {
      window.resetDemo = null;
    };
  }, []);

  const addTodo = async (data) => {
    const n = await mockDB.addTodo(data);
    setTodos((t) => [...t, n]);
    return n;
  };
  const toggleTodo = async (id) => {
    const u = await mockDB.toggleTodo(id);
    setTodos((t) => t.map((x) => (x.id === id ? u : x)));
    if (u.completed) {
      play("scratch");
    }
  };
  const deleteTodo = async (id) => {
    await mockDB.deleteTodo(id);
    setTodos((t) => t.filter((x) => x.id !== id));
  };
  const updateTodo = async (id, updates) => {
    const u = await mockDB.updateTodo(id, updates);
    setTodos((t) => t.map((x) => (x.id === id ? u : x)));
  };

  return (
    <TodoCtx.Provider
      value={{
        todos,
        isLoading,
        error,
        addTodo,
        toggleTodo,
        deleteTodo,
        updateTodo,
      }}
    >
      {children}
    </TodoCtx.Provider>
  );
};
