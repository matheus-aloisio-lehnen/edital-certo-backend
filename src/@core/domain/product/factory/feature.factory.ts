import { Feature } from "@domain/product/entity/feature.entity";
import { CreateFeatureProps } from "@domain/product/props/create-feature.props";
import { FeatureModel } from "@persistence/database/postgres/typeorm/model/product/feature.model";

export class FeatureFactory {

    static create(props: CreateFeatureProps): Feature {
        return new Feature(props);
    }

    static createBulk(propsList: CreateFeatureProps[]): Feature[] {
        return propsList.map(props => new Feature(props));
    }

    static rehydrate(model: FeatureModel): Feature {
        const feature: Feature = Object.create(Feature.prototype);
        Object.assign(feature, {
            _id: model.id,
            _planId: model.planId,
            _key: model.key,
            _name: model.name,
            _hidden: model.hidden,
            _isActive: model.isActive,
            _hasQuota: model.hasQuota,
            _quota: model.quota,
            _quotaRenewalCycle: model.quotaRenewalCycle,
            _createdAt: model.createdAt,
            _updatedAt: model.updatedAt,
        });
        return feature;
    }

    static rehydrateBulk(modelList: FeatureModel[]): Feature[] {
        return modelList.map(model => this.rehydrate(model));
    }

    static toModel(feature: Feature): FeatureModel {
        const model: FeatureModel = Object.create(FeatureModel.prototype) as FeatureModel;

        model.id = feature.id;
        model.planId = feature.planId;
        model.key = feature.key;
        model.name = feature.name;
        model.hidden = feature.hidden;
        model.isActive = feature.isActive;
        model.hasQuota = feature.hasQuota;
        model.quota = feature.quota;
        model.quotaRenewalCycle = feature.quotaRenewalCycle;

        return model;
    }

    static toModelBulk(featureList: Feature[]): FeatureModel[] {
        return featureList.map(feature => this.toModel(feature));
    }

}