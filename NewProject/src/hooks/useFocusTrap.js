import { useEffect } from 'react';

const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

export const useFocusTrap = (ref, active) => {
  useEffect(() => {
    if (!active || !ref.current) return;
    const root = ref.current;
    const els = () =>
      Array.from(root.querySelectorAll(FOCUSABLE))
        .filter((e) => !e.disabled && e.offsetParent !== null);

    const onKey = (e) => {
      if (e.key !== "Tab") return;
      const list = els();
      if (!list.length) return;
      const first = list[0];
      const last = list[list.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };

    root.addEventListener("keydown", onKey);
    setTimeout(() => { const list = els(); if (list[0]) list[0].focus(); }, 30);
    return () => root.removeEventListener("keydown", onKey);
  }, [active, ref]);
};
