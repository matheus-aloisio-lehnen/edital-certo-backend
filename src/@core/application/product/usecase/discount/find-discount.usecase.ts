import { IFindDiscountUsecase, IDiscountRepository } from "@domain/product/port/discount.port";
import { Page, PageParams } from "@domain/@shared/type/page.type";
import { Discount } from "@domain/product/entity/discount.entity";
import { IMetrics } from "@domain/@shared/port/metrics.port";

export class FindDiscountUsecase implements IFindDiscountUsecase {

    constructor(
        private readonly discountRepository: IDiscountRepository,
        private readonly metrics: IMetrics,
    ) {
    }

    async findAll(params: PageParams): Promise<Page<Discount>> {
        const result = await this.discountRepository.findAll(params);
        this.metrics.increment('discount.model.ts.queried.all', { count: String(result.list.length) });
        return result;
    }

    async findAllByPriceId(priceId: number, params: PageParams): Promise<Page<Discount>> {
        const result = await this.discountRepository.findAllByPriceId(priceId, params);
        this.metrics.increment('discount.model.ts.queried.all-by-price-id', { count: String(result.list.length) });
        return result;
    }

    async findById(id: number): Promise<Discount | null> {
        const result = await this.discountRepository.findById(id);
        this.metrics.increment('discount.model.ts.queried.by-id', { found: String(result !== null) });
        return result;
    }

}