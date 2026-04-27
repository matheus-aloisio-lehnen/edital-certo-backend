import { CreateProductUsecase } from "@billing/application/product/usecase/create-product.usecase";
import { DeactivateProductUsecase } from "@billing/application/product/usecase/deactivate-product.usecase";
import { FindProductUsecase } from "@billing/application/product/usecase/find-product.usecase";
import { billingGatewayServicePort, type IBillingGatewayService } from "@billing/application/gateway/port/billing-gateway.port";
import { createProductUsecasePort, deactivateProductUsecasePort, findProductUsecasePort, type IProductRepository, productRepositoryPort } from "@billing/domain/product/port/product.port";
import { type IMetrics, metricsPort } from "@shared/domain/port/metrics.port";
import { type ITransactionManager, transactionPort } from "@shared/domain/port/transaction.port";

export const productProviders = [
    {
        provide: createProductUsecasePort,
        useFactory: (productRepository: IProductRepository, transactionManager: ITransactionManager, billingGatewayService: IBillingGatewayService,) => new CreateProductUsecase(productRepository, transactionManager, billingGatewayService),
        inject: [productRepositoryPort, transactionPort, billingGatewayServicePort],
    },
    {
        provide: findProductUsecasePort,
        useFactory: (productRepository: IProductRepository, metrics: IMetrics,) => new FindProductUsecase(productRepository, metrics),
        inject: [productRepositoryPort, metricsPort],
    },
    {
        provide: deactivateProductUsecasePort,
        useFactory: (productRepository: IProductRepository, transactionManager: ITransactionManager, billingGatewayService: IBillingGatewayService,) => new DeactivateProductUsecase(productRepository, transactionManager, billingGatewayService),
        inject: [productRepositoryPort, transactionPort, billingGatewayServicePort],
    },
];
