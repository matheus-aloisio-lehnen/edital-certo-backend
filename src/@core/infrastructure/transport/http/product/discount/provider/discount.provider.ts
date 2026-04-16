import { ITransactionManager, transactionPort } from "@domain/@shared/port/transaction.port";
import { IMetrics, metricsPort } from "@domain/@shared/port/metrics.port";
import { createDiscountUsecasePort, deleteDiscountUsecasePort, discountRepositoryPort, findDiscountUsecasePort, IDiscountRepository } from "@product/port/discount.port";
import { IPriceRepository, priceRepositoryPort } from "@product/port/price.port";
import { CreateDiscountUsecase } from "@application/product/usecase/discount/create-discount.usecase";
import { IProductGatewayService, productGatewayServicePort } from "@product/port/product-payment-gateway.port";
import { DeleteDiscountUsecase } from "@application/product/usecase/discount/delete-discount.usecase";
import { FindDiscountUsecase } from "@application/product/usecase/discount/find-discount.usecase";

export const discountProviders = [
    {
        provide: createDiscountUsecasePort,
        useFactory: (discountRepository: IDiscountRepository, priceRepository: IPriceRepository, transactionManager: ITransactionManager, productGatewayService: IProductGatewayService,) => new CreateDiscountUsecase(discountRepository, priceRepository, transactionManager, productGatewayService),
        inject: [discountRepositoryPort, priceRepositoryPort, transactionPort, productGatewayServicePort],
    },
    {
        provide: deleteDiscountUsecasePort,
        useFactory: (discountRepository: IDiscountRepository, transactionManager: ITransactionManager,) => new DeleteDiscountUsecase(discountRepository, transactionManager),
        inject: [discountRepositoryPort, transactionPort],
    },
    {
        provide: findDiscountUsecasePort,
        useFactory: (discountRepository: IDiscountRepository, metrics: IMetrics,) => new FindDiscountUsecase(discountRepository, metrics),
        inject: [discountRepositoryPort, metricsPort],
    },
];
