import React, { useState } from 'react';
import styles from './css/Header.module.css'; // Importem els estils com un objecte

const Header = () => {

  // WE set here the 3 view we want to do
  const tabs = ['STUDY', 'HALL', 'RELAX'];

  // Estat per saber quina pestanya està seleccionada (comencem per la primera)
  const [activeTab, setActiveTab] = useState('HALL');

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        ClearMind
      </div>
      
      <nav className={styles.nav}>
        <ul className={styles.tabList}>
          {tabs.map((tab) => (
            <li key={tab} className={styles.tabItem}>
              <button
                // Si la pestanya es l'activa, afegim la classe 'active'
                className={`${styles.tabButton} ${activeTab === tab ? styles.active : ''}`}
                onClick={() => setActiveTab(tab)} // Canviem l'estat en fer clic
              >
                {tab}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      
      {/* Espaiador per equilibrar el flexbox del header (opcional) */}
      <div className={styles.spacer}></div>
    </header>
  );
};

export default Header;
