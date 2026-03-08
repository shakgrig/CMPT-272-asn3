/// <reference types="vitest/config" />
import { /* loadEnv, */ type UserConfig } from 'vite';

export default {
  // const env = loadEnv(process.cwd(), '');
  // resolve: { tsconfigPaths: true },
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
    include: ['**/*.{test,spec,test.example}.{js,mjs,cjs,ts,mts,cts}'],
    exclude: ['node_modules', 'dist', 'build', 'coverage'],
    typecheck: { enabled: true },
    coverage: {
      reportsDirectory: './coverage.local',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'dist/', 'build/', 'coverage/', '**/*.d.ts', '**/*.config.{js,ts}'],
    },
  },
  optimizeDeps: { exclude: ['./class_example_files/*'] },
} satisfies UserConfig;
