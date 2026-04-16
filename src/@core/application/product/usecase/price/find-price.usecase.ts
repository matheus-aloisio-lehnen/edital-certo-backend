import { IFindPriceUsecase, IPriceRepository } from "@domain/product/port/price.port";
import { Page, PageParamsInput } from "@domain/@shared/type/page.type";
import { Price } from "@domain/product/entity/price.entity";
import { PriceKey } from "@domain/product/constant/price-key.constant";
import { IMetrics } from "@domain/@shared/port/metrics.port";

export class FindPriceUsecase implements IFindPriceUsecase {

    constructor(
        private readonly priceRepository: IPriceRepository,
        private readonly metrics: IMetrics,
    ) {}

    async findAll(params: PageParamsInput): Promise<Page<Price>> {
        const result = await this.priceRepository.findAll(params);
        this.metrics.increment('price.queried.all', { count: String(result.list.length) }); return result;
    }

    async findById(id: number): Promise<Price | null> {
        const result = await this.priceRepository.findById(id);
        this.metrics.increment('price.queried.by-id', { found: String(result !== null) }); return result;
    }

    async findByPlanIdAndKey(planId: number, key: PriceKey): Promise<Price | null> {
        const result = await this.priceRepository.findByPlanIdAndKey(planId, key);
        this.metrics.increment('price.queried.by-key', { planId: String(planId), key, found: String(result !== null) });
        return result;
    }

}