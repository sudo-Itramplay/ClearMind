import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { CHORD_TIMEOUT_MS, KEYMAP } from "../config/keymapConfig";
import { shouldIgnore, normalizeKey } from "../domain/eventGuards";
import { createMatcher } from "../domain/matcher";

// Dispatcher only. Owns the document listener and a registry of handlers
// keyed by binding-id. Components register themselves with useKeyAction.

const Ctx = createContext(null);

export const KeymapProvider = ({ children, keymap = KEYMAP }) => {
  const handlersRef = useRef(new Map());

  const register = useCallback((id, handler) => {
    handlersRef.current.set(id, handler);
    return () => {
      // Only delete if it's still the same handler — avoids ABA churn
      // when a component re-registers under React StrictMode.
      if (handlersRef.current.get(id) === handler) {
        handlersRef.current.delete(id);
      }
    };
  }, []);

  // Matcher is keymap-derived; recompute only when the keymap reference
  // changes (which is essentially never at runtime).
  const matcher = useMemo(
    () => createMatcher(keymap, { timeoutMs: CHORD_TIMEOUT_MS }),
    [keymap]
  );

  useEffect(() => {
    const onKey = (e) => {
      if (shouldIgnore(e)) return;
      const { id, consumed } = matcher.match(normalizeKey(e));
      if (!consumed) return;
      e.preventDefault();
      if (!id) return; // buffered as leader, waiting for the next key
      const handler = handlersRef.current.get(id);
      if (handler) handler(e);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [matcher]);

  return <Ctx.Provider value={{ register, keymap }}>{children}</Ctx.Provider>;
};

export const useKeymap = () => useContext(Ctx);

// Components call useKeyAction with a stable id and any handler — the hook
// keeps the latest handler in a ref so callers don't need useCallback.
export const useKeyAction = (id, handler) => {
  const ctx = useContext(Ctx);
  const handlerRef = useRef(handler);

  useEffect(() => { handlerRef.current = handler; });

  useEffect(() => {
    if (!ctx) return undefined;
    return ctx.register(id, (e) => handlerRef.current && handlerRef.current(e));
  }, [ctx, id]);
};
