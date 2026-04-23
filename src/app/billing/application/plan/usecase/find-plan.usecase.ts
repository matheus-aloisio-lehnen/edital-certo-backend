import { IFindPlanUsecase, IPlanRepository } from "@billing/domain/plan/port/plan.port";
import { Page, PageParams } from "@shared/domain/type/page.type";
import { Plan } from "@billing/domain/plan/entity/plan.entity";
import { IMetrics } from "@shared/domain/port/metrics.port";

export class FindPlanUsecase implements IFindPlanUsecase {

    constructor(
        private readonly planRepository: IPlanRepository,
        private readonly metrics: IMetrics,
    ) {
    }

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
}
