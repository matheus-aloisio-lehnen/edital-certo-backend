import { ConfigType, registerAs } from '@nestjs/config';
import { hasValue } from "@shared/domain/function/has-value.function";

export const appConfig = registerAs('app', () => ({
    env: getEnv(),

    nest: {
        port: getNumber('PORT', 3000),
    },

    urls: {
        v1SiteUrl: get('V1_SITE_URL', ''),
        v1FrontendUrl: get('V1_FRONTEND_URL', ''),
    },

    jwt: {
        secret: get('JWT_SECRET', ''),
    },

    paymentGateway: {
        secretKey: get('PAYMENT_GATEWAY_SECRET_KEY', ''),
    },

    swagger: {
        enabled: getBoolean('SWAGGER_ENABLED', true),
        title: get('SWAGGER_TITLE', 'Novo Projeto API'),
        description: get('SWAGGER_DESCRIPTION', 'Novo Projeto API'),
        version: get('SWAGGER_VERSION', '1.0'),
        path: get('SWAGGER_PATH', 'api'),
    },

    database: {
        host: get('DB_HOST', ''),
        port: getNumber('DB_PORT', 5432),
        username: get('DB_USERNAME', ''),
        password: get('DB_PASSWORD', ''),
        name: get('DB_NAME', ''),
        sync: getBoolean('DB_SYNC', false),
    },

    redis: {
        host: get('REDIS_HOST', ''),
        port: getNumber('REDIS_PORT', 6379),
        password: get('REDIS_PASS', ''),
    },

    rabbitmq: {
        url: get('RABBITMQ_URL', ''),
        user: get('RABBITMQ_USER', ''),
        password: get('RABBITMQ_PASSWORD', ''),
    },

    email: {
        host: get('EMAIL_HOST', ''),
        port: getNumber('EMAIL_PORT', 2525),
        secure: getBoolean('EMAIL_SECURE', false),
        user: get('EMAIL_USER', ''),
        password: get('EMAIL_PASSWORD', ''),
        apiKey: get('MAILJET_API_KEY', ''),
        apiSecret: get('MAILJET_SECRET_KEY', ''),
        from: get('EMAIL_FROM', ''),
    },

    gcp: {
        credentials: get('GCP_CREDENTIALS', ''),
        projectId: get('GCP_PROJECT_ID', ''),
        geminiApiKey: get('GEMINI_API_KEY', ''),
    },

    tawkTo: {
        secret: get('TAWK_TO_SECRET', ''),
    },

    observability: {
        logs: getBoolean('OBS_LOGS_ENABLED', false),
        metric: getBoolean('OBS_METRICS_ENABLED', false),
        trace: getBoolean('OBS_TRACES_ENABLED', false),
        endpoint: get('OTEL_EXPORTER_OTLP_ENDPOINT', ''),
    },
}));

export type AppConfig = ConfigType<typeof appConfig>;


export const env = {
    dev: 'DEV',
    hml: 'HML',
    prod: 'PROD',
} as const;

export type Env = typeof env[keyof typeof env];

export const getEnv = (): Env => {
    const current = process.env.NODE_ENV?.toUpperCase();

    if (current === env.dev || current === env.hml || current === env.prod)
        return current;

    return env.dev;
};

const get = (key: string, fallback: string): string => {
    const scopedKey = `${getEnv()}_${key}`;
    const value = process.env[scopedKey] ?? process.env[key];

    if (hasValue(value))
        return value;

    return fallback;
};

const getNumber = (key: string, fallback: number): number => {
    const raw = get(key, String(fallback));
    const parsed = Number(raw);

    if (Number.isNaN(parsed))
        throw new Error(`Invalid number environment variable: ${key}`);

    return parsed;
};

const getBoolean = (key: string, fallback = false): boolean => {
    const scopedKey = `${getEnv()}_${key}`;
    const value = process.env[scopedKey] ?? process.env[key];

    if (!hasValue(value))
        return fallback;

    return value === 'true';
};
