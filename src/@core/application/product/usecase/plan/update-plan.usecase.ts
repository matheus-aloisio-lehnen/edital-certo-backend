import { AppException } from "@domain/@shared/exception/app.exception";
import { code } from "@domain/@shared/constant/code.constant";
import { ITransactionManager } from "@domain/@shared/port/transaction.port";
import { Plan } from "@domain/product/entity/plan.entity";
import { IPlanRepository, IUpdatePlanUsecase } from "@domain/product/port/plan.port";
import { IProductGatewayService } from "@domain/product/port/product-payment-gateway.port";

export class UpdatePlanUsecase implements IUpdatePlanUsecase {

    constructor(
        private readonly planRepository: IPlanRepository,
        private readonly transactionManager: ITransactionManager,
        private readonly productGatewayService: IProductGatewayService,
    ) {}

    async deactivate(id: number): Promise<Plan> {
        const plan = await this.planRepository.findById(id);
        if (!plan)
            throw new AppException(code.planNotFoundError, 404, `Plan with id ${id} not found`);
        if (!plan.externalPlanId)
            throw new AppException(code.planExternalIdNotFoundError, 404, `ExternalId not found in Plan with id ${id} not found`);

        const metadata = {
            name: "UpdatePlanUsecase.deactivate",
            data: { id },
            metrics: { planKey: plan.key },
        };

        plan.deactivate();
        plan.prices.forEach(price => price.deactivate());

        return this.transactionManager.run(async () => {
            await this.planRepository.save(plan);

            await this.productGatewayService.deactivatePlan(plan);

            await Promise.all(plan.prices.map(price => {
                this.productGatewayService.deactivatePrice(price);

                if (price.discount)
                    this.productGatewayService.deleteDiscount(price.discount);
            }));

            return plan;
        }, metadata);
    }

}