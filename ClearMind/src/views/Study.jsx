import React, { useState, useEffect, useRef } from 'react'; 
import useTaskStore from '../store/useTaskStore';

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
    <section id="center" style={{ padding: '30px', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'flex-start', gap: '40px', width: '100%', boxSizing: 'border-box', backgroundColor: '#ffffff', minHeight: '100vh' }}>
      
      <audio ref={audioRef} src={currentSound ? currentSound.file : ''} loop />

      {/* COLUMNA ESQUERRA: Controls */}
      <div style={{ flex: '1 1 280px', maxWidth: '320px', display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'center', backgroundColor: '#F8F9FA', padding: '20px', borderRadius: '12px' }}>
        <div>
          <h1 style={{ margin: '0 0 5px 0', color: '#2C3E50' }}>L'Escriptori</h1>
          <p style={{ color: '#7F8C8D', margin: 0 }}>Zona d'alta concentració.</p>
        </div>
        
        <div style={{ background: '#ffffff', padding: '20px', borderRadius: '8px', border: '1px solid #E9ECEF' }}>
          <button onClick={() => setIsTimerMenuOpen(true)} style={{ padding: '10px 15px', fontSize: '15px', cursor: 'pointer', background: 'transparent', border: '1px solid #CED4DA', borderRadius: '6px', color: '#495057', width: '100%' }}>
            ⏱️ Rellotge de la taula
          </button>
          <div style={{ marginTop: '15px', fontSize: '32px', fontWeight: 'bold', fontFamily: 'monospace', color: isActive ? '#E74C3C' : '#2C3E50' }}>
            {formatTime(time)} 
            {isActive && <div style={{fontSize: '12px', color: '#E74C3C', marginTop: '5px'}}>Corrent...</div>}
          </div>
        </div>

        <button onClick={() => setIsAudioMenuOpen(true)} style={{ padding: '12px 15px', fontSize: '15px', cursor: 'pointer', background: isPlaying ? '#E8F8F5' : '#ffffff', border: `1px solid ${isPlaying ? '#1ABC9C' : '#E9ECEF'}`, borderRadius: '8px', color: '#495057', width: '100%', display: 'flex', justifyContent: 'center', gap: '10px', alignItems: 'center' }}>
          <span>🔊 So Ambient</span>
          {isPlaying && <span style={{ fontSize: '12px', color: '#1ABC9C', fontWeight: 'bold' }}>▶ Sonant</span>}
        </button>

        <button onClick={handleOpenMenu} style={{ padding: '12px 15px', fontSize: '15px', cursor: 'pointer', background: '#34495E', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          ✏️ Agafar el llapis
        </button>
      </div>

      {/* COLUMNA DRETA: El Suro */}
      <div style={{ flex: '1 1 0%', minWidth: '300px', width: '100%' }}>
        <div style={{ background: '#C19A6B', padding: '30px', borderRadius: '8px', width: '100%', height: '600px', boxSizing: 'border-box', position: 'relative', overflowY: 'auto', boxShadow: 'inset 0 0 10px rgba(0,0,0,0.1)' }}>
          <h2 style={{ marginTop: 0, color: '#3E2723', borderBottom: '1px dashed #A1887F', paddingBottom: '10px' }}>Tauler de Suro</h2>
          {tasks.length === 0 ? (
            <p style={{ color: '#4E342E', fontSize: '1.1rem' }}>No tens cap tasca pendent. Quin descans!</p>
          ) : (
            <ul style={{ listStyleType: 'none', padding: 0, display: 'flex', flexWrap: 'wrap', gap: '20px', alignContent: 'flex-start' }}>
              {tasks.map(task => (
                <li key={task.id} onClick={() => setSelectedTask(task)} style={{ background: '#FFF59D', padding: '15px', width: '130px', height: '130px', boxShadow: '2px 2px 5px rgba(0,0,0,0.15)', color: '#212121', display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden', wordBreak: 'break-word', textAlign: 'center', fontWeight: 'bold', fontFamily: 'sans-serif', fontSize: '14px', transform: `rotate(${Math.random() * 8 - 4}deg)`, cursor: 'pointer' }}>
                  {task.title}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* --- MODAL DE SO AMBIENT --- */}
      {isAudioMenuOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0, 0, 0, 0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(3px)' }}>
          <div style={{ background: 'white', padding: '30px', borderRadius: '12px', width: '380px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', textAlign: 'center' }}>
            <h2 style={{ color: '#2C3E50', marginTop: 0 }}>Sons per concentrar-te</h2>
            <p style={{ color: '#718096', marginBottom: '25px' }}>Tria un fons sonor pel teu escriptori.</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '20px' }}>
              {ambientSounds.map((sound) => {
                const isThisSoundPlaying = currentSound?.id === sound.id && isPlaying;
                return (
                  <button key={sound.id} onClick={() => handleToggleAudio(sound)} style={{ padding: '15px', cursor: 'pointer', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '15px', background: isThisSoundPlaying ? '#2E7D32' : '#F7FAFC', color: isThisSoundPlaying ? 'white' : '#2D3748', border: `2px solid ${isThisSoundPlaying ? '#2E7D32' : '#E2E8F0'}` }}>
                    <span style={{ fontSize: '24px' }}>{sound.icon}</span>
                    <span style={{ flex: 1, textAlign: 'left' }}>{sound.name}</span>
                    <span>{isThisSoundPlaying ? '⏸' : '▶'}</span>
                  </button>
                )
              })}
            </div>

            {/* NOU: CONTROL DE VOLUM */}
            <div style={{ marginBottom: '25px', textAlign: 'left', background: '#F8F9FA', padding: '15px', borderRadius: '8px' }}>
              <label style={{ display: 'flex', justifyContent: 'space-between', color: '#4A5568', fontWeight: 'bold', marginBottom: '10px' }}>
                <span>🔈 Volum</span>
                <span>{Math.round(volume * 100)}%</span>
              </label>
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.01" 
                value={volume} 
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                style={{ width: '100%', cursor: 'pointer' }}
              />
            </div>

            {/* Controls d'apagada i tancament */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={handleStopAudio} disabled={!currentSound} style={{ flex: 1, padding: '12px', cursor: currentSound ? 'pointer' : 'not-allowed', background: '#FEE2E2', color: '#C53030', border: 'none', borderRadius: '6px', fontWeight: 'bold', opacity: currentSound ? 1 : 0.5 }}>
                ⏹ Apagar so
              </button>
              <button onClick={() => setIsAudioMenuOpen(false)} style={{ flex: 1, padding: '12px', cursor: 'pointer', background: 'transparent', border: '2px solid #CBD5E0', color: '#4A5568', borderRadius: '6px', fontWeight: 'bold' }}>
                Tancar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Rellotge */}
      {isTimerMenuOpen && ( <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0, 0, 0, 0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(3px)' }}> <div style={{ background: 'white', padding: '30px', borderRadius: '12px', width: '380px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', textAlign: 'center' }}> <h2 style={{ color: '#2C3E50', marginTop: 0 }}>Configura el Temps</h2> <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '25px' }}> <button onClick={() => handleChangeMode('temporitzador')} style={{ flex: 1, padding: '10px', cursor: 'pointer', border: 'none', borderRadius: '6px', background: timerMode === 'temporitzador' ? '#2E7D32' : '#E2E8F0', color: timerMode === 'temporitzador' ? 'white' : '#4A5568', fontWeight: 'bold' }}> Temporitzador </button> <button onClick={() => handleChangeMode('cronometre')} style={{ flex: 1, padding: '10px', cursor: 'pointer', border: 'none', borderRadius: '6px', background: timerMode === 'cronometre' ? '#1565C0' : '#E2E8F0', color: timerMode === 'cronometre' ? 'white' : '#4A5568', fontWeight: 'bold' }}> Cronòmetre </button> </div> {timerMode === 'temporitzador' ? ( <div style={{ marginBottom: '20px', background: '#F7FAFC', padding: '15px', borderRadius: '8px' }}> <label style={{ display: 'block', marginBottom: '10px', color: '#4A5568', fontWeight: 'bold' }}>Minuts:</label> <input type="number" min="1" max="120" value={inputMinutes} onChange={(e) => setInputMinutes(e.target.value)} style={{ padding: '8px', width: '80px', textAlign: 'center', fontSize: '20px', border: '1px solid #CBD5E0', borderRadius: '6px' }} /> <button onClick={handleApplyTime} style={{ marginLeft: '10px', padding: '10px 15px', cursor: 'pointer', background: '#2C3E50', color: 'white', border: 'none', borderRadius: '6px' }}>Aplicar</button> </div> ) : ( <p style={{ color: '#718096', marginBottom: '20px', padding: '15px' }}>Comptarà el temps de 0 cap amunt.</p> )} <div style={{ fontSize: '56px', fontWeight: 'bold', fontFamily: 'monospace', margin: '20px 0', color: '#2D3748' }}> {formatTime(time)} </div> <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '25px' }}> <button onClick={toggleTimer} style={{ flex: 1, padding: '12px', cursor: 'pointer', background: isActive ? '#E65100' : '#2E7D32', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '16px' }}> {isActive ? '⏸ Pausar' : '▶ Començar'} </button> <button onClick={resetTimer} style={{ padding: '12px 20px', cursor: 'pointer', background: '#A0AEC0', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold' }}> 🔄 Reiniciar </button> </div> <button onClick={() => setIsTimerMenuOpen(false)} style={{ width: '100%', padding: '12px', cursor: 'pointer', background: 'transparent', border: '2px solid #CBD5E0', color: '#4A5568', borderRadius: '6px', fontWeight: 'bold' }}> Tancar </button> </div> </div> )}
      {/* Modal Tasques */}
      {isMenuOpen && ( <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0, 0, 0, 0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(3px)' }}> <div style={{ background: 'white', padding: '30px', borderRadius: '12px', width: '420px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}> <h2 style={{ color: '#2C3E50', marginTop: 0 }}>Apunta la tasca</h2> <form onSubmit={handleAddTaskSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}> <div style={{ display: 'flex', flexDirection: 'column' }}> <label style={{ fontWeight: 'bold', marginBottom: '8px', color: '#4A5568' }}>Títol:</label> <input type="text" maxLength={35} value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Ex: Llegir tema 3" style={{ padding: '10px', border: '1px solid #CBD5E0', borderRadius: '6px', fontSize: '15px' }} /> </div> <div style={{ display: 'flex', flexDirection: 'column' }}> <label style={{ fontWeight: 'bold', marginBottom: '8px', color: '#4A5568' }}>Descripció:</label> <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Afegeix detalls..." style={{ padding: '10px', minHeight: '100px', resize: 'vertical', border: '1px solid #CBD5E0', borderRadius: '6px', fontSize: '15px' }} /> </div> <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px', marginTop: '10px' }}> <button type="button" onClick={handleCloseMenu} style={{ padding: '10px 20px', cursor: 'pointer', background: 'transparent', border: '2px solid #CBD5E0', color: '#4A5568', borderRadius: '6px', fontWeight: 'bold' }}>Cancel·lar</button> <button type="submit" style={{ padding: '10px 20px', cursor: 'pointer', background: '#2E7D32', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold' }}>Penjar al suro</button> </div> </form> </div> </div> )}
      {/* Modal Veure/Borrar Tasca */}
      {selectedTask && ( <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0, 0, 0, 0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(3px)' }}> <div style={{ background: '#FFF59D', padding: '40px', borderRadius: '4px', width: '380px', boxShadow: '0 15px 30px rgba(0,0,0,0.3)', fontFamily: 'sans-serif', border: '1px solid #E0E0E0' }}> <h2 style={{ marginTop: 0, wordBreak: 'break-word', color: '#212121', borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: '15px' }}>{selectedTask.title}</h2> <p style={{ minHeight: '80px', wordBreak: 'break-word', color: '#424242', fontSize: '16px', lineHeight: '1.5' }}> {selectedTask.description ? selectedTask.description : <i>Sense descripció addicional.</i>} </p> <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}> <button onClick={() => setSelectedTask(null)} style={{ padding: '10px 15px', cursor: 'pointer', background: 'transparent', border: '2px solid #9E9E9E', color: '#424242', borderRadius: '6px', fontWeight: 'bold' }}>Tornar</button> <button onClick={handleCompleteTask} style={{ padding: '10px 20px', cursor: 'pointer', background: '#2E7D32', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '16px' }}>✅ Tasca Feta!</button> </div> </div> </div> )}

    </section>
  );
};

export default Study;