import { ConfigService } from '@nestjs/config';
import { appConfig } from '@cfg/app.config';
import { beforeEach, describe, expect, it, vi } from "vitest";
import { TransactionManager } from "@persistence/database/postgres/typeorm/transaction/transaction.service";
import { DataSource, QueryRunner } from "typeorm";

type EmailConfigMock = {
    apiKey: string;
    apiSecret: string;
    from: string;
};

type ObservabilityConfigMock = {
    logs: boolean;
    metric: boolean;
    trace: boolean;
};

type RabbitmqConfigMock = {
    url: string;
    user?: string;
    password?: string;
};

type ConfigServiceMockOptions = {
    email?: EmailConfigMock;
    observability?: ObservabilityConfigMock;
    rabbitmq?: RabbitmqConfigMock;
};

export const createConfigServiceMock = (options: ConfigServiceMockOptions = {},): ConfigService => ({
        get: vi.fn((key: string) => {
            if (key !== appConfig.KEY)
                return undefined;

            return {
                email: {
                    apiKey: 'api-key',
                    apiSecret: 'api-secret',
                    from: 'noreply@editalcerto.com',
                    ...options.email,
                },
                observability: {
                    logs: true,
                    metric: true,
                    trace: true,
                    ...options.observability,
                },
                rabbitmq: {
                    url: 'amqp://rabbitmq',
                    ...options.rabbitmq,
                },
            };
        }),
    } as unknown as ConfigService);

export const createQueryRunnerMock = vi.fn();

export const mockDataSource = {
    createQueryRunner: createQueryRunnerMock,
} as unknown as DataSource;

export const createMockQueryRunner = (): QueryRunner => ({
    connect: vi.fn().mockResolvedValue(undefined),
    startTransaction: vi.fn().mockResolvedValue(undefined),
    commitTransaction: vi.fn().mockResolvedValue(undefined),
    rollbackTransaction: vi.fn().mockResolvedValue(undefined),
    release: vi.fn().mockResolvedValue(undefined),
} as unknown as QueryRunner);

export const createLoggerMock = () => ({
    write: vi.fn(),
    log: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
    verbose: vi.fn(),
});

export const createMetricsMock = () => ({
    increment: vi.fn(),
    decrement: vi.fn(),
    gauge: vi.fn(),
    histogram: vi.fn(),
    timing: vi.fn(),
    observe: vi.fn(),
});

export const createTracerMock = () => {
    const span = {
        end: vi.fn(),
        setAttribute: vi.fn(),
        setAttributes: vi.fn(),
        recordException: vi.fn(),
    };
    return {
        start: vi.fn().mockReturnValue(span),
    };
};

export const createTransactionManagerMock = () => ({
    run: vi.fn((fn) => fn()),
});

export const createProductGatewayClientMock = () => ({
    createProduct: vi.fn(),
    updateProduct: vi.fn(),
    createPrice: vi.fn(),
    updatePrice: vi.fn(),
    createCoupon: vi.fn(),
    deleteCoupon: vi.fn(),
});
