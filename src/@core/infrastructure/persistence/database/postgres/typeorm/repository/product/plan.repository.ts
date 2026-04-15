import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";

import { BaseRepository } from "@persistence/database/postgres/typeorm/repository/base/transactional.repository";
import { Plan } from "@domain/product/entity/plan.entity";
import { ClsService } from "nestjs-cls";
import { Page, PageParams } from "@domain/@shared/type/page.type";
import { IPlanRepository } from "@domain/product/port/plan.port";
import { PlanKey } from "@domain/product/constant/plan-key.constant";
import { toQueryOptions } from "@persistence/database/postgres/typeorm/page/to-query-options.page";

@Injectable()
export class PlanRepository extends BaseRepository<Plan> implements IPlanRepository {

    constructor(
        @InjectRepository(Plan) repo: Repository<Plan>,
        cls: ClsService,
    ) {
        super(repo, cls);
    }

    async findAll(params: PageParams = {}): Promise<Page<Plan>> {
        const { options, offset, limit } = toQueryOptions<Plan>(params, ["id"]);

        const [list, count] = await this.repository.findAndCount(options);

        return { list, count, offset, limit };
    }

    async findAllByKey(keys: PlanKey[]): Promise<Plan[]> {
        return await this.repository.find({
            where: {
                key: In(keys)
            }
        });
    }

    async findById(id: number): Promise<Plan | null> {
        return await this.repository.findOne({ where: { id } });
    }

    async findByKey(key: PlanKey): Promise<Plan | null> {
        return await this.repository.findOne({
            where: {
                key
            }
        });
    }

    async save(plan: Plan): Promise<Plan> {
        return await this.repository.save(plan);
    }

    async saveBulk(plans: Plan[]): Promise<Plan[]> {
        return await this.repository.save(plans);
    }

}