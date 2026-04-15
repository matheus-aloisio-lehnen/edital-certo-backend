import path from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    resolve: {
        alias: {
            '@app': path.resolve(__dirname, './src'),
            '@domain': path.resolve(__dirname, './src/@core/domain'),
            '@event': path.resolve(__dirname, './src/@core/infrastructure/event'),
            '@persistence': path.resolve(__dirname, './src/@core/infrastructure/persistence'),
            '@observability': path.resolve(__dirname, './src/@core/infrastructure/observability'),
            '@transport': path.resolve(__dirname, './src/@core/infrastructure/transport'),
            '@utils': path.resolve(__dirname, './src/@core/infrastructure/utils'),
            '@templates': path.resolve(__dirname, './src/@core/infrastructure/transport/email/template'),
            '@filter': path.resolve(__dirname, './src/@core/infrastructure/transport/http/filters'),
            '@logger': path.resolve(__dirname, './src/@core/infrastructure/observability/logger'),
            '@metrics': path.resolve(__dirname, './src/@core/infrastructure/observability/metrics'),
            '@tracer': path.resolve(__dirname, './src/@core/infrastructure/observability/tracer'),
            '@functions': path.resolve(__dirname, './src/@core/infrastructure/utils/function'),
            '@pipes': path.resolve(__dirname, './src/@core/infrastructure/utils/pipe'),
            '@cfg': path.resolve(__dirname, './src/config/cfg'),
            '@env': path.resolve(__dirname, './src/config/env'),
            '@mock': path.resolve(__dirname, './test/mock'),
        },
    },
    test: {
        include: [ 'src/**/*.spec.ts' ],
        environment: 'node',
        globals: true,
        setupFiles: [ './test/vitest.setup.ts' ],
        coverage: {
            provider: 'v8',
            reporter: [ 'text' ],
            include: [ 'src/**/*.{ts,js}' ],
        },
    },
});
