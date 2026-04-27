import { IFindProductUsecase, IProductRepository } from "@billing/domain/product/port/product.port";
import { Page, PageParams } from "@shared/domain/type/page.type";
import { Product } from "@billing/domain/product/entity/product.entity";
import { IMetrics } from "@shared/domain/port/metrics.port";

export class FindProductUsecase implements IFindProductUsecase {

    constructor(
        private readonly productRepository: IProductRepository,
        private readonly metrics: IMetrics,
    ) {
    }

    async findAll(params: PageParams): Promise<Page<Product>> {
        const result = await this.productRepository.findAll(params);
        this.metrics.increment('product.queried.all', { count: String(result.list.length) });
        return result;
    }

    async findById(id: number): Promise<Product | null> {
        const result = await this.productRepository.findById(id);
        this.metrics.increment('product.queried.by-id', { found: String(result !== null) });
        return result;
    }
}
