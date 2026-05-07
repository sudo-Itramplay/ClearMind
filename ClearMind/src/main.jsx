import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'

/* Sistema de disseny nou — primer per a les variables CSS */
import './styles/globals.css'
/* Estils existents de les vistes (Hall, Study, Relax) */
import './assets/index.css'

/* Vistes del nou sistema de disseny */
import Dashboard from './views/Dashboard.jsx'

/* Vistes principals de l'aplicació */
import Hall  from './views/Hall.jsx'
import Study from './views/Study.jsx'
import Relax from './views/Relax.jsx'

/* Components del layout antic — mantinguts per compatibilitat */
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'

/* Context global de tasques */
import { TodoProvider } from './context/TodoContext.jsx'

/*
 * Layout per a les vistes principals (Hall, Study, Relax).
 * Renderitza el Header i Footer originals al voltant del contingut.
 */
function LegacyLayout() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TodoProvider>
      <BrowserRouter>
        <Routes>
          {/* La sala (Hall) és la pàgina d'inici de l'aplicació */}
          <Route path="/" element={<Navigate to="/hall" replace />} />

          {/* Dashboard — conservat però no és la pàgina per defecte */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Vistes principals — conserven el seu layout original */}
          <Route element={<LegacyLayout />}>
            <Route path="/hall"  element={<Hall />}  />
            <Route path="/study" element={<Study />} />
            <Route path="/relax" element={<Relax />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TodoProvider>
  </StrictMode>,
)
