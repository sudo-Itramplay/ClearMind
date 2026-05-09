import React, { useState, useEffect } from 'react';
import { TodoProvider, SoundProvider, SoundToggle } from './context/AppContext';
import Hall from './components/Hall';
import Study from './components/Study';
import Meditate from './components/Meditate';

const ROUTES = ["hall", "study", "meditate"];
const PILL_ORDER = ["study", "hall", "meditate"];

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
  const go = (p) => { window.location.hash = "#" + p; };
  return [page, go];
};

const RoomPills = ({ page, go }) => (
  <nav className="room-pills" aria-label="Rooms">
    {PILL_ORDER.map((r) => (
      <button
        key={r}
        type="button"
        onClick={() => go(r)}
        aria-current={page === r ? "page" : undefined}
        aria-label={`Go to ${r}`}
      >
        {r}
      </button>
    ))}
  </nav>
);

const Shell = () => {
  const [page, go] = useHashRoute();
  return (
    <div className="app">
      <RoomPills page={page} go={go} />
      <SoundToggle />
      <div key={page} style={{ position: "absolute", inset: 0 }}>
        {page === "hall"     && <Hall go={go} />}
        {page === "study"    && <Study go={go} />}
        {page === "meditate" && <Meditate go={go} />}
      </div>
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
