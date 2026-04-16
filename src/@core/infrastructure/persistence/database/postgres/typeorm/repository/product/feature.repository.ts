
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";

import { BaseRepository } from "@persistence/database/postgres/typeorm/repository/base/base.repository";
import { Feature } from "@domain/product/entity/feature.entity";
import { ClsService } from "nestjs-cls";
import { Page, PageParamsInput } from "@domain/@shared/type/page.type";
import { IFeatureRepository } from "@domain/product/port/feature.port";
import { FeatureKey } from "@domain/product/constant/feature-key.constant";
import { toQuery } from "@persistence/database/postgres/typeorm/page/to-query-options.page";
import { FeatureFactory } from "@domain/product/factory/feature.factory";
import { FeatureModel } from "@persistence/database/postgres/typeorm/model/product/feature.model";

@Injectable()
export class FeatureRepository extends BaseRepository<FeatureModel> implements IFeatureRepository {

    constructor(
        @InjectRepository(FeatureModel) repo: Repository<FeatureModel>,
        cls: ClsService,
    ) {
        super(repo, cls);
    }

    async findAll(params: PageParamsInput = {}): Promise<Page<Feature>> {
        const { where, order, skip: offset, take: limit } = toQuery<FeatureModel>(params, ["id"]);

        const [models, count] = await this.repository.findAndCount({
            where,
            order,
            skip: offset,
            take: limit,
        });

        const list = FeatureFactory.rehydrateBulk(models);

        return { list, count, offset, limit };
    }

    async findAllByPlanId(planId: number, params: PageParamsInput = {}): Promise<Page<Feature>> {
        const { where: baseWhere, order, skip: offset, take: limit } = toQuery<FeatureModel>(params, ["id"]);

        const where = baseWhere
            ? { ...baseWhere, planId }
            : { planId };

        const [models, count] = await this.repository.findAndCount({
            where,
            order,
            skip: offset,
            take: limit,
        });

        const list = FeatureFactory.rehydrateBulk(models);

        return { list, count, offset, limit };
    }

    async findById(id: number): Promise<Feature | null> {
        const model = await this.repository.findOne({
            where: { id }
        });
        return model ? FeatureFactory.rehydrate(model) : null;
    }

    async findByPlanIdAndKey(planId: number, key: FeatureKey): Promise<Feature | null> {
        const model = await this.repository.findOne({
            where: { planId, key }
        });
        return model ? FeatureFactory.rehydrate(model) : null;
    }

    async save(feature: Feature): Promise<Feature> {
        const model = await this.repository.save(feature as any);
        return FeatureFactory.rehydrate(model);
    }

    async saveBulk(features: Feature[]): Promise<Feature[]> {
        const models = await this.repository.save(features as any);
        return FeatureFactory.rehydrateBulk(models);
    }

}
