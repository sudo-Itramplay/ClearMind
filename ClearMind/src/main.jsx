import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
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
    {/* Wrap everything inside the TodoProvider */}
    <TodoProvider>
      <BrowserRouter>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Header />
          <main style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<Hall />} />
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
