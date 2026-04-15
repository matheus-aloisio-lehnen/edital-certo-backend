import { Feature } from "@domain/product/entity/feature.entity";
import { CreateFeatureProps } from "@domain/product/props/create-feature.props";

export class FeatureFactory {

    static create(data: CreateFeatureProps): Feature {
        return new Feature(data);
    }

    static createBulk(dataList: CreateFeatureProps[]): Feature[] {
        return dataList.map(data => new Feature(data));
    }

    static rehydrate(data: any): Feature {
        const feature = Object.create(Feature.prototype);
        Object.assign(feature, {
            _id: data.id,
            _planId: data.planId,
            _key: data.key,
            _name: data.name,
            _order: data.order,
            _hidden: data.hidden,
            _isActive: data.isActive,
            _hasQuota: data.hasQuota,
            _quota: data.quota,
            _quotaRenewalCycle: data.quotaRenewalCycle,
            _createdAt: data.createdAt,
            _updatedAt: data.updatedAt,
            _deletedAt: data.deletedAt,
        });
        return feature;
    }

    static rehydrateBulk(dataList: any[]): Feature[] {
        return dataList.map(data => this.rehydrate(data));
    }

}
