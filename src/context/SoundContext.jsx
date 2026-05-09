import React, { createContext, useCallback, useContext, useState } from 'react';

const SoundCtx = createContext({ enabled: false, toggle: () => {}, play: () => {} });

export const useSoundCtx = () => useContext(SoundCtx);

let _audio = null;
const _ac = () => {
  if (!_audio) _audio = new (window.AudioContext || window.webkitAudioContext)();
  if (_audio.state === "suspended") _audio.resume();
  return _audio;
};

const _tone = (freq, dur, type = "sine", vol = 0.15, attack = 0.01) => {
  const ac = _ac();
  const o = ac.createOscillator();
  const g = ac.createGain();
  o.type = type;
  o.frequency.value = freq;
  g.gain.value = 0;
  o.connect(g); g.connect(ac.destination);
  const t = ac.currentTime;
  g.gain.linearRampToValueAtTime(vol, t + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.start(t); o.stop(t + dur + 0.05);
};

const SOUNDS = {
  click:    () => _tone(360, 0.08, "triangle", 0.10),
  tick:     () => { _tone(880, 0.04, "square", 0.05); _tone(440, 0.06, "triangle", 0.04); },
  complete: () => { _tone(660, 0.18, "sine", 0.12); setTimeout(() => _tone(880, 0.32, "sine", 0.14), 90); },
  gong:     () => { _tone(160, 0.6, "sine", 0.18); _tone(240, 0.6, "sine", 0.10); },
  creak:    () => _tone(120, 0.18, "sawtooth", 0.04),
};

const STORAGE_KEY = "clearmind-sound-enabled";

export const SoundProvider = ({ children }) => {
  const [enabled, setEnabled] = useState(() => {
    try { return localStorage.getItem(STORAGE_KEY) === "1"; } catch (e) { return false; }
  });
  const toggle = () => setEnabled((v) => {
    const n = !v;
    try { localStorage.setItem(STORAGE_KEY, n ? "1" : "0"); } catch (e) {}
    return n;
  });
  const play = useCallback((name) => {
    if (!enabled) return;
    try { SOUNDS[name] && SOUNDS[name](); } catch (e) {}
  }, [enabled]);
  return (
    <SoundCtx.Provider value={{ enabled, toggle, play }}>
      {children}
    </SoundCtx.Provider>
  );
};
