import { ConfigService } from '@nestjs/config';
import { appConfig } from '@cfg/app.config';
import { beforeEach, describe, expect, it, vi } from "vitest";
import { TransactionManager } from "@persistence/database/postgres/typeorm/transaction/transaction.service";
import { DataSource, ObjectLiteral, QueryRunner, Repository } from "typeorm";
import { IPlanRepository } from "@domain/product/port/plan.port";
import { IPriceRepository } from "@domain/product/port/price.port";
import { IFeatureRepository } from "@domain/product/port/feature.port";
import { IDiscountRepository } from "@domain/product/port/discount.port";
import { IProductGatewayService } from "@domain/product/port/product-payment-gateway.port";
import { IProductValidatorService } from "@domain/product/port/product-validator.port";
import { BaseRepository } from "@persistence/database/postgres/typeorm/repository/base/base.repository";
import { ClsService } from "nestjs-cls";
import { txKey } from "@domain/@shared/port/transaction.port";

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
    findAllByKey: vi.fn(),
    findById: vi.fn(),
    findByKey: vi.fn(),
    save: vi.fn(),
    saveBulk: vi.fn(),
});

export const createPriceRepositoryMock = (): IPriceRepository => ({
    findAll: vi.fn(),
    findById: vi.fn(),
    findByPlanIdAndKey: vi.fn(),
    save: vi.fn(),
    saveBulk: vi.fn(),
});

export const createFeatureRepositoryMock = (): IFeatureRepository => ({
    findAll: vi.fn(),
    findAllByPlanId: vi.fn(),
    findById: vi.fn(),
    findByPlanIdAndKey: vi.fn(),
    save: vi.fn(),
    saveBulk: vi.fn(),
});

export const createDiscountRepositoryMock = (): IDiscountRepository => ({
    findAll: vi.fn(),
    findAllByPriceId: vi.fn(),
    findById: vi.fn(),
    save: vi.fn(),
    delete: vi.fn(),
});

export const createProductGatewayServiceMock = (): IProductGatewayService => ({
    syncPlan: vi.fn(),
    syncPrice: vi.fn(),
    syncDiscount: vi.fn(),
    deactivatePlan: vi.fn(),
    deactivatePrice: vi.fn(),
    deleteDiscount: vi.fn(),
});

export const createProductValidatorServiceMock = (): IProductValidatorService => ({
    validatePlanKeys: vi.fn(),
    validatePriceKeys: vi.fn(),
    validateDiscountKeys: vi.fn(),
    validateFeaturesKeys: vi.fn(),
});
