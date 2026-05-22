// Mock DB — async with delay, backed by localStorage for persistence
import { localDateKey, localDateShift } from '../utils/date';

const STORAGE_KEY = 'clearmind_todos';
const _delay = (ms = 220) => new Promise((r) => setTimeout(r, ms));
const _id = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
const _today = () => localDateKey();
const _shift = (n) => localDateShift(n);

const _loadFromStorage = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore parse errors
  }
  return [];
};

const _saveToStorage = (arr) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
  } catch {
    // ignore storage errors (e.g. quota exceeded)
  }
};

let _store = null;
const _load = () => {
  if (!_store) _store = _loadFromStorage();
  return _store;
};

export const mockDB = {
  getTodos: () => _delay().then(() => [..._load()]),
  addTodo: (todo) => _delay().then(() => {
    const n = { ...todo, id: _id(), createdAt: Date.now(), completed: false };
    const arr = _load();
    arr.push(n);
    _saveToStorage(arr);
    return n;
  }),
  updateTodo: (id, updates) => _delay().then(() => {
    const arr = _load();
    const i = arr.findIndex((t) => t.id === id);
    if (i === -1) throw new Error("Todo not found");
    arr[i] = { ...arr[i], ...updates };
    _saveToStorage(arr);
    return arr[i];
  }),
  deleteTodo: (id) => _delay().then(() => {
    const arr = _load();
    const i = arr.findIndex((t) => t.id === id);
    if (i === -1) throw new Error("Todo not found");
    const [r] = arr.splice(i, 1);
    _saveToStorage(arr);
    return r;
  }),
  toggleTodo: (id) => _delay().then(() => {
    const arr = _load();
    const t = arr.find((x) => x.id === id);
    if (!t) throw new Error("Todo not found");
    t.completed = !t.completed;
    _saveToStorage(arr);
    return t;
  }),
};

export const resetSeed = () => {
  _store = null;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
};

export const dateToday = _today;
export const dateShift = _shift;
