// Mock DB — async with delay, in-memory + localStorage persistence
import { localDateKey, localDateShift } from '../utils/date';

const _delay = (ms = 220) => new Promise((r) => setTimeout(r, ms));
const _id = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
const _today = () => localDateKey();
const _shift = (n) => localDateShift(n);

// v2: switched from UTC ISO date to local date keys. Old seed data used
// off-by-one keys in non-UTC timezones, so it must not be re-loaded.
const STORAGE_KEY = "clearmind-todos-v2";

const seed = () => {
  const t = _today();
  return [
    { id: _id(), task: "Read chapter 3 of Calculus", description: "Focus on integrals", date: t,        completed: false, priority: "normal", createdAt: Date.now() },
    { id: _id(), task: "Practice Spanish vocabulary", description: "50 words from unit 4", date: t,        completed: false, priority: "high",   createdAt: Date.now() - 1e4 },
    { id: _id(), task: "Morning meditation",          description: "",                     date: t,        completed: true,  priority: "low",    createdAt: Date.now() - 2e4 },
    { id: _id(), task: "Write essay draft",           description: "Intro and outline",    date: t,        completed: false, priority: "high",   createdAt: Date.now() - 3e4 },
    { id: _id(), task: "Review chemistry notes",      description: "Organic compounds",    date: t,        completed: true,  priority: "normal", createdAt: Date.now() - 4e4 },
    { id: _id(), task: "Email Dr. Chen",              description: "About lab report",     date: t,        completed: false, priority: "normal", createdAt: Date.now() - 5e4 },
    { id: _id(), task: "Run 3km",                     description: "",                     date: _shift(-1), completed: true,  priority: "low",    createdAt: Date.now() - 9e4 },
    { id: _id(), task: "Plan tomorrow",               description: "",                     date: _shift(-2), completed: true,  priority: "normal", createdAt: Date.now() - 1.2e5 },
    { id: _id(), task: "Pothos water",                description: "",                     date: _shift(-3), completed: true,  priority: "low",    createdAt: Date.now() - 1.5e5 },
    { id: _id(), task: "Lab report draft",            description: "",                     date: _shift(-5), completed: true,  priority: "high",   createdAt: Date.now() - 1.8e5 },
    { id: _id(), task: "Grocery run",                 description: "",                     date: _shift(-6), completed: true,  priority: "low",    createdAt: Date.now() - 2e5 },
    { id: _id(), task: "Walk",                        description: "",                     date: _shift(-7), completed: true,  priority: "low",    createdAt: Date.now() - 2.2e5 },
    { id: _id(), task: "Submit form",                 description: "",                     date: _shift(-9), completed: true,  priority: "normal", createdAt: Date.now() - 2.5e5 },
    { id: _id(), task: "Standup",                     description: "",                     date: _shift(-12),completed: true,  priority: "low",    createdAt: Date.now() - 3e5 },

    // --- Deures (homework) ---
    { id: _id(), task: "Maths exercises 4.1–4.5",    description: "Derivatives worksheet",  date: t,            completed: false, priority: "normal", createdAt: Date.now() - 6e4 },
    { id: _id(), task: "Physics problem set #3",      description: "Kinematics problems",    date: _shift(1),    completed: false, priority: "high",   createdAt: Date.now() - 7e4 },
    { id: _id(), task: "English essay: Hamlet",        description: "1500 words, MLA format", date: _shift(3),    completed: false, priority: "high",   createdAt: Date.now() - 8e4 },
    { id: _id(), task: "Programming lab 5",            description: "Binary trees in Java",   date: _shift(4),    completed: false, priority: "normal", createdAt: Date.now() - 9e4 },
    { id: _id(), task: "History reading ch. 7–8",      description: "Cold War and aftermath", date: _shift(2),    completed: false, priority: "low",    createdAt: Date.now() - 1e5 },

    // --- Preparació examen (exam prep for next week) ---
    { id: _id(), task: "Review Calculus ch. 1–3",      description: "Summarize key formulas",  date: t,            completed: false, priority: "high",   createdAt: Date.now() - 1.1e5 },
    { id: _id(), task: "Practice integrals exercises",  description: "Do 20 problems from the textbook", date: _shift(1), completed: false, priority: "high", createdAt: Date.now() - 1.2e5 },
    { id: _id(), task: "Review Calculus ch. 4–5",       description: "Series and sequences",   date: _shift(2),    completed: false, priority: "high",   createdAt: Date.now() - 1.3e5 },
    { id: _id(), task: "Solve past exam 2024",          description: "Time yourself: 90 min",  date: _shift(3),    completed: false, priority: "high",   createdAt: Date.now() - 1.4e5 },
    { id: _id(), task: "Make formula cheat sheet",      description: "One A4 page, handwritten", date: _shift(4),  completed: false, priority: "normal", createdAt: Date.now() - 1.5e5 },
    { id: _id(), task: "Flashcards: theorems & proofs", description: "All important theorems",  date: _shift(5),   completed: false, priority: "normal", createdAt: Date.now() - 1.6e5 },
    { id: _id(), task: "Mock exam under timed conditions", description: "Simulate real exam environment", date: _shift(6), completed: false, priority: "high", createdAt: Date.now() - 1.7e5 },
    { id: _id(), task: "EXAM: Calculus II",             description: "Room B204, 9:00–11:00. Bring calculator and ID.", date: _shift(7), completed: false, priority: "high", createdAt: Date.now() - 1.8e5 },
  ];
};

let _store = null;
const _load = () => {
  if (_store) return _store;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) { _store = JSON.parse(raw); return _store; }
  } catch (e) {}
  _store = seed();
  _persist();
  return _store;
};

let _saveT = null;
const _persist = () => {
  if (_saveT) clearTimeout(_saveT);
  _saveT = setTimeout(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(_store)); } catch (e) {}
  }, 300);
};

export const mockDB = {
  getTodos: () => _delay().then(() => [..._load()]),
  addTodo: (todo) => _delay().then(() => {
    const n = { ...todo, id: _id(), createdAt: Date.now(), completed: false };
    _load().push(n); _persist(); return n;
  }),
  updateTodo: (id, updates) => _delay().then(() => {
    const arr = _load();
    const i = arr.findIndex((t) => t.id === id);
    if (i === -1) throw new Error("Todo not found");
    arr[i] = { ...arr[i], ...updates }; _persist(); return arr[i];
  }),
  deleteTodo: (id) => _delay().then(() => {
    const arr = _load();
    const i = arr.findIndex((t) => t.id === id);
    if (i === -1) throw new Error("Todo not found");
    const [r] = arr.splice(i, 1); _persist(); return r;
  }),
  toggleTodo: (id) => _delay().then(() => {
    const arr = _load();
    const t = arr.find((x) => x.id === id);
    if (!t) throw new Error("Todo not found");
    t.completed = !t.completed; _persist(); return t;
  }),
};

export const dateToday = _today;
export const dateShift = _shift;
