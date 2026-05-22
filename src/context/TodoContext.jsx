import React, { createContext, useContext, useEffect, useState } from 'react';
import { mockDB, resetSeed } from '../data/mockDB';
import { useAuth } from './AuthContext';

const TodoCtx = createContext(null);

export const useTodos = () => useContext(TodoCtx);

export const TodoProvider = ({ children }) => {
  const { enabled, ready, user } = useAuth();
  const [todos, setTodos] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // The active CRUD backend: mockDB (local) or a per-user cloud backend.
  const [backend, setBackend] = useState(null);

  // Pick the backend from auth state. Local mode = mockDB; cloud mode needs a
  // signed-in user. While Firebase is initializing or signed out, backend
  // stays null (loading / empty).
  useEffect(() => {
    let alive = true;
    if (!enabled) { setBackend(mockDB); return; }
    if (!ready) { setBackend(null); return; }
    if (!user) { setBackend(null); setTodos([]); setLoading(false); return; }
    (async () => {
      const { getFirebase } = await import('../data/firebase');
      const { createCloudDB } = await import('../data/cloudDB');
      if (alive) setBackend(createCloudDB(getFirebase().db, user.uid));
    })();
    return () => { alive = false; };
  }, [enabled, ready, user]);

  // (Re)load whenever the backend changes.
  useEffect(() => {
    if (!backend) return;
    let alive = true;
    setLoading(true);
    backend.getTodos()
      .then((d) => { if (alive) { setTodos(d); setLoading(false); } })
      .catch((e) => { if (alive) { setError(e.message); setLoading(false); } });
    return () => { alive = false; };
  }, [backend]);

  useEffect(() => {
    window.resetDemo = () => {
      if (enabled) return; // cloud data isn't seed data
      resetSeed();
      setLoading(true);
      mockDB.getTodos().then((d) => { setTodos(d); setLoading(false); });
    };
    return () => { window.resetDemo = null; };
  }, [enabled]);

  const addTodo = async (data) => {
    if (!backend) return null;
    const n = await backend.addTodo(data);
    setTodos((t) => [...t, n]);
    return n;
  };
  const toggleTodo = async (id) => {
    if (!backend) return;
    const u = await backend.toggleTodo(id);
    setTodos((t) => t.map((x) => (x.id === id ? u : x)));
  };
  const deleteTodo = async (id) => {
    if (!backend) return;
    await backend.deleteTodo(id);
    setTodos((t) => t.filter((x) => x.id !== id));
  };
  const updateTodo = async (id, updates) => {
    if (!backend) return;
    const u = await backend.updateTodo(id, updates);
    setTodos((t) => t.map((x) => (x.id === id ? u : x)));
  };

  return (
    <TodoCtx.Provider value={{ todos, isLoading, error, addTodo, toggleTodo, deleteTodo, updateTodo }}>
      {children}
    </TodoCtx.Provider>
  );
};
