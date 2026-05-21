import React, { createContext, useCallback, useContext, useState, useEffect } from 'react';

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

let _ambientNode = null;
let _ambientOsc1 = null;
let _ambientOsc2 = null;
let _ambientNoise = null;

const _startAmbient = () => {
  try {
    const ac = _ac();
    if (_ambientNode) return;
    
    
    _ambientNode = ac.createGain();
    _ambientNode.gain.value = 0.15;
    _ambientNode.connect(ac.destination);
    
    // DO
    _ambientOsc1 = ac.createOscillator();
    _ambientOsc1.type = "sine";
    _ambientOsc1.frequency.value = 130.81;
    const gain1 = ac.createGain();
    gain1.gain.value = 0.2;
    _ambientOsc1.connect(gain1).connect(_ambientNode);
    
    // SOL
    _ambientOsc2 = ac.createOscillator();
    _ambientOsc2.type = "sine";
    _ambientOsc2.frequency.value = 196.22;
    const gain2 = ac.createGain();
    gain2.gain.value = 0.3;
    _ambientOsc2.connect(gain2).connect(_ambientNode);
    
    // SOROLL
    const bufferSize = ac.sampleRate * 2;
    const buffer = ac.createBuffer(1, bufferSize, ac.sampleRate);
    const output = buffer.getChannelData(0);
    let lastOut = 0;
    for (let i = 0; i < bufferSize; i++) {
        let white = Math.random() * 2 - 1;
        output[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5;
    }
    
    _ambientNoise = ac.createBufferSource();
    _ambientNoise.buffer = buffer;
    _ambientNoise.loop = true;
    
    // SENSE AGUTS
    const noiseFilter = ac.createBiquadFilter();
    noiseFilter.type = "lowpass";
    noiseFilter.frequency.value = 500; 
    
    
    const noiseGain = ac.createGain();
    noiseGain.gain.value = 0.40; 
    
    _ambientNoise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(_ambientNode);
    
    
    _ambientOsc1.start();
    _ambientOsc2.start();
    _ambientNoise.start();
  } catch (e) { console.log(e); }
};

const _stopAmbient = () => {
  try {
    if (_ambientOsc1) _ambientOsc1.stop();
    if (_ambientOsc2) _ambientOsc2.stop();
    if (_ambientNoise) _ambientNoise.stop();
  } catch (e) {}
  _ambientNode = null;
  _ambientOsc1 = null;
  _ambientOsc2 = null;
  _ambientNoise = null;
};
const SOUNDS = {
  click:    () => _tone(360, 0.08, "triangle", 0.25),
  tick:     () => { _tone(880, 0.04, "square", 0.25); _tone(440, 0.06, "triangle", 0.25); },
  complete: () => { _tone(660, 0.18, "sine", 0.22); setTimeout(() => _tone(880, 0.32, "sine", 0.23), 90); },
  gong:     () => { _tone(160, 0.6, "sine", 0.25); _tone(240, 0.6, "sine", 0.25); },
  creak:    () => _tone(120, 0.18, "sawtooth", 0.25),
  scratch:  () => {
      const arxius = ['/check1.mp3', '/check2.mp3']; 
      const arxiuAleatori = arxius[Math.floor(Math.random() * arxius.length)];
      const audio = new Audio(arxiuAleatori);
      audio.volume = 0.5; 
      audio.play().catch(e => console.log("Error de so:", e));
  }
};

const STORAGE_KEY = "clearmind-sound-enabled";

export const SoundProvider = ({ children }) => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (enabled) {
      _startAmbient();
    } else {
      _stopAmbient();
    }
    return () => _stopAmbient();
  }, [enabled]);

  const toggle = () => {
    const ac = _ac();
    if (ac.state === "suspended") ac.resume();
    setEnabled((v) => !v);
  };
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
