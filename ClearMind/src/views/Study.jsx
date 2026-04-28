import React, { useState, useEffect, useRef } from 'react'; 
import useTaskStore from '../store/useTaskStore';
import './css/Study.css';

const ambientSounds = [
  { id: 'pluja', name: 'Pluja suau', file: '/sounds/pluja.mp3', icon: '🌧️' },
  { id: 'cafe', name: 'Cafeteria', file: '/sounds/cafeteria.mp3', icon: '☕' },
  { id: 'lofi', name: 'Ritmes Lo-Fi', file: '/sounds/lofi.mp3', icon: '🎧' }
];

const Study = () => {
  // --- ESTATS TASQUES ---
  const tasks = useTaskStore((state) => state.tasks);
  const addTask = useTaskStore((state) => state.addTask);
  const removeTask = useTaskStore((state) => state.removeTask);
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '' });
  const [selectedTask, setSelectedTask] = useState(null); 

  // --- ESTATS RELLOTGE ---
  const [isTimerMenuOpen, setIsTimerMenuOpen] = useState(false);
  const [timerMode, setTimerMode] = useState('temporitzador'); 
  const [time, setTime] = useState(25 * 60); 
  const [isActive, setIsActive] = useState(false);
  const [inputMinutes, setInputMinutes] = useState(25); 

  // --- ESTATS ÀUDIO ---
  const [isAudioMenuOpen, setIsAudioMenuOpen] = useState(false);
  const [currentSound, setCurrentSound] = useState(null); 
  const [isPlaying, setIsPlaying] = useState(false); 
  const audioRef = useRef(null); 
  
  // NOU: Estat per controlar el volum (de 0.0 a 1.0). Comencem al 50% (0.5)
  const [volume, setVolume] = useState(0.5); 

  // --- LÒGIQUES ---

  // NOU: Lògica per aplicar el volum a l'altaveu en temps real
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Lògica Rellotge
  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setTime((prevTime) => {
          if (timerMode === 'temporitzador') {
            if (prevTime <= 1) {
              clearInterval(interval);
              setIsActive(false);
              alert("Temps esgotat! Bona feina, toca descansar.");
              return 0;
            }
            return prevTime - 1;
          } else {
            return prevTime + 1;
          }
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, timerMode]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTime(timerMode === 'temporitzador' ? inputMinutes * 60 : 0);
  };
  const handleApplyTime = () => {
    setIsActive(false);
    setTime(inputMinutes * 60);
  };
  const handleChangeMode = (mode) => {
    setTimerMode(mode);
    setIsActive(false);
    setTime(mode === 'temporitzador' ? inputMinutes * 60 : 0);
  };
  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  // Lògica Tasques
  const handleOpenMenu = () => setIsMenuOpen(true);
  const handleCloseMenu = () => {
    setIsMenuOpen(false);
    setFormData({ title: '', description: '' }); 
  };
  const handleAddTaskSubmit = (e) => {
    e.preventDefault(); 
    if (formData.title.trim() === '') return;
    addTask({ id: Date.now(), title: formData.title, description: formData.description, completed: false }); 
    handleCloseMenu(); 
  };
  const handleCompleteTask = () => {
    if (selectedTask) {
      removeTask(selectedTask.id);
      setSelectedTask(null);
    }
  };

  // Lògica Àudio
  const handleToggleAudio = (sound) => {
    if (currentSound && currentSound.id === sound.id) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    } else {
      setCurrentSound(sound);
      setIsPlaying(true);
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.volume = volume; // Apliquem el volum al canviar de cançó
          audioRef.current.play();
        }
      }, 50);
    }
  };

  const handleStopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0; 
    }
    setIsPlaying(false);
    setCurrentSound(null);
  };

  return (
    <div className="study-desk-container">
      <audio ref={audioRef} src={currentSound ? currentSound.file : ''} loop />

      <div className="study-stage">
        {/* TABLERO DE SURO EN LA PARED */}
        <div className="taskboard-container">
          <div className="sticky-notes-grid">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="sticky-note"
                onClick={() => setSelectedTask(task)}
                style={{ '--rotation': `${Math.random() * 8 - 4}deg` }}
              >
                {task.title}
              </div>
            ))}
            {tasks.length === 0 && (
              <div className="taskboard-empty">
                Sense tasques pendent 🎉
              </div>
            )}
          </div>
        </div>

        {/* WRAPPER PARA LA PERSPECTIVA 3D */}
        <div className="desk-wrapper">
          {/* LA MESA EN 3D */}
          <div className="desk">
            {/* RELOJ DE ARENA */}
            <div className="desk-item" onClick={() => setIsTimerMenuOpen(true)}>
              <div className="desk-timer-display">{formatTime(time)}</div>
              <div className="hourglass-glass">
                <div className="hourglass-cap hourglass-cap-top"></div>
                <div className="hourglass-chamber">
                  <div className="hourglass-sand hourglass-sand-top"></div>
                  <div className="hourglass-sand-stream"></div>
                  <div className="hourglass-sand hourglass-sand-bottom"></div>
                </div>
                <div className="hourglass-cap hourglass-cap-bottom"></div>
              </div>
              <span className="desk-item-label">Temps</span>
            </div>

            {/* LÁPIZ */}
            <div className="desk-item" onClick={handleOpenMenu}>
              <div className="pencil-set">
                <div className="pencil-case"></div>
                <div className="pencil-holder">
                  <div className="pencil pencil-primary">
                    <div className="pencil-body"></div>
                    <div className="pencil-tip"></div>
                  </div>
                  <div className="pencil pencil-secondary">
                    <div className="pencil-body"></div>
                    <div className="pencil-tip"></div>
                  </div>
                  <div className="pencil pencil-tertiary">
                    <div className="pencil-body"></div>
                    <div className="pencil-tip"></div>
                  </div>
                </div>
              </div>
              <span className="desk-item-label">Tasca</span>
            </div>

            {/* ALTAVOZ */}
            <div className="desk-item" onClick={() => setIsAudioMenuOpen(true)}>
              <div className={`speaker-box ${isPlaying ? 'playing' : ''}`}>
                <div className="speaker-box-front">
                  <div className="speaker-cone"></div>
                  <div className="speaker-grille"></div>
                </div>
                <div className="speaker-waves"></div>
              </div>
              <span className="desk-item-label">Àudio</span>
            </div>
          </div>
        </div>
      </div>

      {/* --- MODAL DE SO AMBIENT --- */}
      {isAudioMenuOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={() => setIsAudioMenuOpen(false)}>✕</button>
            <h2 className="modal-title">🔊 Sons per Concentrar-te</h2>
            <p style={{ color: '#718096', marginBottom: '20px' }}>Tria un fons sonor pel teu escriptori.</p>
            
            <div className="sound-buttons">
              {ambientSounds.map((sound) => {
                const isThisSoundPlaying = currentSound?.id === sound.id && isPlaying;
                return (
                  <button 
                    key={sound.id} 
                    onClick={() => handleToggleAudio(sound)} 
                    className={`sound-button ${isThisSoundPlaying ? 'playing' : ''}`}
                  >
                    <span className="sound-icon">{sound.icon}</span>
                    <div className="sound-info">
                      <div className="sound-name">{sound.name}</div>
                      {isThisSoundPlaying && <div className="sound-status">▶ Sonant</div>}
                    </div>
                    <span>{isThisSoundPlaying ? '⏸' : '▶'}</span>
                  </button>
                );
              })}
            </div>

            {/* CONTROL DE VOLUM */}
            <div className="volume-control">
              <span style={{ fontSize: '18px' }}>🔈</span>
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.01" 
                value={volume} 
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="volume-slider"
              />
              <span style={{ fontSize: '12px', color: '#718096', minWidth: '35px' }}>{Math.round(volume * 100)}%</span>
            </div>

            {/* Controls d'apagada */}
            <div className="btn-group">
              <button onClick={handleStopAudio} disabled={!currentSound} className="btn btn-danger" style={{ opacity: currentSound ? 1 : 0.5 }}>
                ⏹ Apagar
              </button>
              <button onClick={() => setIsAudioMenuOpen(false)} className="btn btn-secondary">
                Tancar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL RELLOTGE --- */}
      {isTimerMenuOpen && ( 
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={() => setIsTimerMenuOpen(false)}>✕</button>
            <h2 className="modal-title">⏱️ Configura el Temps</h2>
            
            <div className="mode-tabs">
              <button 
                className={`mode-tab ${timerMode === 'temporitzador' ? 'active' : ''}`}
                onClick={() => handleChangeMode('temporitzador')}
              >
                Temporitzador
              </button>
              <button 
                className={`mode-tab ${timerMode === 'cronometre' ? 'active' : ''}`}
                onClick={() => handleChangeMode('cronometre')}
              >
                Cronòmetre
              </button>
            </div>

            {timerMode === 'temporitzador' && (
              <div className="form-group">
                <label className="form-label">Minuts:</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input 
                    type="number" 
                    min="1" 
                    max="120" 
                    value={inputMinutes} 
                    onChange={(e) => setInputMinutes(e.target.value)}
                    className="form-input"
                    style={{ flex: 1 }}
                  />
                  <button onClick={handleApplyTime} className="btn btn-secondary">Aplicar</button>
                </div>
              </div>
            )}

            {timerMode === 'cronometre' && (
              <p style={{ color: '#718096', padding: '15px', textAlign: 'center' }}>
                Comptarà el temps de 0 cap amunt ⬆️
              </p>
            )}

            <div className={`timer-display ${isActive ? 'active' : ''}`}>
              {formatTime(time)}
            </div>

            <div className="timer-controls">
              <button 
                onClick={toggleTimer} 
                className="btn btn-primary"
              >
                {isActive ? '⏸ Pausar' : '▶ Començar'}
              </button>
              <button 
                onClick={resetTimer} 
                className="btn btn-secondary"
              >
                🔄 Reiniciar
              </button>
            </div>

            <div style={{ marginTop: '15px' }}>
              <button onClick={() => setIsTimerMenuOpen(false)} className="btn btn-secondary" style={{ width: '100%' }}>
                Tancar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL CREAR TASCA --- */}
      {isMenuOpen && ( 
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={handleCloseMenu}>✕</button>
            <h2 className="modal-title">✏️ Apunta la Tasca</h2>
            <form onSubmit={handleAddTaskSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              
              <div className="form-group">
                <label className="form-label">Títol:</label>
                <input 
                  type="text" 
                  maxLength={35} 
                  value={formData.title} 
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ex: Llegir tema 3"
                  className="form-input"
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label className="form-label">Descripció:</label>
                <textarea 
                  value={formData.description} 
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Afegeix detalls..."
                  className="form-textarea"
                />
              </div>

              <div className="btn-group">
                <button type="button" onClick={handleCloseMenu} className="btn btn-secondary">
                  Cancel·lar
                </button>
                <button type="submit" className="btn btn-primary">
                  📌 Penjar al Suro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL VEURE/BORRAR TASCA --- */}
      {selectedTask && ( 
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '380px' }}>
            <h2 className="modal-title" style={{ wordBreak: 'break-word', borderBottom: '2px solid #1ABC9C', paddingBottom: '15px' }}>
              📝 {selectedTask.title}
            </h2>
            
            <div style={{ marginTop: '20px', minHeight: '80px' }}>
              <p style={{ color: '#718096', lineHeight: '1.6' }}>
                {selectedTask.description ? selectedTask.description : <i>Sense descripció addicional.</i>}
              </p>
            </div>

            <div className="btn-group" style={{ marginTop: '30px' }}>
              <button onClick={() => setSelectedTask(null)} className="btn btn-secondary">
                ← Tornar
              </button>
              <button onClick={handleCompleteTask} className="btn btn-primary">
                ✅ Tasca Feta!
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Study;