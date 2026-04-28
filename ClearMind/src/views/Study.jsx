import React, { useState, useEffect, useRef } from 'react'; 
import { useTodos } from '../context/TodoContext';
import './css/Study.css';

const ambientSounds = [
  { id: 'pluja', name: 'Pluja suau', file: '/sounds/pluja.mp3', icon: '🌧️' },
  { id: 'cafe', name: 'Cafeteria', file: '/sounds/cafeteria.mp3', icon: '☕' },
  { id: 'lofi', name: 'Ritmes Lo-Fi', file: '/sounds/lofi.mp3', icon: '🎧' }
];

const Study = () => {
  // --- ESTATS TASQUES (ARA USANT CONTEXT) ---
  const { todos, addTodo, toggleTodo } = useTodos();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [formData, setFormData] = useState({ task: '', description: '' });
  const [selectedTask, setSelectedTask] = useState(null); 

  // --- ESTATS RELLOTGE ---
  const [timerMode, setTimerMode] = useState('temporitzador'); 
  const [time, setTime] = useState(25 * 60); 
  const [isActive, setIsActive] = useState(false);
  const [inputMinutes, setInputMinutes] = useState(25); 

  // --- ESTATS ÀUDIO ---
  const [currentSound, setCurrentSound] = useState(null); 
  const [isPlaying, setIsPlaying] = useState(false); 
  const audioRef = useRef(null); 
  const [volume, setVolume] = useState(0.5); 

  // --- LÒGIQUES ---

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setTime((prevTime) => {
          if (timerMode === 'temporitzador') {
            if (prevTime <= 1) {
              clearInterval(interval);
              setIsActive(false);
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

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const handleAddTaskSubmit = (e) => {
    e.preventDefault(); 
    if (formData.task.trim() === '') return;
    addTodo({ 
      id: Date.now(), 
      task: formData.task, 
      description: formData.description, 
      completed: false 
    }); 
    setFormData({ task: '', description: '' });
    setIsMenuOpen(false);
  };

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
          audioRef.current.play();
        }
      }, 50);
    }
  };

  return (
    <div className="study-container">
      <audio ref={audioRef} src={currentSound ? currentSound.file : ''} loop />

      <section className="study-layout">
        
        {/* COLUMNA ESQUERRA: TASQUES */}
        <div className="study-panel tasks-panel">
          <div className="panel-header">
            <h2>TASQUES</h2>
            <button className="add-btn" onClick={() => setIsMenuOpen(true)}>+</button>
          </div>
          <div className="tasks-list-container">
            {todos.length > 0 ? (
              <ul className="simple-task-list">
                {[...todos].sort((a, b) => a.completed - b.completed).map(todo => (
                  <li key={todo.id} onClick={() => setSelectedTask(todo)} className={todo.completed ? 'done' : ''}>
                    {todo.task}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="empty-msg">Tot llest!</p>
            )}
          </div>
        </div>

        {/* CENTRE: TIMER (CERCLE) */}
        <div className="study-center">
          <div className={`timer-circle ${isActive ? 'active' : ''}`} onClick={toggleTimer}>
            <span className="timer-val">{formatTime(time)}</span>
            <span className="timer-label">{isActive ? 'PAUSA' : 'INICI'}</span>
          </div>
          <div className="timer-actions">
            <button onClick={resetTimer}>REINICIAR</button>
            <div className="timer-settings">
              <input 
                type="number" 
                value={inputMinutes} 
                onChange={(e) => {
                  setInputMinutes(e.target.value);
                  if(!isActive) setTime(e.target.value * 60);
                }}
              />
              <span>min</span>
            </div>
          </div>
        </div>

        {/* COLUMNA DRETA: ÀUDIO */}
        <div className="study-panel audio-panel">
          <div className="panel-header">
            <h2>ÀUDIO</h2>
          </div>
          <div className="audio-options">
            {ambientSounds.map(sound => (
              <button 
                key={sound.id} 
                className={`audio-btn ${currentSound?.id === sound.id && isPlaying ? 'active' : ''}`}
                onClick={() => handleToggleAudio(sound)}
              >
                {sound.icon} {sound.name}
              </button>
            ))}
            <div className="volume-slider-container">
              <span>Volum</span>
              <input 
                type="range" 
                min="0" max="1" step="0.1" 
                value={volume} 
                onChange={(e) => setVolume(e.target.value)} 
              />
            </div>
          </div>
        </div>

      </section>

      {/* MODAL CREAR TASCA */}
      {isMenuOpen && (
        <div className="simple-modal-overlay">
          <div className="simple-modal">
            <h3>Nova Tasca</h3>
            <form onSubmit={handleAddTaskSubmit}>
              <input 
                type="text" 
                placeholder="Què vols fer?" 
                value={formData.task} 
                onChange={e => setFormData({...formData, task: e.target.value})}
                autoFocus
              />
              <textarea 
                placeholder="Detalls (opcional)" 
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})}
              />
              <div className="modal-btns">
                <button type="button" onClick={() => setIsMenuOpen(false)}>CANCEL·LAR</button>
                <button type="submit" className="primary">AFEGIR</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL VEURE/COMPLETAR TASCA */}
      {selectedTask && (
        <div className="simple-modal-overlay">
          <div className="simple-modal">
            <h3 className={selectedTask.completed ? 'done' : ''}>{selectedTask.task}</h3>
            <p>{selectedTask.description || 'Sense descripció'}</p>
            <div className="modal-btns">
              <button onClick={() => setSelectedTask(null)}>TANCAR</button>
              <button className="primary" onClick={() => {
                toggleTodo(selectedTask.id);
                setSelectedTask(null);
              }}>
                {selectedTask.completed ? 'DESFER' : 'FET!'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Study;