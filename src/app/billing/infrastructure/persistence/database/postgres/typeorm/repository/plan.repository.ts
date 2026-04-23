import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { ClsService } from "nestjs-cls";

import { BaseRepository } from "@shared/infrastructure/persistence/database/postgres/typeorm/repository/base/base.repository";
import { Page, PageParams } from "@shared/domain/type/page.type";
import { toQuery } from "@shared/infrastructure/persistence/database/postgres/typeorm/page/to-query.page";
import { IPlanRepository } from "@billing/domain/plan/port/plan.port";
import { PlanModel } from "@billing/infrastructure/persistence/database/postgres/typeorm/model/plan.model";
import { Plan } from "@billing/domain/plan/entity/plan.entity";
import { PlanFactory } from "@billing/domain/plan/factory/plan.factory";

@Injectable()
export class PlanRepository extends BaseRepository<PlanModel> implements IPlanRepository {

    constructor(
        @InjectRepository(PlanModel) repo: Repository<PlanModel>,
        cls: ClsService,
    ) {
        super(repo, cls);
    }

    async findAll(params: PageParams): Promise<Page<Plan>> {
        const { where, order } = toQuery<PlanModel>(params, ["id"]);

        const [models, count] = await this.repository.findAndCount({
            where,
            order,
            skip: params.offset,
            take: params.limit,
            relations: ["prices", "prices.discounts"],
        });

        const list = PlanFactory.rehydrateBulk(models);

        return { list, count, offset: params.offset, limit: params.limit };
    }

    async findById(id: number): Promise<Plan | null> {
        const model = await this.repository.findOne({
            where: { id },
            relations: ["prices", "prices.discounts"]
        });
        return model ? PlanFactory.rehydrate(model) : null;
    }

    async save(plan: Plan): Promise<Plan> {
        const model = await this.repository.save(plan as any);
        return PlanFactory.rehydrate(model);
    }

}
