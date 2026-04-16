import { ITransactionManager } from "@domain/@shared/port/transaction.port";
import { Plan } from "@product/entity/plan.entity";
import { PlanFactory } from "@product/factory/plan.factory";
import { ICreatePlanUsecase, IPlanRepository } from "@product/port/plan.port";
import { CreatePlanProps } from "@product/props/create-plan.props";
import { IProductGatewayService } from "@product/port/product-payment-gateway.port";
import { IProductValidatorService } from "@product/port/product-validator.port";

export class CreatePlanUsecase implements ICreatePlanUsecase {

    constructor(
        private readonly planRepository: IPlanRepository,
        private readonly transactionManager: ITransactionManager,
        private readonly productGatewayService: IProductGatewayService,
        private readonly productValidatorService: IProductValidatorService,
    ) {
    }

    async create(input: CreatePlanProps): Promise<Plan> {
        const metadata = {
            name: "CreatePlanUsecase.create",
            data: { input },
            metrics: { planKey: input.key },
        };

        return this.transactionManager.run(async () => {
            this.productValidatorService.validatePlanKeys([input.key]);

            const existingPlan = await this.planRepository.findByKey(input.key);
            if (existingPlan)
                await this.deactivateExistingPlan(existingPlan);

            const plan = await this.planRepository.save(PlanFactory.create(input));
            await this.productGatewayService.syncPlan(plan);

            return this.planRepository.save(plan);
        }, metadata);
    }

    async createBulk(inputList: CreatePlanProps[]): Promise<Plan[]> {
        const metadata = {
            name: "CreatePlanUsecase.createBulk",
            data: { inputList },
            metrics: { count: String(inputList.length) },
        };

        return this.transactionManager.run(async () => {
            this.validateBulkKeys(inputList);

            const planKeys = inputList.map(input => input.key);
            const existingPlans = await this.planRepository.findAllByKey(planKeys);

            await Promise.all(existingPlans.map(plan => this.deactivateExistingPlan(plan)));

            const plans = await this.planRepository.saveBulk(PlanFactory.createBulk(inputList));

            await Promise.all(plans.map(plan => this.productGatewayService.syncPlan(plan)));

            return this.planRepository.saveBulk(plans);
        }, metadata);
    }

    private validateBulkKeys(inputList: CreatePlanProps[]): void {
        const planKeys = inputList.map(input => input.key);
        this.productValidatorService.validatePlanKeys(planKeys);

        const priceKeys = inputList.flatMap(input => input.prices.map(price => price.key));
        this.productValidatorService.validatePriceKeys(priceKeys);

        const discountKeys = inputList.flatMap(input => input.prices
            .filter(price => price.discount)
            .map(price => price.discount!.key),
        );
        this.productValidatorService.validateDiscountKeys(discountKeys);
    }

    private async deactivateExistingPlan(plan: Plan): Promise<void> {
        plan.deactivate();

        plan.prices.forEach(price => price.deactivate());

        await this.planRepository.save(plan);

        const pricesToDeactivate = plan.prices.flatMap(price => price.externalPriceId ? [price] : []);
        if (pricesToDeactivate.length)
            await Promise.all(pricesToDeactivate.map(price => this.productGatewayService.deactivatePrice(price)));

        const discountsToDelete = plan.prices.flatMap(price => price.discount ? [price.discount] : []);
        if (discountsToDelete.length)
            await Promise.all(discountsToDelete.map(discount => this.productGatewayService.deleteDiscount(discount)));
    }
}