import React, { useEffect, useState } from 'react';
import { TodoProvider } from './context/TodoContext';
import { SoundProvider } from './context/SoundContext';
import { ToastProvider } from './context/ToastContext';
import RoomPills from './components/ui/RoomPills';
import SoundToggle from './components/ui/SoundToggle';
import Hall from './views/Hall/Hall';
import Study from './views/Study/Study';
import Meditate from './views/Meditate/Meditate';

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
    <ToastProvider>
      <TodoProvider>
        <Shell />
      </TodoProvider>
    </ToastProvider>
  </SoundProvider>
);

export default App;
