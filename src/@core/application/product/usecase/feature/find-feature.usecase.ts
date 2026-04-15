import { Page, PageParams } from "@domain/@shared/type/page.type";
import { IMetrics } from "@domain/@shared/port/metrics.port";
import { IFeatureRepository, IFindFeatureUsecase } from "@domain/product/port/feature.port";
import { Feature } from "@domain/product/entity/feature.entity";
import { FeatureKey } from "@domain/product/constant/feature-key.constant";

export class FindFeatureUseCase implements IFindFeatureUsecase {

    constructor(
        private readonly featureRepository: IFeatureRepository,
        private readonly metrics: IMetrics,
    ) {}

    async findAll(params: PageParams): Promise<Page<Feature>> {
        const result = await this.featureRepository.findAll(params);
        this.metrics.increment('feature.queried.all', { count: String(result.list.length) });
        return result;
    }

    async findById(id: number): Promise<Feature | null> {
        const result = await this.featureRepository.findById(id);
        this.metrics.increment('feature.queried.by-id', { found: String(result !== null) });
        return result;
    }

    async findByPlanIdAndKey(planId:number, key: FeatureKey): Promise<Feature | null> {
        const result = await this.featureRepository.findByPlanIdAndKey(planId, key);
        this.metrics.increment('feature.queried.by-key', { planId: String(planId), key, found: String(result !== null) });
        return result;
    }

}
