import { ITransactionManager, transactionPort } from "@domain/@shared/port/transaction.port";
import { IProductValidatorService, productValidatorServicePort } from "@product/port/product-validator.port";
import { IMetrics, metricsPort } from "@domain/@shared/port/metrics.port";
import { createFeatureUsecasePort, featureRepositoryPort, findFeatureUsecasePort, IFeatureRepository, updateFeatureUsecasePort } from "@product/port/feature.port";
import { CreateFeatureUsecase } from "@application/product/usecase/feature/create-feature.usecase";
import { FindFeatureUsecase } from "@application/product/usecase/feature/find-feature.usecase";
import { UpdateFeatureUsecase } from "@application/product/usecase/feature/update-feature.usecase";

export const featureProviders = [
    {
        provide: createFeatureUsecasePort,
        useFactory: (featureRepository: IFeatureRepository, transactionManager: ITransactionManager, productValidatorService: IProductValidatorService,) => new CreateFeatureUsecase(featureRepository, transactionManager, productValidatorService),
        inject: [featureRepositoryPort, transactionPort, productValidatorServicePort],
    },
    {
        provide: findFeatureUsecasePort,
        useFactory: (featureRepository: IFeatureRepository, metrics: IMetrics,) => new FindFeatureUsecase(featureRepository, metrics),
        inject: [featureRepositoryPort, metricsPort],
    },
    {
        provide: updateFeatureUsecasePort,
        useFactory: (featureRepository: IFeatureRepository, transactionManager: ITransactionManager,) => new UpdateFeatureUsecase(featureRepository, transactionManager),
        inject: [featureRepositoryPort, transactionPort],
    },
];
