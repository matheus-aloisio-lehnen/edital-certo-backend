import { AppException } from "@shared/domain/exception/app.exception";
import { code } from "@shared/domain/constant/code.constant";
import { ITransactionManager } from "@shared/domain/port/transaction.port";
import { Plan } from "@billing/domain/plan/entity/plan.entity";
import { IPlanRepository, IDeactivatePlanUsecase } from "@billing/domain/plan/port/plan.port";
import { IBillingGatewayService } from "@billing/application/gateway/port/billing-gateway.port";
import { Price } from "@billing/domain/price/entity/price.entity";

export class DeactivatePlanUsecase implements IDeactivatePlanUsecase {

    constructor(
        private readonly planRepository: IPlanRepository,
        private readonly transactionManager: ITransactionManager,
        private readonly billingGatewayService: IBillingGatewayService,
    ) {
    }

    async execute(id: number): Promise<Plan> {
        const plan = await this.planRepository.findById(id);
        if (!plan)
            throw new AppException(code.planNotFoundError, 404, `Plan with id ${id} not found`);
        if (!plan.externalPlanId)
            throw new AppException(code.planExternalIdNotFoundError, 404, `ExternalId not found in Plan with id ${id} not found`);

        const metadata = {
            name: "UpdatePlanUsecase.deactivate",
            data: { id },
            metrics: { planId: String(plan.id) },
        };

        plan.deactivate();
        plan.prices.forEach((price: Price) => price.deactivate());

        return this.transactionManager.run(async () => {
            await this.planRepository.save(plan);

            await this.billingGatewayService.deactivatePlan(plan);

            await Promise.all(plan.prices.map((price: Price) => {
                this.billingGatewayService.deactivatePrice(price);

                if (price.discount)
                    this.billingGatewayService.deleteDiscount(price.discount);
            }));

            return plan;
        }, metadata);
    }

}
