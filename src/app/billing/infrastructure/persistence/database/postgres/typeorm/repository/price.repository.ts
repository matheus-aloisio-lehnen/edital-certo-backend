import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { ClsService } from "nestjs-cls";

import { BaseRepository } from "@shared/infrastructure/persistence/database/postgres/typeorm/repository/base/base.repository";
import { Page, PageParams } from "@shared/domain/type/page.type";
import { toQuery } from "@shared/infrastructure/persistence/database/postgres/typeorm/page/to-query.page";
import { IPriceRepository } from "@billing/domain/price/port/price.port";
import { PriceModel } from "@billing/infrastructure/persistence/database/postgres/typeorm/model/price.model";
import { Price } from "@billing/domain/price/entity/price.entity";
import { PriceFactory } from "@billing/domain/price/factory/price.factory";
import { BillingCycle } from "@billing/domain/price/constant/billing-cycle.constant";

@Injectable()
export class PriceRepository extends BaseRepository<PriceModel> implements IPriceRepository {

    constructor(
        @InjectRepository(PriceModel) repo: Repository<PriceModel>,
        cls: ClsService,
    ) {
        super(repo, cls);
    }

    async findAll(params: PageParams): Promise<Page<Price>> {
        const { where, order } = toQuery<PriceModel>(params, ["id"]);

        const [models, count] = await this.repository.findAndCount({
            where,
            order,
            skip: params.offset,
            take: params.limit,
            relations: ["discounts"],
        });

        const list = PriceFactory.rehydrateBulk(models);

        return { list, count, offset: params.offset, limit: params.limit };
    }

    async findById(id: number): Promise<Price | null> {
        const model = await this.repository.findOne({
            where: { id },
            relations: ["discounts"],
        });
        return model ? PriceFactory.rehydrate(model) : null;
    }

    async findByProductIdAndBillingCycle(productId: number, billingCycle: BillingCycle): Promise<Price | null> {
        const model = await this.repository.findOne({
            where: { productId, billingCycle },
            relations: ["discounts"]
        });
        return model
            ? PriceFactory.rehydrate(model)
            : null;
    }

    async save(price: Price): Promise<Price> {
        const model = PriceFactory.toModel(price);
        const newPrice = await this.repository.save(model);
        return PriceFactory.rehydrate(newPrice);
    }

    async saveBulk(prices: Price[]): Promise<Price[]> {
        const modelList = PriceFactory.toModelBulk(prices);
        const newPriceList = await this.repository.save(modelList);
        return PriceFactory.rehydrateBulk(newPriceList);
    }

}
