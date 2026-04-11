import path from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    resolve: {
        alias: {
            '@app': path.resolve(__dirname, './src'),
            '@domain': path.resolve(__dirname, './src/@core/domain'),
            '@logger': path.resolve(__dirname, './src/@core/infrastructure/observability/logger'),
            '@metrics': path.resolve(__dirname, './src/@core/infrastructure/observability/metrics'),
            '@tracer': path.resolve(__dirname, './src/@core/infrastructure/observability/tracer'),
            '@cfg': path.resolve(__dirname, './src/config/cfg'),
            '@env': path.resolve(__dirname, './src/config/env'),
        },
    },
    test: {
        include: [ 'src/**/*.spec.ts' ],
        environment: 'node',
        setupFiles: [ './test/vitest.setup.ts' ],
        coverage: {
            provider: 'v8',
            reportsDirectory: './coverage',
            include: [ 'src/**/*.{ts,js}' ],
        },
    },
});
