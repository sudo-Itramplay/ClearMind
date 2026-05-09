import React from 'react';
import styles from './css/Footer.module.css';

// Configuració fàcil d'editar per a perfils no tècnics.
// Modifica només l'etiqueta (label) o l'enllaç (url).
const FOOTER_DATA = {
  documentation: [
    { label: 'Explore Vite', url: 'https://vite.dev/' },
    { label: 'Learn React', url: 'https://react.dev/' }
  ],
  social: [
    { label: 'GitHub', url: 'https://github.com/vitejs/vite' },
    { label: 'Discord', url: 'https://chat.vite.dev/' },
    { label: 'X.com', url: 'https://x.com/vite_js' }
  ]
};

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.linksContainer}>
        
        <div className={styles.linkGroup}>
          <span className={styles.groupTitle}>Documentació:</span>
          {FOOTER_DATA.documentation.map((link, index) => (
            <a key={index} href={link.url} target="_blank" rel="noopener noreferrer" className={styles.link}>
              {link.label}
            </a>
          ))}
        </div>

        <div className={styles.linkGroup}>
          <span className={styles.groupTitle}>Connecta:</span>
          {FOOTER_DATA.social.map((link, index) => (
            <a key={index} href={link.url} target="_blank" rel="noopener noreferrer" className={styles.link}>
              {link.label}
            </a>
          ))}
        </div>

      </div>

      <p className={styles.copyright}>&copy; {currentYear} ClearMind — Productivitat amb enfocament.</p>
    </footer>
  );
};

export default Footer;
