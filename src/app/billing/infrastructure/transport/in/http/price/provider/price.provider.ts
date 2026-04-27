import { billingGatewayServicePort, type IBillingGatewayService } from "@billing/application/gateway/port/billing-gateway.port";
import { type IProductRepository, productRepositoryPort } from "@billing/domain/product/port/product.port";
import { createPriceUsecasePort, deactivatePriceUsecasePort, findPriceUsecasePort, type IPriceRepository, priceRepositoryPort } from "@billing/domain/price/port/price.port";
import { CreatePriceUsecase } from "@billing/application/price/usecase/create-price.usecase";
import { DeactivatePriceUsecase } from "@billing/application/price/usecase/deactivate-price.usecase";
import { FindPriceUsecase } from "@billing/application/price/usecase/find-price.usecase";
import { type IMetrics, metricsPort } from "@shared/domain/port/metrics.port";
import { type ITransactionManager, transactionPort } from "@shared/domain/port/transaction.port";

export const priceProviders = [
    {
        provide: createPriceUsecasePort,
        useFactory: (priceRepository: IPriceRepository, productRepository: IProductRepository, transactionManager: ITransactionManager, billingGatewayService: IBillingGatewayService,) => new CreatePriceUsecase(priceRepository, productRepository, transactionManager, billingGatewayService),
        inject: [priceRepositoryPort, productRepositoryPort, transactionPort, billingGatewayServicePort],
    },
    {
        provide: findPriceUsecasePort,
        useFactory: (priceRepository: IPriceRepository, metrics: IMetrics,) => new FindPriceUsecase(priceRepository, metrics),
        inject: [priceRepositoryPort, metricsPort],
    },
    {
        provide: deactivatePriceUsecasePort,
        useFactory: (priceRepository: IPriceRepository, transactionManager: ITransactionManager, billingGatewayService: IBillingGatewayService,) => new DeactivatePriceUsecase(priceRepository, transactionManager, billingGatewayService),
        inject: [priceRepositoryPort, transactionPort, billingGatewayServicePort],
    },
];
