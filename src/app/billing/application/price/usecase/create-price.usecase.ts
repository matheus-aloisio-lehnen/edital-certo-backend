import { AppException } from "@shared/domain/exception/app.exception";
import { code } from "@shared/domain/constant/code.constant";
import { ITransactionManager } from "@shared/domain/port/transaction.port";
import { Price } from "@billing/domain/price/entity/price.entity";
import { Plan } from "@billing/domain/plan/entity/plan.entity";
import { PriceFactory } from "@billing/domain/price/factory/price.factory";
import { IPlanRepository } from "@billing/domain/plan/port/plan.port";
import { ICreatePriceUsecase, IPriceRepository } from "@billing/domain/price/port/price.port";
import { IBillingGatewayService } from "@billing/application/gateway/port/billing-gateway.port";
import { CreatePriceProps } from "@billing/domain/price/props/create-price.props";

export class CreatePriceUsecase implements ICreatePriceUsecase {

    constructor(
        private readonly priceRepository: IPriceRepository,
        private readonly planRepository: IPlanRepository,
        private readonly transactionManager: ITransactionManager,
        private readonly billingGatewayService: IBillingGatewayService,
    ) {
    }

    async execute(input: CreatePriceProps): Promise<Price> {
        const metadata = {
            name: "CreatePriceUsecase.create",
            data: { input },
            metrics: { billingCycle: input.billingCycle },
        };

        return this.transactionManager.run(async () => {
            const plan = await this.getPlan(input.planId);

            if (!plan.externalPlanId)
                throw new AppException(code.planExternalIdNotFoundError, 400, `ExternalId not found in Plan with id ${plan.id} not found`);

            const existingPrice = await this.priceRepository.findByPlanIdAndBillingCycle(plan.id, input.billingCycle);
            if (existingPrice)
                this.deactivateExistingPrice(existingPrice);

            if (existingPrice)
                await this.priceRepository.save(existingPrice);

            const price = await this.priceRepository.save(PriceFactory.create(input));
            await this.billingGatewayService.syncPrice(plan.id, this.getExternalPlanId(plan), price);

            if (price.discount)
                await this.billingGatewayService.syncDiscount(price.discount);

            return this.priceRepository.save(price);
        }, metadata);
    }

    private async getPlan(planId?: number): Promise<Plan> {
        if (!planId)
            throw new AppException(code.planIdEmptyError, 400, "PlanId is required");

        const plan = await this.planRepository.findById(planId);
        if (!plan)
            throw new AppException(code.planNotFoundError, 404, `Plan with id ${planId} not found`);

        return plan;
    }

    private getExternalPlanId(plan: Plan): string {
        if (!plan.externalPlanId)
            throw new AppException(code.planExternalIdNotFoundError, 400, `ExternalId not found in Plan with id ${plan.id} not found`);

        return plan.externalPlanId;
    }

    private deactivateExistingPrice(price: Price): void {
        price.deactivate();
    }
}
