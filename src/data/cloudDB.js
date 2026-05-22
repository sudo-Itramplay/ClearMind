// Firestore-backed data layer. Implements the same todo interface as mockDB
// ({ getTodos, addTodo, updateTodo, deleteTodo, toggleTodo }) plus exam
// helpers, scoped to a single signed-in user.
//
// Document layout:
//   users/{uid}/todos/{autoId}   → { task, description, date, priority, completed, createdAt }
//   users/{uid}/exams/{date}     → { label }
//
// Like firebase.js, this statically imports the SDK and must only be loaded
// via a gated dynamic import().
import {
  collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc,
} from "firebase/firestore";

const _id = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

export const createCloudDB = (db, uid) => {
  const todosCol = collection(db, "users", uid, "todos");
  const examsCol = collection(db, "users", uid, "exams");

  return {
    // ── Todos ──────────────────────────────────────────────────────────
    getTodos: async () => {
      const snap = await getDocs(todosCol);
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    },
    addTodo: async (todo) => {
      const id = _id();
      const record = { ...todo, createdAt: Date.now(), completed: false };
      await setDoc(doc(todosCol, id), record);
      return { id, ...record };
    },
    updateTodo: async (id, updates) => {
      const ref = doc(todosCol, id);
      await updateDoc(ref, updates);
      const snap = await getDoc(ref);
      return { id, ...snap.data() };
    },
    deleteTodo: async (id) => {
      await deleteDoc(doc(todosCol, id));
      return { id };
    },
    toggleTodo: async (id) => {
      const ref = doc(todosCol, id);
      const snap = await getDoc(ref);
      const completed = !snap.data().completed;
      await updateDoc(ref, { completed });
      return { id, ...snap.data(), completed };
    },

    // ── Exams (map of { [date]: label }) ───────────────────────────────
    getExams: async () => {
      const snap = await getDocs(examsCol);
      const map = {};
      snap.docs.forEach((d) => { map[d.id] = d.data().label || ""; });
      return map;
    },
    setExam: (date, label = "") => setDoc(doc(examsCol, date), { label }),
    removeExam: (date) => deleteDoc(doc(examsCol, date)),
  };
};
