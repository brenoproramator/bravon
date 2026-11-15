import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base relativo: funciona em subpasta (ex.: portfolio/bravon/) e na raiz
export default defineConfig({
  base: './',
  plugins: [react()]
});
