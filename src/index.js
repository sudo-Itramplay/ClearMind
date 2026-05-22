import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/globals.css';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);

// Register the PWA service worker only in production builds — in dev it would
// fight webpack-dev-server's hot reload by caching the bundle.
if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  });
}
