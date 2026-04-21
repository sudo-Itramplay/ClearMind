import React from 'react';
import styles from './css/Footer.module.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <p>&copy; {currentYear} AppProd — Productivitat amb enfocament.</p>
    </footer>
  );
};

export default Footer;
