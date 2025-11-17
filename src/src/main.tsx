import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '../App';
import '../styles/globals.css';
import { registerServiceWorker, requestPersistentStorage } from '../utils/pwaRegister';

// Register service worker for PWA functionality
registerServiceWorker();

// Request persistent storage for offline data
requestPersistentStorage();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
