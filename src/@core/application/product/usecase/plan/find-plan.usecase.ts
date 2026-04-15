import { IFindPlanUsecase, IPlanRepository } from "@domain/product/port/plan.port";
import { Page, PageParams } from "@domain/@shared/type/page.type";
import { Plan } from "@domain/product/entity/plan.entity";
import { PlanKey } from "@domain/product/constant/plan-key.constant";
import { IMetrics } from "@domain/@shared/port/metrics.port";

export class FindPlanUseCase implements IFindPlanUsecase {

    constructor(
        private readonly planRepository: IPlanRepository,
        private readonly metrics: IMetrics,
    ) {}

    async findAll(params: PageParams): Promise<Page<Plan>> {
        const result = await this.planRepository.findAll(params);
        this.metrics.increment('plan.queried.all', { count: String(result.list.length) });
        return result;
    }

    async findById(id: number): Promise<Plan | null> {
        const result = await this.planRepository.findById(id);
        this.metrics.increment('plan.queried.by-id', { found: String(result !== null) });
        return result;
    }

    async findByKey(key: PlanKey): Promise<Plan | null> {
        const result = await this.planRepository.findByKey(key);
        this.metrics.increment('plan.queried.by-key', { key, found: String(result !== null) });
        return result;
    }
}
