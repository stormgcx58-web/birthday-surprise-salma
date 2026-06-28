import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'esnext',
    sourcemap: false,
    cssCodeSplit: true,
    chunkSizeWarningLimit: 1000,

    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;

          if (id.includes('react')) {
            return 'react-vendor';
          }

          if (id.includes('framer-motion')) {
            return 'motion';
          }

          if (
            id.includes('three') ||
            id.includes('@react-three')
          ) {
            return 'three';
          }

          if (id.includes('@mui')) {
            return 'mui';
          }
        },
      },
    },
  },
});