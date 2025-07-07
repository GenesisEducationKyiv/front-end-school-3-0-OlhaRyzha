import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { visualizer } from 'rollup-plugin-visualizer';
import viteCompression from 'vite-plugin-compression';

export default defineConfig({
  plugins: [
    react(),
    visualizer({ open: true }),
    viteCompression({
      algorithm: 'gzip',
      threshold: 10240,
      ext: '.gz',
    }),
    viteCompression({
      algorithm: 'brotliCompress',
      threshold: 10240,
      ext: '.br',
    }),
  ],
  css: { postcss: './postcss.config.cjs' },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  base: '/tracker/',
  build: {
    sourcemap: 'hidden',
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.match(/node_modules\/(react|react-dom)\//)) {
              return 'react-core';
            }
            if (id.match(/node_modules\/react-router-dom\//)) {
              return 'react-router';
            }
            if (id.match(/node_modules\/(react-redux|redux-persist)\//)) {
              return 'react-redux';
            }
            if (
              id.match(
                /node_modules\/(@tanstack\/react-query|@tanstack\/react-query-devtools)\//
              )
            ) {
              return 'react-query-vendors';
            }
            if (id.match(/node_modules\/@radix-ui\//)) {
              return 'radix-vendors';
            }
          }
        },
      },
    },
  },
});
