import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    // Lets us write imports like '@/components/ui/button'
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
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
