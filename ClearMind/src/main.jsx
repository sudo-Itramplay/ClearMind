import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './assets/index.css'

// Vistes
import Hall from './views/Hall.jsx'
import Study from './views/Study.jsx' 
import Relax from './views/Relax.jsx' 

// Components persistents
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'

// IMPORT THE CONTEXT PROVIDER
import { TodoProvider } from './context/TodoContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TodoProvider>
      <BrowserRouter>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Header />
          <main style={{ flex: 1 }}>
            <Routes>
              {/* Redirect root (/) to /hall */}
              <Route path="/" element={<Navigate to="/hall" replace />} />
              
              {/* Update the path for Hall to /hall */}
              <Route path="/hall" element={<Hall />} />
              <Route path="/study" element={<Study />} />
              <Route path="/relax" element={<Relax />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </TodoProvider>
  </StrictMode>,
)
