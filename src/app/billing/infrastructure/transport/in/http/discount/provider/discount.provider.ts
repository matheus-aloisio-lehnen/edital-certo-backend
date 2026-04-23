import { CreateDiscountUsecase } from "@billing/application/discount/usecase/create-discount.usecase";
import { DeleteDiscountUsecase } from "@billing/application/discount/usecase/delete-discount.usecase";
import { FindDiscountUsecase } from "@billing/application/discount/usecase/find-discount.usecase";
import { billingGatewayServicePort, type IBillingGatewayService } from "@billing/application/gateway/port/billing-gateway.port";
import { createDiscountUsecasePort, deleteDiscountUsecasePort, discountRepositoryPort, findDiscountUsecasePort, type IDiscountRepository } from "@billing/domain/discount/port/discount.port";
import { type IPriceRepository, priceRepositoryPort } from "@billing/domain/price/port/price.port";
import { type IMetrics, metricsPort } from "@shared/domain/port/metrics.port";
import { type ITransactionManager, transactionPort } from "@shared/domain/port/transaction.port";

export const discountProviders = [
    {
        provide: createDiscountUsecasePort,
        useFactory: (discountRepository: IDiscountRepository, priceRepository: IPriceRepository, transactionManager: ITransactionManager, billingGatewayService: IBillingGatewayService,) => new CreateDiscountUsecase(discountRepository, priceRepository, transactionManager, billingGatewayService),
        inject: [discountRepositoryPort, priceRepositoryPort, transactionPort, billingGatewayServicePort],
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
