import { registerAs } from '@nestjs/config';

export const appConfig = registerAs('app', () => ({
    env: process.env.NODE_ENV ?? 'production',

    nest: {
        port: Number(process.env.PORT ?? 3000),
    },

    urls: {
        v1SiteUrl: process.env.V1_SITE_URL,
        v1FrontendUrl: process.env.V1_FRONTEND_URL,
    },

    jwt: {
        secret: process.env.JWT_SECRET,
    },

    swagger: {
        enabled: process.env.SWAGGER_ENABLED !== 'false',
        title: process.env.SWAGGER_TITLE ?? 'Edital Certo API',
        description: process.env.SWAGGER_DESCRIPTION ?? 'Edital Certo API',
        version: process.env.SWAGGER_VERSION ?? '1.0',
        path: process.env.SWAGGER_PATH ?? 'api',
    },

    database: {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT ?? 5432),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        name: process.env.DB_NAME,
        sync: process.env.DB_SYNC === 'true',
    },

    redis: { password: process.env.REDIS_PASS, },

    rabbitmq: {
        url: process.env.RABBITMQ_URL,
        user: process.env.RABBITMQ_USER,
        password: process.env.RABBITMQ_PASSWORD,
    },

    email: {
        apiKey: process.env.MAILJET_API_KEY,
        apiSecret: process.env.MAILJET_API_SECRET,
        from: process.env.EMAIL_FROM,
    },

    gcp: {
        credentials: process.env.GCP_CREDENTIALS,
        projectId: process.env.GCP_PROJECT_ID,
        geminiApiKey: process.env.GEMINI_API_KEY,
    },

    tawkTo: {
        secret: process.env.TAWK_TO_SECRET,
    },

    observability: {
        logs: process.env.OBSERVABILITY_LOGS === 'true',
        metric: process.env.OBSERVABILITY_METRIC === 'true',
        trace: process.env.OBSERVABILITY_TRACE === 'true',
    }
}));

export type AppConfig = ReturnType<typeof appConfig>;