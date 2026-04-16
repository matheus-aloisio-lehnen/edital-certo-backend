
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";

import { BaseRepository } from "@persistence/database/postgres/typeorm/repository/base/base.repository";
import { Discount } from "@product/entity/discount.entity";
import { ClsService } from "nestjs-cls";
import { Page, PageParams } from "@domain/@shared/type/page.type";
import { IDiscountRepository } from "@product/port/discount.port";
import { toQuery } from "@persistence/database/postgres/typeorm/page/to-query.page";
import { DiscountFactory } from "@product/factory/discount.factory";
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

    async findAll(params: PageParams): Promise<Page<Discount>> {
        const { where, order } = toQuery<DiscountModel>(params, this.allowedOrderBy);

        const [models, count] = await this.repository.findAndCount({
            where,
            order,
            skip: params.offset,
            take: params.limit,
        });


        const list = DiscountFactory.rehydrateBulk(models);

        return { list, count, offset: params.offset, limit: params.limit };
    }

    async findAllByPriceId(priceId: number, params: PageParams): Promise<Page<Discount>> {
        const query = toQuery<DiscountModel>(
            {
                ...params,
                where: {
                    ...params.where,
                    priceId,
                },
            },
            this.allowedOrderBy,
        );

        const [models, count] = await this.repository.findAndCount({
            where: query.where,
            order: query.order,
            skip: params.offset,
            take: params.limit,
        });

        const list = DiscountFactory.rehydrateBulk(models);

        return {
            list,
            count,
            offset: params.offset,
            limit: params.limit,
        };
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
