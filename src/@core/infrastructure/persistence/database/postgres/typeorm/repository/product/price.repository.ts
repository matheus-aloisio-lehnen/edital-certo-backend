import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";

import { BaseRepository } from "@persistence/database/postgres/typeorm/repository/base/base.repository";
import { Price } from "@product/entity/price.entity";
import { ClsService } from "nestjs-cls";
import { Page, PageParams } from "@domain/@shared/type/page.type";
import { IPriceRepository } from "@product/port/price.port";
import { PriceKey } from "@product/constant/price-key.constant";
import { toQuery } from "@persistence/database/postgres/typeorm/page/to-query.page";
import { PriceFactory } from "@product/factory/price.factory";
import { PriceModel } from "@persistence/database/postgres/typeorm/model/product/price.model";

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

    async findByPlanIdAndKey(planId: number, key: PriceKey): Promise<Price | null> {
        const model = await this.repository.findOne({
            where: { planId, key },
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