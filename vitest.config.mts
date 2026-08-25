import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': new URL('.', import.meta.url).pathname,
    },
  },
  test: {
    environment: 'jsdom',
    include: ['components/**/*.test.{ts,tsx}', 'lib/**/*.test.{ts,tsx}', 'utils/**/*.test.{ts,tsx}'],
    exclude: ['e2e/**', '.claude/**', 'node_modules/**'],
    setupFiles: ['./vitest.setup.ts'],
  },
});
