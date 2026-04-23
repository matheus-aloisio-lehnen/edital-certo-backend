import { CreatePlanUsecase } from "@billing/application/plan/usecase/create-plan.usecase";
import { DeactivatePlanUsecase } from "@billing/application/plan/usecase/deactivate-plan.usecase";
import { FindPlanUsecase } from "@billing/application/plan/usecase/find-plan.usecase";
import { billingGatewayServicePort, type IBillingGatewayService } from "@billing/application/gateway/port/billing-gateway.port";
import { createPlanUsecasePort, deactivatePlanUsecasePort, findPlanUsecasePort, type IPlanRepository, planRepositoryPort } from "@billing/domain/plan/port/plan.port";
import { type IMetrics, metricsPort } from "@shared/domain/port/metrics.port";
import { type ITransactionManager, transactionPort } from "@shared/domain/port/transaction.port";

export const planProviders = [
    {
        provide: createPlanUsecasePort,
        useFactory: (planRepository: IPlanRepository, transactionManager: ITransactionManager, billingGatewayService: IBillingGatewayService,) => new CreatePlanUsecase(planRepository, transactionManager, billingGatewayService),
        inject: [planRepositoryPort, transactionPort, billingGatewayServicePort],
    },
    {
        provide: findPlanUsecasePort,
        useFactory: (planRepository: IPlanRepository, metrics: IMetrics,) => new FindPlanUsecase(planRepository, metrics),
        inject: [planRepositoryPort, metricsPort],
    },
    {
        provide: deactivatePlanUsecasePort,
        useFactory: (planRepository: IPlanRepository, transactionManager: ITransactionManager, billingGatewayService: IBillingGatewayService,) => new DeactivatePlanUsecase(planRepository, transactionManager, billingGatewayService),
        inject: [planRepositoryPort, transactionPort, billingGatewayServicePort],
    },
];
