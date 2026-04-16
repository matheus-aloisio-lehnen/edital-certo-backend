import { createPriceUsecasePort, findPriceUsecasePort, IPriceRepository, priceRepositoryPort, updatePriceUsecasePort } from "@product/port/price.port";
import { IPlanRepository, planRepositoryPort } from "@product/port/plan.port";
import { ITransactionManager, transactionPort } from "@domain/@shared/port/transaction.port";
import { IProductGatewayService, productGatewayServicePort } from "@product/port/product-payment-gateway.port";
import { IProductValidatorService, productValidatorServicePort } from "@product/port/product-validator.port";
import { CreatePriceUsecase } from "@application/product/usecase/price/create-price.usecase";
import { IMetrics, metricsPort } from "@domain/@shared/port/metrics.port";
import { FindPriceUsecase } from "@application/product/usecase/price/find-price.usecase";
import { UpdatePriceUsecase } from "@application/product/usecase/price/update-price.usecase";

export const priceProviders = [
    {
        provide: createPriceUsecasePort,
        useFactory: (priceRepository: IPriceRepository, planRepository: IPlanRepository, transactionManager: ITransactionManager, productGatewayService: IProductGatewayService, productValidatorService: IProductValidatorService,) => new CreatePriceUsecase(priceRepository, planRepository, transactionManager, productGatewayService, productValidatorService),
        inject: [priceRepositoryPort, planRepositoryPort, transactionPort, productGatewayServicePort, productValidatorServicePort],
    },
    {
        provide: findPriceUsecasePort,
        useFactory: (priceRepository: IPriceRepository, metrics: IMetrics,) => new FindPriceUsecase(priceRepository, metrics),
        inject: [priceRepositoryPort, metricsPort],
    },
    {
        provide: updatePriceUsecasePort,
        useFactory: (priceRepository: IPriceRepository, transactionManager: ITransactionManager, productGatewayService: IProductGatewayService,) => new UpdatePriceUsecase(priceRepository, transactionManager, productGatewayService),
        inject: [priceRepositoryPort, transactionPort, productGatewayServicePort],
    },
];
