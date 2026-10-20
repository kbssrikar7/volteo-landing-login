import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import '@fontsource-variable/geist';
import App from './App';
import './index.css';

const container = document.getElementById('root');
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

// In production the page HTML is already rendered at build time
// (see scripts/prerender.mjs), so React attaches to it ("hydrates") instead of
// building it from scratch. During `npm run dev` the root is empty.
if (container.hasChildNodes()) {
  hydrateRoot(container, app);
} else {
  createRoot(container).render(app);
}
