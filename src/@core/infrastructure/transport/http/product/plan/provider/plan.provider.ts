import { createPlanUsecasePort, findPlanUsecasePort, IPlanRepository, planRepositoryPort, updatePlanUsecasePort } from "@product/port/plan.port";
import { ITransactionManager, transactionPort } from "@domain/@shared/port/transaction.port";
import { IProductGatewayService, productGatewayServicePort } from "@product/port/product-payment-gateway.port";
import { IProductValidatorService, productValidatorServicePort } from "@product/port/product-validator.port";
import { CreatePlanUsecase } from "@application/product/usecase/plan/create-plan.usecase";
import { IMetrics, metricsPort } from "@domain/@shared/port/metrics.port";
import { FindPlanUsecase } from "@application/product/usecase/plan/find-plan.usecase";
import { UpdatePlanUsecase } from "@application/product/usecase/plan/update-plan.usecase";

export const planProviders = [
    {
        provide: createPlanUsecasePort,
        useFactory: (planRepository: IPlanRepository, transactionManager: ITransactionManager, productGatewayService: IProductGatewayService, productValidatorService: IProductValidatorService,) => new CreatePlanUsecase(planRepository, transactionManager, productGatewayService, productValidatorService),
        inject: [planRepositoryPort, transactionPort, productGatewayServicePort, productValidatorServicePort],
    },
    {
        provide: findPlanUsecasePort,
        useFactory: (planRepository: IPlanRepository, metrics: IMetrics,) => new FindPlanUsecase(planRepository, metrics),
        inject: [planRepositoryPort, metricsPort],
    },
    {
        provide: updatePlanUsecasePort,
        useFactory: (planRepository: IPlanRepository, transactionManager: ITransactionManager, productGatewayService: IProductGatewayService,) => new UpdatePlanUsecase(planRepository, transactionManager, productGatewayService),
        inject: [planRepositoryPort, transactionPort, productGatewayServicePort],
    },
];