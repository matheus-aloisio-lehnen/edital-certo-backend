import { Feature } from "@domain/product/entity/feature.entity";
import { CreateFeatureInput } from "@domain/product/types/feature.type";

export class FeatureFactory {

    static create(data: CreateFeatureInput): Feature {
        return new Feature(data);
    }

    static createBulk(dataList: CreateFeatureInput[]): Feature[] {
        return dataList.map(data => new Feature(data));
    }

    static rehydrate(data: any): Feature {
        const feature = Object.create(Feature.prototype);
        Object.assign(feature, data);
        return feature;
    }

    static rehydrateBulk(dataList: any[]): Feature[] {
        return dataList.map(data => this.rehydrate(data));
    }

}