import React, { useState, useEffect } from 'react';
import './css/Relax.css';

const meditationGuides = [
  {
    id: 'm1',
    title: 'Respiració Conscient',
    description: '5 minuts de respiració guiada per calmar la ment.',
    steps: [
      'Seu amb l\'esquena recta.',
      'Inspira pel nas (4s).',
      'Mantén l\'aire (2s).',
      'Expira per la boca (6s).',
      'Repeteix el cicle.'
    ]
  },
  {
    id: 'm2',
    title: 'Escaneig Corporal',
    description: '10 minuts per relaxar cada zona del cos.',
    steps: [
      'Tanca els ulls.',
      'Atenció als peus.',
      'Puja per les cames.',
      'Relaxa abdomen i pit.',
      'Relaxa espatlles i cara.'
    ]
  },
  {
    id: 'm3',
    title: 'Visualització',
    description: '8 minuts per recuperar la calma.',
    steps: [
      'Imagina un lloc segur.',
      'Afegeix-hi sons i colors.',
      'Sente\'t protegit.',
      'Allibera preocupacions.',
      'Torna al present.'
    ]
  }
];

const Relax = () => {
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathStage, setBreathStage] = useState('Inspirar'); // Inspirar, Mantenir, Expirar

  // Lògica simple per la respiració
  useEffect(() => {
    let timer;
    if (isBreathing) {
      if (breathStage === 'Inspirar') {
        timer = setTimeout(() => setBreathStage('Mantenir'), 4000);
      } else if (breathStage === 'Mantenir') {
        timer = setTimeout(() => setBreathStage('Expirar'), 2000);
      } else {
        timer = setTimeout(() => setBreathStage('Inspirar'), 6000);
      }
    }
    return () => clearTimeout(timer);
  }, [isBreathing, breathStage]);

  return (
    <div className="relax-container">
      <section className="relax-layout">
        
        {/* COLUMNA ESQUERRA: GUIES */}
        <div className="relax-panel guides-panel">
          <div className="panel-header">
            <h2>GUIES</h2>
          </div>
          <div className="guides-list-container">
            {meditationGuides.map(guide => (
              <button 
                key={guide.id} 
                className={`guide-btn ${selectedGuide?.id === guide.id ? 'active' : ''}`}
                onClick={() => setSelectedGuide(guide)}
              >
                {guide.title}
              </button>
            ))}
          </div>
          {selectedGuide && (
            <div className="guide-details-box">
              <h3>{selectedGuide.title}</h3>
              <ol>
                {selectedGuide.steps.map((s, i) => <li key={i}>{s}</li>)}
              </ol>
            </div>
          )}
        </div>

        {/* CENTRE: RESPIRACIÓ (CERCLE ANIMAT) */}
        <div className="relax-center">
          <div 
            className={`breathing-circle ${isBreathing ? breathStage.toLowerCase() : ''}`}
            onClick={() => {
              setIsBreathing(!isBreathing);
              setBreathStage('Inspirar');
            }}
          >
            <span className="breath-text">
              {isBreathing ? breathStage : 'COMENÇAR'}
            </span>
          </div>
          <p className="relax-hint">
            {isBreathing ? 'Segueix el ritme del cercle' : 'Clica el cercle per respirar'}
          </p>
        </div>

        {/* COLUMNA DRETA: CONSELLS / INFO */}
        <div className="relax-panel tips-panel">
          <div className="panel-header">
            <h2>RECORDA</h2>
          </div>
          <div className="tips-content">
            <div className="tip-card">Redueix distraccions.</div>
            <div className="tip-card">Troba un lloc còmode.</div>
            <div className="tip-card">No et jutgis si et distreus.</div>
            <div className="tip-card">Torna a la respiració.</div>
          </div>
        </div>

      </section>
    </div>
  );
};

export default Relax;
