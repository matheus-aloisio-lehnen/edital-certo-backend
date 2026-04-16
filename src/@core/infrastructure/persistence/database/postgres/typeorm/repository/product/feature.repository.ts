import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";

import { BaseRepository } from "@persistence/database/postgres/typeorm/repository/base/base.repository";
import { Feature } from "@product/entity/feature.entity";
import { ClsService } from "nestjs-cls";
import { Page, PageParams } from "@domain/@shared/type/page.type";
import { IFeatureRepository } from "@product/port/feature.port";
import { FeatureKey } from "@product/constant/feature-key.constant";
import { toQuery } from "@persistence/database/postgres/typeorm/page/to-query.page";
import { FeatureFactory } from "@product/factory/feature.factory";
import { FeatureModel } from "@persistence/database/postgres/typeorm/model/product/feature.model";

@Injectable()
export class FeatureRepository extends BaseRepository<FeatureModel> implements IFeatureRepository {

    constructor(
        @InjectRepository(FeatureModel) repo: Repository<FeatureModel>,
        cls: ClsService,
    ) {
        super(repo, cls);
    }

    async findAll(params: PageParams): Promise<Page<Feature>> {
        const { where, order } = toQuery<FeatureModel>(params, ["id"]);

        const [models, count] = await this.repository.findAndCount({
            where,
            order,
            skip: params.offset,
            take: params.limit,
        });

        const list = FeatureFactory.rehydrateBulk(models);

        return { list, count, offset: params.offset, limit: params.limit };
    }

    async findAllByPlanId(planId: number, params: PageParams): Promise<Page<Feature>> {
        const { where, order } = toQuery<FeatureModel>(
            {
                ...params,
                where: {
                    ...params.where,
                    planId,
                },
            },
            ["id"],
        );

        const [models, count] = await this.repository.findAndCount({
            where,
            order,
            skip: params.offset,
            take: params.limit,
        });

        const list = FeatureFactory.rehydrateBulk(models);

        return { list, count, offset: params.offset, limit: params.limit };
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
        const model = FeatureFactory.toModel(feature);
        const newFeature = await this.repository.save(model);
        return FeatureFactory.rehydrate(newFeature);
    }

    async saveBulk(features: Feature[]): Promise<Feature[]> {
        const models = FeatureFactory.toModelBulk(features);
        const newFeatureList = await this.repository.save(models);
        return FeatureFactory.rehydrateBulk(newFeatureList);
    }

}