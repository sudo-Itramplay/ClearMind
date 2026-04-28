import React, { useState } from 'react';
import './css/Relax.css';
import buddhImage from '../images/cute-buddha-in-prayer-pose-2d-flat-cartoon-illustration-free-vector.jpg';

const meditationGuides = [
  {
    id: 'm1',
    title: 'Respiració Conscient',
    description: '5 minuts de respiració guiada per calmar la ment i reduir l\'estrès.',
    steps: [
      'Seu amb l\'esquena recta i relaxa les espatlles.',
      'Tanca els ulls i inspira lentament pel nas durant 4 segons.',
      'Mantén l\'aire 2 segons sense forçar.',
      'Expira suaument per la boca durant 6 segons.',
      'Repeteix el cicle durant 5 minuts, tornant a la respiració quan et distreguis.'
    ]
  },
  {
    id: 'm2',
    title: 'Escaneig Corporal',
    description: '10 minuts per detectar tensions i relaxar cada zona del cos.',
    steps: [
      'Estira\'t o seu còmodament i tanca els ulls.',
      'Porta l\'atenció als peus i observa sensacions sense jutjar.',
      'Puja lentament per cames, abdomen, pit i esquena.',
      'Quan notis tensió, inspira profund i expira relaxant aquella zona.',
      'Acaba amb 3 respiracions profundes i obre els ulls a poc a poc.'
    ]
  },
  {
    id: 'm3',
    title: 'Visualització',
    description: '8 minuts de visualització guiada per centrar-te i recuperar calma.',
    steps: [
      'Seu en silenci i respira profundament durant 1 minut.',
      'Imagina un lloc segur i tranquil (platja, bosc o muntanya).',
      'Afegeix detalls: sons, colors, temperatura i textures.',
      'Visualitza que amb cada exhalació alliberes preocupacions.',
      'Mantén aquesta imatge 5 minuts i torna gradualment al present.'
    ]
  }
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
                <div
                  key={g.id}
                  className={`guide-item ${selectedGuide?.id === g.id ? 'active' : ''}`}
                  onClick={() => startGuide(g)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      startGuide(g);
                    }
                  }}
                >
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
              <div className="guide-detail">
                <div className="guide-detail-title">Activa: {selectedGuide.title}</div>
                <p className="guide-detail-desc">{selectedGuide.description}</p>

                <div className="guide-steps-title">Pas a pas</div>
                <ol className="guide-steps-list">
                  {selectedGuide.steps.map((step, index) => (
                    <li key={`${selectedGuide.id}-step-${index}`}>{step}</li>
                  ))}
                </ol>

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
