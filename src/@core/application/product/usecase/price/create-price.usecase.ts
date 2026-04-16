import { AppException } from "@domain/@shared/exception/app.exception";
import { code } from "@domain/@shared/constant/code.constant";
import { ITransactionManager } from "@domain/@shared/port/transaction.port";
import { Price } from "@product/entity/price.entity";
import { Plan } from "@product/entity/plan.entity";
import { PriceFactory } from "@product/factory/price.factory";
import { IPlanRepository } from "@product/port/plan.port";
import { ICreatePriceUsecase, IPriceRepository } from "@product/port/price.port";
import { IProductGatewayService } from "@product/port/product-payment-gateway.port";
import { IProductValidatorService } from "@product/port/product-validator.port";
import { CreatePriceProps } from "@product/props/create-price.props";

export class CreatePriceUsecase implements ICreatePriceUsecase {

    constructor(
        private readonly priceRepository: IPriceRepository,
        private readonly planRepository: IPlanRepository,
        private readonly transactionManager: ITransactionManager,
        private readonly productGatewayService: IProductGatewayService,
        private readonly productValidatorService: IProductValidatorService,
    ) {
    }

    async create(input: CreatePriceProps): Promise<Price> {
        const metadata = {
            name: "CreatePriceUsecase.create",
            data: { input },
            metrics: { priceKey: input.key },
        };

        return this.transactionManager.run(async () => {
            const plan = await this.getPlan(input.planId);

            if (!plan.externalPlanId)
                throw new AppException(code.planExternalIdNotFoundError, 400, `ExternalId not found in Plan with id ${plan.id} not found`);

            this.productValidatorService.validatePriceKeys([input.key]);

            if (input.discount?.key)
                this.productValidatorService.validateDiscountKeys([input.discount.key]);

            const existingPrice = await this.priceRepository.findByPlanIdAndKey(plan.id, input.key);
            if (existingPrice)
                this.deactivateExistingPrice(existingPrice);

            if (existingPrice)
                await this.priceRepository.save(existingPrice);

            const price = await this.priceRepository.save(PriceFactory.create(input));
            await this.productGatewayService.syncPrice(plan.id, plan.key, this.getExternalPlanId(plan), price);

            if (price.discount)
                await this.productGatewayService.syncDiscount(price.currency, price.discount);

            return this.priceRepository.save(price);
        }, metadata);
    }

    async createBulk(inputList: CreatePriceProps[]): Promise<Price[]> {
        const metadata = {
            name: "CreatePriceUsecase.createBulk",
            data: { inputList },
            metrics: { count: String(inputList.length) },
        };

        return this.transactionManager.run(async () => {
            this.validateBulkKeys(inputList);

            const plans = await this.getPlans(inputList);
            const planById = new Map(plans.map(plan => [plan.id, plan]));

            const existingPrices = await Promise.all(
                inputList.map(input => this.priceRepository.findByPlanIdAndKey(input.planId!, input.key)),
            );

            const pricesToDeactivate = existingPrices.flatMap(price => price?.isActive ? [price] : []);
            pricesToDeactivate.forEach(price => this.deactivateExistingPrice(price));

            if (pricesToDeactivate.length)
                await this.priceRepository.saveBulk(pricesToDeactivate);

            const prices = await this.priceRepository.saveBulk(PriceFactory.createBulk(inputList));

            await Promise.all(prices.map(async price => {
                const plan = planById.get(price.planId);

                if (!plan)
                    throw new AppException(code.planNotFoundError, 404, `Plan with id ${price.planId} not found`);

                await this.productGatewayService.syncPrice(plan.id, plan.key, this.getExternalPlanId(plan), price);

                if (price.discount)
                    await this.productGatewayService.syncDiscount(price.currency, price.discount);
            }));

            return this.priceRepository.saveBulk(prices);
        }, metadata);
    }

    private validateBulkKeys(inputList: CreatePriceProps[]): void {
        const priceKeys = inputList.map(input => input.key);
        this.productValidatorService.validatePriceKeys(priceKeys);

        const discountKeys = inputList
            .filter(input => input.discount)
            .map(input => input.discount!.key);

        if (discountKeys.length)
            this.productValidatorService.validateDiscountKeys(discountKeys);
    }

    private async getPlans(inputList: CreatePriceProps[]): Promise<Plan[]> {
        const planIds = inputList.map(input => input.planId);

        if (planIds.some(planId => !planId))
            throw new AppException(code.planIdEmptyError, 400, "PlanId is required");

        const uniquePlanIds = [...new Set(planIds)];

        return Promise.all(uniquePlanIds.map(planId => this.getPlan(planId!)));
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