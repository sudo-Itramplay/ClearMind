import React, { useState, useEffect } from 'react';
import { TodoProvider } from './context/AppContext';
import { SoundProvider, SoundToggle } from './context/AppContext';
import Hall from './components/Hall';
import Study from './components/Study';
import Meditate from './components/Meditate';

const ROUTES = ["hall", "study", "meditate"];

const useHashRoute = () => {
  const get = () => {
    const h = (window.location.hash || "#hall").replace(/^#\/?/, "");
    return ROUTES.includes(h) ? h : "hall";
  };
  const [page, setPage] = useState(get);
  useEffect(() => {
    const onHash = () => setPage(get());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  const go = (p) => {
    window.location.hash = "#" + p;
  };
  return [page, go];
};

const Shell = () => {
  const [page, go] = useHashRoute();
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(id);
  }, []);
  const fmtTime = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return (
    <div className="app">
      <header className="app-header" role="banner">
        <span className="app-brand">ClearMind</span>
        <nav className="app-nav" aria-label="Rooms">
          {ROUTES.map((r) => (
            <button key={r}
              onClick={() => go(r)}
              aria-current={page === r ? "page" : undefined}>
              {r[0].toUpperCase() + r.slice(1)}
            </button>
          ))}
        </nav>
      </header>
      <SoundToggle />
      <div key={page} style={{ position: "absolute", inset: 0 }}>
        {page === "hall"     && <Hall go={go} />}
        {page === "study"    && <Study go={go} />}
        {page === "meditate" && <Meditate go={go} />}
      </div>
      <footer className="app-footer" role="contentinfo">
        <span>ClearMind · A cozy mind-care space</span>
        <span>{fmtTime}</span>
        <span>v0.2 · Prototype</span>
      </footer>
    </div>
  );
};

const App = () => (
  <SoundProvider>
    <TodoProvider>
      <Shell />
    </TodoProvider>
  </SoundProvider>
);

export default App;
