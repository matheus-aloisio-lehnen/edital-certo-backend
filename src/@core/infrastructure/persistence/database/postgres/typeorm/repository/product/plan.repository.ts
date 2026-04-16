import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";

import { BaseRepository } from "@persistence/database/postgres/typeorm/repository/base/base.repository";
import { Plan } from "@domain/product/entity/plan.entity";
import { ClsService } from "nestjs-cls";
import { Page, PageParamsInput } from "@domain/@shared/type/page.type";
import { IPlanRepository } from "@domain/product/port/plan.port";
import { PlanKey } from "@domain/product/constant/plan-key.constant";
import { toQuery } from "@persistence/database/postgres/typeorm/page/to-query-options.page";
import { PlanFactory } from "@domain/product/factory/plan.factory";
import { PlanModel } from "@persistence/database/postgres/typeorm/model/product/plan.model";

@Injectable()
export class PlanRepository extends BaseRepository<PlanModel> implements IPlanRepository {

    constructor(
        @InjectRepository(PlanModel) repo: Repository<PlanModel>,
        cls: ClsService,
    ) {
        super(repo, cls);
    }

    async findAll(params: PageParamsInput = {}): Promise<Page<Plan>> {
        const { where, order, skip: offset, take: limit } = toQuery<PlanModel>(params, ["id"]);

        const [models, count] = await this.repository.findAndCount({
            where,
            order,
            skip: offset,
            take: limit,
            relations: ["features", "prices", "prices.discounts"],
        });

        const list = PlanFactory.rehydrateBulk(models);

        return { list, count, offset, limit };
    }

    async findAllByKey(keys: PlanKey[]): Promise<Plan[]> {
        const models = await this.repository.find({
            where: { key: In(keys) },
            relations: ["features", "prices", "prices.discounts"],
        });

        return PlanFactory.rehydrateBulk(models);
    }

    async findById(id: number): Promise<Plan | null> {
        const model = await this.repository.findOne({
            where: { id },
            relations: ["features", "prices", "prices.discounts"]
        });
        return model ? PlanFactory.rehydrate(model) : null;
    }

    async findByKey(key: PlanKey): Promise<Plan | null> {
        const model = await this.repository.findOne({
            where: {
                key
            },
            relations: ["features", "prices", "prices.discounts"]
        });
        return model ? PlanFactory.rehydrate(model) : null;
    }

    async save(plan: Plan): Promise<Plan> {
        const model = await this.repository.save(plan as any);
        return PlanFactory.rehydrate(model);
    }

    async saveBulk(plans: Plan[]): Promise<Plan[]> {
        const models = await this.repository.save(plans as any);
        return PlanFactory.rehydrateBulk(models);
    }

}