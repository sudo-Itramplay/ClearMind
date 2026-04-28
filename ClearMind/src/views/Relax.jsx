import React, { useState } from 'react';
import './css/Relax.css';
import buddhImage from '../images/cute-buddha-in-prayer-pose-2d-flat-cartoon-illustration-free-vector.jpg';

const meditationGuides = [
  { id: 'm1', title: 'Respiració Conscient', description: '5 minuts de respiració guiada per calmar la ment.' },
  { id: 'm2', title: 'Escaneig Corporal', description: '10 minuts per notar tensions i relaxar el cos.' },
  { id: 'm3', title: 'Visualització', description: '8 minuts de visualització guiada per centrar-te.' }
];

const Relax = () => {
  const [isGuidesOpen, setIsGuidesOpen] = useState(false);
  const [selectedGuide, setSelectedGuide] = useState(null);

  const openGuides = () => setIsGuidesOpen(true);
  const closeGuides = () => {
    setIsGuidesOpen(false);
    setSelectedGuide(null);
  };

  const startGuide = (guide) => {
    setSelectedGuide(guide);
    // Aquí podríamos iniciar un temporitzador o redirigir a la sessió
  };

  return (
    <section className="relax-root">
      <header className="relax-header">
        <h1>El Refugi — Benestar</h1>
        <p>Espai per desconnexió i meditació</p>
      </header>

      <main className="relax-main">
        <div className="room-left">
          <p>Zona d'activitats suaus.</p>
        </div>

        <div className="room-right" aria-label="Habitació de Benestar">
          <div className="cushions-ellipse">
            {/* Buda grande en el centro */}
            <button
              className="buddha-button"
              onClick={openGuides}
              aria-label="Buda i guies de meditació"
            >
              <img src={buddhImage} alt="Buda meditando" className="buddha-figure-large" />
            </button>

            {/* Generem 6 coixins al voltant d'una elipse */}
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className={`cushion cushion-${i + 3}`}
              />
            ))}

            <div className="rug" />
          </div>
        </div>
      </main>

      {isGuidesOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '480px' }}>
            <button className="modal-close" onClick={closeGuides}>✕</button>
            <h2 className="modal-title">Guies de Meditació</h2>
            <p style={{ color: '#718096' }}>Tria una guia per començar:</p>
            <div className="guides-list">
              {meditationGuides.map((g) => (
                <div key={g.id} className={`guide-item ${selectedGuide?.id === g.id ? 'active' : ''}`}>
                  <div className="guide-info">
                    <div className="guide-title">{g.title}</div>
                    <div className="guide-desc">{g.description}</div>
                  </div>
                  <div className="guide-actions">
                    <button className="btn btn-secondary" onClick={() => startGuide(g)}>Seleccionar</button>
                  </div>
                </div>
              ))}
            </div>

            {selectedGuide && (
              <div style={{ marginTop: 16 }}>
                <div style={{ color: '#2C3E50', fontWeight: '700' }}>Activa: {selectedGuide.title}</div>
                <p style={{ color: '#667085' }}>{selectedGuide.description}</p>
                <div className="btn-group">
                  <button className="btn btn-primary" onClick={() => alert(`Iniciant ${selectedGuide.title}`)}>Iniciar</button>
                  <button className="btn btn-secondary" onClick={() => setSelectedGuide(null)}>Cancelar</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default Relax;
