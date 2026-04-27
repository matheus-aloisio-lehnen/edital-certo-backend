import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { ClsService } from "nestjs-cls";

import { BaseRepository } from "@shared/infrastructure/persistence/database/postgres/typeorm/repository/base/base.repository";
import { Page, PageParams } from "@shared/domain/type/page.type";
import { toQuery } from "@shared/infrastructure/persistence/database/postgres/typeorm/page/to-query.page";
import { IProductRepository } from "@billing/domain/product/port/product.port";
import { ProductModel } from "@billing/infrastructure/persistence/database/postgres/typeorm/model/product.model";
import { Product } from "@billing/domain/product/entity/product.entity";
import { ProductFactory } from "@billing/domain/product/factory/product.factory";

@Injectable()
export class ProductRepository extends BaseRepository<ProductModel> implements IProductRepository {

    constructor(
        @InjectRepository(ProductModel) repo: Repository<ProductModel>,
        cls: ClsService,
    ) {
        super(repo, cls);
    }

    async findAll(params: PageParams): Promise<Page<Product>> {
        const { where, order } = toQuery<ProductModel>(params, ["id"]);

        const [models, count] = await this.repository.findAndCount({
            where,
            order,
            skip: params.offset,
            take: params.limit,
            relations: ["prices", "prices.discounts"],
        });

        const list = ProductFactory.rehydrateBulk(models);

        return { list, count, offset: params.offset, limit: params.limit };
    }

    async findById(id: number): Promise<Product | null> {
        const model = await this.repository.findOne({
            where: { id },
            relations: ["prices", "prices.discounts"]
        });
        return model ? ProductFactory.rehydrate(model) : null;
    }

    async save(product: Product): Promise<Product> {
        const model = await this.repository.save(ProductFactory.toModel(product));
        return ProductFactory.rehydrate(model);
    }

}
