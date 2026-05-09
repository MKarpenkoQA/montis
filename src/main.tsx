import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import {injectMediaResourceHints} from './mediaManifest';
import {registerServiceWorker} from './serviceWorkerRegistration';

// Inject non-blocking resource hints early in bootstrap.
injectMediaResourceHints();
registerServiceWorker();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
