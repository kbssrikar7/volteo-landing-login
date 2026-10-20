import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// React and ReactDOM are loaded from a CDN (via the import map injected below)
// instead of being bundled. This keeps the production bundle to just our own
// app code. Pin the version in one place:
const REACT_VERSION = '19.1.0';

// Adds an import map to the built index.html so the browser can resolve the
// bare "react" / "react-dom" imports to the CDN. Only runs for `vite build`.
function cdnImportMap() {
  const cdn = (path) => `https://cdn.jsdelivr.net/npm/${path}/+esm`;
  const importmap = {
    imports: {
      react: cdn(`react@${REACT_VERSION}`),
      'react-dom': cdn(`react-dom@${REACT_VERSION}`),
      'react-dom/client': cdn(`react-dom@${REACT_VERSION}/client`),
      'react/jsx-runtime': cdn(`react@${REACT_VERSION}/jsx-runtime`),
    },
  };
  return {
    name: 'cdn-import-map',
    apply: 'build',
    transformIndexHtml(html) {
      const tag = `<script type="importmap">${JSON.stringify(importmap)}</script>`;
      return html.replace('</head>', `  ${tag}\n  </head>`);
    },
  };
}

export default defineConfig({
  plugins: [react(), cdnImportMap()],
  build: {
    // Don't bundle React; the import map above resolves it at runtime.
    rollupOptions: {
      external: ['react', 'react-dom', 'react-dom/client', 'react/jsx-runtime'],
    },
  },
  server: {
    // During local development, forward API calls to the Smartport backend
    // so the login form can be tested without CORS issues.
    proxy: {
      '/api': {
        target: 'https://smartport.ap.gov.in',
        changeOrigin: true,
      },
    },
  },
});
