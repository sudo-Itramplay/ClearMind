import React, { useEffect, useState } from 'react';
import { TodoProvider } from './context/TodoContext';
import { ExamProvider } from './context/ExamContext';
import { AuthProvider } from './context/AuthContext';
import { SoundProvider } from './context/SoundContext';
import { ToastProvider } from './context/ToastContext';
import { GlobalQuickAddProvider } from './components/GlobalQuickAddProvider';
import RoomPills from './components/ui/RoomPills';
import SoundToggle from './components/ui/SoundToggle';
import AuthButton from './components/ui/AuthButton';
import Hall from './views/Hall/Hall';
import Study from './views/Study/Study';
import Meditate from './views/Meditate/Meditate';
import {
  KeymapProvider,
  KeymapDefaults,
  Cheatsheet,
  CheatsheetButton,
  useKeyAction,
} from './features/keybindings';

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
  const [helpOpen, setHelpOpen] = useState(false);

  // Bindings whose dependencies live here register here. Anything tied to
  // Study state (e.g. `q` -> openQuick) registers from inside Study.
  useKeyAction("goHall",     () => go("hall"));
  useKeyAction("goStudy",    () => go("study"));
  useKeyAction("goMeditate", () => go("meditate"));
  useKeyAction("toggleHelp", () => setHelpOpen((o) => !o));

  return (
    <div className="app">
      <RoomPills page={page} go={go} />
      <SoundToggle />
      <AuthButton />
      <CheatsheetButton onClick={() => setHelpOpen(true)} />
      <div key={page} className="room-stage">
        {page === "hall"     && <Hall go={go} />}
        {page === "study"    && <Study go={go} />}
        {page === "meditate" && <Meditate go={go} />}
      </div>
      <Cheatsheet open={helpOpen} onClose={() => setHelpOpen(false)} />
    </div>
  );
};

const App = () => (
  <SoundProvider>
    <ToastProvider>
      <AuthProvider>
        <TodoProvider>
          <ExamProvider>
            <KeymapProvider>
              <KeymapDefaults />
              <GlobalQuickAddProvider>
                <Shell />
              </GlobalQuickAddProvider>
            </KeymapProvider>
          </ExamProvider>
        </TodoProvider>
      </AuthProvider>
    </ToastProvider>
  </SoundProvider>
);

export default App;
