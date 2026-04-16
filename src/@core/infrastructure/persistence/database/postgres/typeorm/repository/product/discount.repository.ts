
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";

import { BaseRepository } from "@persistence/database/postgres/typeorm/repository/base/base.repository";
import { Discount } from "@domain/product/entity/discount.entity";
import { ClsService } from "nestjs-cls";
import { buildPageParams, Page, PageParamsInput } from "@domain/@shared/type/page.type";
import { IDiscountRepository } from "@domain/product/port/discount.port";
import { toQuery } from "@persistence/database/postgres/typeorm/page/to-query-options.page";
import { DiscountFactory } from "@domain/product/factory/discount.factory";
import { DiscountModel } from "@persistence/database/postgres/typeorm/model/product/discount.model";

@Injectable()
export class DiscountRepository extends BaseRepository<DiscountModel> implements IDiscountRepository {

    allowedOrderBy: string[];

    constructor(
        @InjectRepository(DiscountModel) repo: Repository<DiscountModel>,
        cls: ClsService,
    ) {
        super(repo, cls);
        this.allowedOrderBy = ["id", "priceId", "name", "key", "type", "duration", "campaignStartsAt", "campaignEndsAt"]
    }

    async findAll(params: PageParamsInput = {}): Promise<Page<Discount>> {
        const { where, order, skip: offset, take: limit } = toQuery<DiscountModel>(params, this.allowedOrderBy);

        const [models, count] = await this.repository.findAndCount({
            where,
            order,
            skip: offset,
            take: limit,
        });

        const list = DiscountFactory.rehydrateBulk(models);

        return { list, count, offset, limit };
    }

    async findAllByPriceId(priceId: number, params: PageParamsInput = {}): Promise<Page<Discount>> {
        const { where: baseWhere, order, skip: offset, take: limit } = toQuery<DiscountModel>(params, this.allowedOrderBy);

        const where = baseWhere
            ? { ...baseWhere, priceId }
            : { priceId };

        const [models, count] = await this.repository.findAndCount({
            where,
            order,
            skip: offset,
            take: limit,
        });

        const list = DiscountFactory.rehydrateBulk(models);

        return { list, count, offset, limit };
    }

    async findById(id: number): Promise<Discount | null> {
        const model = await this.repository.findOne({
            where: { id }
        });
        return model ? DiscountFactory.rehydrate(model) : null;
    }

    async save(discount: Discount): Promise<Discount> {
        const model = DiscountFactory.toModel(discount);
        const newDiscount = await this.repository.save(model);
        return DiscountFactory.rehydrate(newDiscount);
    }

    async delete(id: number): Promise<boolean> {
        const result = await this.repository.softDelete(id);
        return result.affected ? result.affected > 0 : false;
    }

}
