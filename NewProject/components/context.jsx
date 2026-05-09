// TodoContext + Sound + FocusTrap utilities

const TodoCtx = React.createContext(null);
const useTodos = () => React.useContext(TodoCtx);

const TodoProvider = ({ children }) => {
  const [todos, setTodos] = React.useState([]);
  const [isLoading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    let alive = true;
    mockDB.getTodos()
      .then((d) => { if (alive) { setTodos(d); setLoading(false); } })
      .catch((e) => { if (alive) { setError(e.message); setLoading(false); } });
    return () => { alive = false; };
  }, []);

  const addTodo = async (data) => {
    const n = await mockDB.addTodo(data);
    setTodos((t) => [...t, n]);
    return n;
  };
  const toggleTodo = async (id) => {
    const u = await mockDB.toggleTodo(id);
    setTodos((t) => t.map((x) => (x.id === id ? u : x)));
  };
  const deleteTodo = async (id) => {
    await mockDB.deleteTodo(id);
    setTodos((t) => t.filter((x) => x.id !== id));
  };
  const updateTodo = async (id, updates) => {
    const u = await mockDB.updateTodo(id, updates);
    setTodos((t) => t.map((x) => (x.id === id ? u : x)));
  };

  return (
    <TodoCtx.Provider value={{ todos, isLoading, error, addTodo, toggleTodo, deleteTodo, updateTodo }}>
      {children}
    </TodoCtx.Provider>
  );
};

// Sound — Web Audio synth, opt-in
const SoundCtx = React.createContext({ enabled: false, toggle: () => {} });
const useSoundCtx = () => React.useContext(SoundCtx);

let _audio = null;
const _ac = () => {
  if (!_audio) _audio = new (window.AudioContext || window.webkitAudioContext)();
  if (_audio.state === "suspended") _audio.resume();
  return _audio;
};

const _tone = (freq, dur, type = "sine", vol = 0.15, attack = 0.01, decay = 0.18) => {
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

const sounds = {
  click:    () => _tone(360, 0.08, "triangle", 0.10),
  tick:     () => { _tone(880, 0.04, "square", 0.05); _tone(440, 0.06, "triangle", 0.04); },
  complete: () => { _tone(660, 0.18, "sine", 0.12); setTimeout(() => _tone(880, 0.32, "sine", 0.14), 90); },
  gong:     () => { _tone(160, 0.6, "sine", 0.18); _tone(240, 0.6, "sine", 0.10); },
  creak:    () => _tone(120, 0.18, "sawtooth", 0.04),
};

const SoundProvider = ({ children }) => {
  const [enabled, setEnabled] = React.useState(() => {
    try { return localStorage.getItem("clearmind-sound-enabled") === "1"; } catch (e) { return false; }
  });
  const toggle = () => setEnabled((v) => {
    const n = !v;
    try { localStorage.setItem("clearmind-sound-enabled", n ? "1" : "0"); } catch (e) {}
    return n;
  });
  const play = React.useCallback((name) => {
    if (!enabled) return;
    try { sounds[name]?.(); } catch (e) {}
  }, [enabled]);
  return (
    <SoundCtx.Provider value={{ enabled, toggle, play }}>
      {children}
    </SoundCtx.Provider>
  );
};

const SoundToggle = () => {
  const { enabled, toggle } = useSoundCtx();
  return (
    <button
      className={"sound-toggle " + (enabled ? "on" : "")}
      onClick={toggle}
      aria-label={enabled ? "Mute sounds" : "Enable sounds"}
      aria-pressed={enabled}
      title={enabled ? "Sounds on" : "Sounds off"}
    >
      {enabled ? "🔊" : "🔇"}
    </button>
  );
};

// Focus trap hook for modals
const useFocusTrap = (ref, active) => {
  React.useEffect(() => {
    if (!active || !ref.current) return;
    const root = ref.current;
    const sel = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const els = () => Array.from(root.querySelectorAll(sel)).filter((e) => !e.disabled && e.offsetParent !== null);
    const onKey = (e) => {
      if (e.key !== "Tab") return;
      const list = els();
      if (!list.length) return;
      const first = list[0], last = list[list.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    root.addEventListener("keydown", onKey);
    setTimeout(() => { els()[0]?.focus(); }, 30);
    return () => root.removeEventListener("keydown", onKey);
  }, [active, ref]);
};

Object.assign(window, { TodoProvider, useTodos, SoundProvider, useSoundCtx, SoundToggle, useFocusTrap });
