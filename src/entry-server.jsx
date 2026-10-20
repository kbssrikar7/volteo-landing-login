import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';

// Used only at build time by scripts/prerender.mjs to turn the page into HTML.
export function render() {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>
  );
}
