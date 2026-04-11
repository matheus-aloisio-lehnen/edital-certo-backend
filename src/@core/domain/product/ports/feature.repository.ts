import { Feature } from "@domain/product/entity/feature.entity";
import { FeatureKey } from "@domain/product/constants/feature-keys.constant";

export interface FeatureRepository {
    findAll(): Promise<Feature[]>;
    findOneById(id: number): Promise<Feature | null>;
    findOneByKey(key: FeatureKey): Promise<Feature | null>;
    save(feature: Feature): Promise<void>;
    saveBulk(features: Feature[]): Promise<void>;
    delete(id: number): Promise<void>;
    deleteBulk(ids: number[]): Promise<void>;
}