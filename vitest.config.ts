import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: 'src/tests/setupTests.ts',
    include: ['src/tests/**/*.{test,spec}.{ts,tsx}'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      'tracks-manager-ui': path.resolve(
        __dirname,
        'node_modules/tracks-manager-ui/dist/index.esm.js'
      ),
    },
  },
});
