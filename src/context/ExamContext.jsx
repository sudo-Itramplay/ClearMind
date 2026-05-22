import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { localDateKey } from '../utils/date';
import { useAuth } from './AuthContext';

const ExamCtx = createContext(null);
const STORAGE_KEY = 'clearmind_exams';

export const useExams = () => useContext(ExamCtx);

// Exams are stored as a { [YYYY-MM-DD]: label } map so day lookups are O(1).
const load = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore parse errors
  }
  return {};
};

export const ExamProvider = ({ children }) => {
  const { enabled, ready, user } = useAuth();
  const [exams, setExams] = useState(enabled ? {} : load);
  const cloudRef = useRef(null);

  // Local mode: persist to localStorage on every change.
  useEffect(() => {
    if (enabled) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(exams));
    } catch {
      // ignore storage errors (e.g. quota exceeded)
    }
  }, [exams, enabled]);

  // Cloud mode: bind a per-user backend and load once signed in.
  useEffect(() => {
    if (!enabled) return;
    let alive = true;
    if (!ready || !user) { cloudRef.current = null; setExams({}); return; }
    (async () => {
      const { getFirebase } = await import('../data/firebase');
      const { createCloudDB } = await import('../data/cloudDB');
      const cdb = createCloudDB(getFirebase().db, user.uid);
      cloudRef.current = cdb;
      const map = await cdb.getExams();
      if (alive) setExams(map);
    })();
    return () => { alive = false; };
  }, [enabled, ready, user]);

  const setExam = useCallback((date, label = '') => {
    setExams((m) => ({ ...m, [date]: label }));
    if (cloudRef.current) cloudRef.current.setExam(date, label);
  }, []);

  const removeExam = useCallback((date) => {
    setExams((m) => {
      if (!(date in m)) return m;
      const next = { ...m };
      delete next[date];
      return next;
    });
    if (cloudRef.current) cloudRef.current.removeExam(date);
  }, []);

  // Soonest exam on or after today, used by the Study countdown.
  const nextExam = useMemo(() => {
    const todayKey = localDateKey();
    const upcoming = Object.keys(exams).filter((d) => d >= todayKey).sort();
    if (!upcoming.length) return null;
    return { date: upcoming[0], label: exams[upcoming[0]] };
  }, [exams]);

  const value = useMemo(
    () => ({ exams, setExam, removeExam, nextExam }),
    [exams, setExam, removeExam, nextExam],
  );

  return <ExamCtx.Provider value={value}>{children}</ExamCtx.Provider>;
};
