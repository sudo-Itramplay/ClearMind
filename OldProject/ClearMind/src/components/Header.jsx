import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './css/Header.module.css';

const Header = () => {
  const tabs = [
    { name: 'STUDY', path: '/study' },
    { name: 'HALL', path: '/hall' },
    { name: 'RELAX', path: '/relax' }
  ];

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        ClearMind
      </div>
      
      <nav className={styles.nav}>
        <ul className={styles.tabList}>
          {tabs.map((tab) => (
            <li key={tab.name} className={styles.tabItem}>
              <NavLink
                to={tab.path}
                // NavLink ofereix un estat 'isActive' que passem a la funció de classes
                className={({ isActive }) => 
                  `${styles.tabButton} ${isActive ? styles.active : ''}`
                }
              >
                {tab.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className={styles.spacer}></div>
    </header>
  );
};

export default Header;
