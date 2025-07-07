import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { visualizer } from 'rollup-plugin-visualizer';
import viteCompression from 'vite-plugin-compression';
import compression from 'compression';
import purgecss from 'vite-plugin-purgecss';

const devCompressionPlugin: Plugin = {
  name: 'dev-compression',
  configureServer(server) {
    server.middlewares.use(compression());
  },
};

const purgeCssPlugin: Plugin<'post'> = {
  ...purgecss({
    content: ['./index.html', './src/**/*.{tsx,ts,jsx,js}'],
    safelist: ['dark', 'light'],
  }),
  enforce: 'post',
};

export default defineConfig({
  plugins: [
    react(),
    visualizer({ open: true }),
    viteCompression({ algorithm: 'gzip', threshold: 10240, ext: '.gz' }),
    viteCompression({
      algorithm: 'brotliCompress',
      threshold: 10240,
      ext: '.br',
    }),
    devCompressionPlugin,
    purgeCssPlugin,
  ],
  css: { postcss: './postcss.config.cjs' },
  resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
  base: '/tracker/',
  build: {
    sourcemap: 'hidden',
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.match(/node_modules\/(react|react-dom)\//))
              return 'react-core';
            if (id.match(/node_modules\/react-router-dom\//))
              return 'react-router';
            if (id.match(/node_modules\/(react-redux|redux-persist)\//))
              return 'react-redux';
            if (id.match(/node_modules\/@tanstack\/react-query/))
              return 'react-query-vendors';
            if (id.match(/node_modules\/@radix-ui\//)) return 'radix-vendors';
          }
        },
      },
    },
  },
});
