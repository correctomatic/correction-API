import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    reporters: ['default'],
    // outputFile: '/tmp/vitest_results.json',
    watch: false,
  },
})
