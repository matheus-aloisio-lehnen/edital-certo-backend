import { vi } from 'vitest';
import { DataSource, ObjectLiteral, QueryRunner, Repository } from 'typeorm';
import { ConfigService } from "@nestjs/config";

import { type IBillingGatewayService } from "@billing/application/gateway/port/billing-gateway.port";
import { type IDiscountRepository } from "@billing/domain/discount/port/discount.port";
import { type IPlanRepository } from "@billing/domain/plan/port/plan.port";
import { type IPriceRepository } from "@billing/domain/price/port/price.port";
import { txKey } from "@shared/domain/port/transaction.port";
import { appConfig, type AppConfig } from "@root/app.config";
import { BaseRepository } from "@shared/infrastructure/persistence/database/postgres/typeorm/repository/base/base.repository";
import { ClsService } from "nestjs-cls";

export const createConfigServiceMock = (override: Partial<AppConfig> = {},): ConfigService => {
    const config: AppConfig = {
        env: 'DEV',

        nest: { port: 3000 },

        urls: { v1SiteUrl: '', v1FrontendUrl: '' },

        jwt: { secret: '' },

        paymentGateway: {
            secretKey: '',
        },

        swagger: {
            enabled: true,
            title: '',
            description: '',
            version: '',
            path: '',
        },

        database: {
            host: '',
            port: 5432,
            username: '',
            password: '',
            name: '',
            sync: false,
        },

        redis: {
            host: '',
            port: 6379,
            password: '',
        },

        rabbitmq: {
            url: '',
            user: '',
            password: '',
        },

        email: {
            host: '',
            port: 2525,
            secure: false,
            user: '',
            password: '',
            apiKey: '',
            apiSecret: '',
            from: '',
        },

        gcp: {
            credentials: '',
            projectId: '',
            geminiApiKey: '',
        },

        tawkTo: {
            secret: '',
        },

        observability: {
            logs: false,
            metric: false,
            trace: false,
            endpoint: '',
        },

        ...override,
    };

    return {
        get: (key: string) => {
            if (key === "app" || key === appConfig.KEY)
                return config;

            return key
                .replace(/^app\./, "")
                .split(".")
                .reduce((acc: any, k) => acc?.[k], config);
        },
    } as ConfigService;
};
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

export const createBillingGatewayClientMock = () => ({
    createProduct: vi.fn(),
    updateProduct: vi.fn(),
    createPrice: vi.fn(),
    updatePrice: vi.fn(),
    createCoupon: vi.fn(),
    deleteCoupon: vi.fn(),
});

export const createRepositoryMock = <T extends ObjectLiteral>(props: Partial<Repository<T>> = {}): Repository<T> => ({
    target: props.target || ({} as any),
    find: vi.fn(),
    findOne: vi.fn(),
    save: vi.fn(),
    delete: vi.fn(),
    ...props,
} as unknown as Repository<T>);

export const createClsServiceMock = (tx?: QueryRunner): ClsService => ({
    get: vi.fn((key: string | symbol) => {
        if (key === txKey)
            return tx;
        return undefined;
    }),
    set: vi.fn(),
} as unknown as ClsService);

export const createManagedQueryRunnerMock = (repo: Repository<any>): Partial<QueryRunner> => ({
    manager: {
        getRepository: vi.fn().mockReturnValue(repo),
    } as any,
});

class TestBaseRepository<T extends ObjectLiteral> extends BaseRepository<T> {
    constructor(repo: Repository<T>, cls: ClsService) {
        super(repo, cls);
    }

    public getRepository(): Repository<T> {
        return this.repository;
    }
}

export const createBaseRepositoryMock = <T extends ObjectLiteral>(repo: Repository<T>, cls: ClsService): any => {
    return new TestBaseRepository(repo, cls);
};

export const createPlanRepositoryMock = (): IPlanRepository => ({
    findAll: vi.fn(),
    findById: vi.fn(),
    save: vi.fn(),
});

export const createPriceRepositoryMock = (): IPriceRepository => ({
    findAll: vi.fn(),
    findById: vi.fn(),
    findByPlanIdAndBillingCycle: vi.fn(),
    save: vi.fn(),
});

export const createDiscountRepositoryMock = (): IDiscountRepository => ({
    findAll: vi.fn(),
    findAllByPriceId: vi.fn(),
    findById: vi.fn(),
    save: vi.fn(),
    delete: vi.fn(),
});

export const createBillingGatewayServiceMock = (): IBillingGatewayService => ({
    syncPlan: vi.fn(),
    syncPrice: vi.fn(),
    syncDiscount: vi.fn(),
    deactivatePlan: vi.fn(),
    deactivatePrice: vi.fn(),
    deleteDiscount: vi.fn(),
});
