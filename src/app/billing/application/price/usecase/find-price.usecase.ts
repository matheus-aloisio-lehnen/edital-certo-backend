import { IFindPriceUsecase, IPriceRepository } from "@billing/domain/price/port/price.port";
import { Page, PageParams } from "@shared/domain/type/page.type";
import { Price } from "@billing/domain/price/entity/price.entity";
import { IMetrics } from "@shared/domain/port/metrics.port";

export class FindPriceUsecase implements IFindPriceUsecase {

    constructor(
        private readonly priceRepository: IPriceRepository,
        private readonly metrics: IMetrics,
    ) {
    }

    async findAll(params: PageParams): Promise<Page<Price>> {
        const result = await this.priceRepository.findAll(params);
        this.metrics.increment('price.queried.all', { count: String(result.list.length) }); return result;
    }

    async findById(id: number): Promise<Price | null> {
        const result = await this.priceRepository.findById(id);
        this.metrics.increment('price.queried.by-id', { found: String(result !== null) }); return result;
    }
}
