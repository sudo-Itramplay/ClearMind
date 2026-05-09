import React, { useEffect, useState } from 'react';
import { TodoProvider } from './context/TodoContext';
import { SoundProvider } from './context/SoundContext';
import RoomPills from './components/ui/RoomPills';
import SoundToggle from './components/ui/SoundToggle';
import Hall from './components/hall/Hall';
import Study from './components/study/Study';
import Meditate from './components/meditate/Meditate';

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
  const go = (p) => { window.location.hash = "#" + p; };
  return [page, go];
};

const Shell = () => {
  const [page, go] = useHashRoute();
  return (
    <div className="app">
      <RoomPills page={page} go={go} />
      <SoundToggle />
      <div key={page} className="room-stage">
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
