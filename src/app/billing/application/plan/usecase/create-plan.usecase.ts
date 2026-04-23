import { ITransactionManager } from "@shared/domain/port/transaction.port";
import { Plan } from "@billing/domain/plan/entity/plan.entity";
import { PlanFactory } from "@billing/domain/plan/factory/plan.factory";
import { ICreatePlanUsecase, IPlanRepository } from "@billing/domain/plan/port/plan.port";
import { CreatePlanProps } from "@billing/domain/plan/props/create-plan.props";
import { IBillingGatewayService } from "@billing/application/gateway/port/billing-gateway.port";

export class CreatePlanUsecase implements ICreatePlanUsecase {

    constructor(
        private readonly planRepository: IPlanRepository,
        private readonly transactionManager: ITransactionManager,
        private readonly billingGatewayService: IBillingGatewayService,
    ) {
    }

    async execute(input: CreatePlanProps): Promise<Plan> {
        const metadata = {
            name: "CreatePlanUsecase.create",
            data: { input },
            metrics: { planName: input.name },
        };

        return this.transactionManager.run(async () => {
            const plan = await this.planRepository.save(PlanFactory.create(input));
            await this.billingGatewayService.syncPlan(plan);

            return this.planRepository.save(plan);
        }, metadata);
    }

    private async deactivateExistingPlan(plan: Plan): Promise<void> {
        plan.deactivate();

        plan.prices.forEach(price => price.deactivate());

        await this.planRepository.save(plan);

        const pricesToDeactivate = plan.prices.flatMap(price => price.externalPriceId ? [price] : []);
        if (pricesToDeactivate.length)
            await Promise.all(pricesToDeactivate.map(price => this.billingGatewayService.deactivatePrice(price)));

        const discountsToDelete = plan.prices.flatMap(price => price.discount ? [price.discount] : []);
        if (discountsToDelete.length)
            await Promise.all(discountsToDelete.map(discount => this.billingGatewayService.deleteDiscount(discount)));
    }
}
