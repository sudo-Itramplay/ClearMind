// Pure chord matcher. Owns no React, no DOM — just the state machine that
// turns a stream of keys into binding-ids.
//
// On each call:
//   1. If a chord is pending, try buffer + key as a 2-key sequence.
//      Match -> return id, reset. No match -> reset, fall through.
//   2. If the key starts any 2-key chord in the keymap, buffer it and
//      schedule a reset; return null (waiting for a partner key).
//   3. Otherwise, look up the key as a single binding.

export const createMatcher = (keymap, { timeoutMs = 800, setTimeoutFn = setTimeout, clearTimeoutFn = clearTimeout } = {}) => {
  const leaders = new Set(
    keymap.filter((b) => b.keys.length > 1).map((b) => b.keys[0])
  );

  let buffer = "";
  let timer = null;

  const resetBuffer = () => {
    buffer = "";
    if (timer) { clearTimeoutFn(timer); timer = null; }
  };

  const scheduleReset = () => {
    if (timer) clearTimeoutFn(timer);
    timer = setTimeoutFn(resetBuffer, timeoutMs);
  };

  // Returns { id, consumed }:
  //   id       — matched binding-id, or null if just buffering / no match
  //   consumed — true if the matcher recognised this key (so the dispatcher
  //              knows to preventDefault and stop browser quick-find etc.)
  const match = (key) => {
    if (buffer) {
      const seq = buffer + key;
      const chord = keymap.find((b) => b.keys === seq);
      resetBuffer();
      if (chord) return { id: chord.id, consumed: true };
      // fall through — current key may still match a single binding
    }

    if (leaders.has(key)) {
      buffer = key;
      scheduleReset();
      return { id: null, consumed: true };
    }

    const single = keymap.find((b) => b.keys === key);
    if (single) return { id: single.id, consumed: true };
    return { id: null, consumed: false };
  };

  return { match, reset: resetBuffer };
};
