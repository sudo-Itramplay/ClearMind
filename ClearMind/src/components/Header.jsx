import React, { useState } from 'react';
import styles from './css/Header.module.css'; // Importem els estils com un objecte

const Header = () => {
  // Definim les pestanyes disponibles
  const tabs = ['HALL', 'STUDY', 'RELAX'];

  // Estat per saber quina pestanya està seleccionada (comencem per la primera)
  const [activeTab, setActiveTab] = useState('HALL');

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        🚀 AppProd
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
