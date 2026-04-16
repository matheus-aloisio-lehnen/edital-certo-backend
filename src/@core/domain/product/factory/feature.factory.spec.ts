import { describe, it, expect } from 'vitest';
import { FeatureFactory } from './feature.factory';
import { MockFeatureInput, MockFeatureInputList, MockFeature } from '@mock/in-memory.mock';
import { Feature } from '@product/entity/feature.entity';

describe('FeatureFactory', () => {
    it('create should create a feature successfully', () => {
        const feature = FeatureFactory.create(MockFeatureInput);
        expect(feature).toBeInstanceOf(Feature);
        expect(feature.name).toBe(MockFeatureInput.name);
        expect(feature.key).toBe(MockFeatureInput.key);
    });

    it('createBulk should create bulk features successfully', () => {
        const features = FeatureFactory.createBulk(MockFeatureInputList);
        expect(features).toHaveLength(MockFeatureInputList.length);
        expect(features[0]).toBeInstanceOf(Feature);
        expect(features[1].name).toBe(MockFeatureInputList[1].name);
    });

    it('rehydrate should rehydrate a feature successfully', () => {
        const feature = FeatureFactory.rehydrate(MockFeature);
        expect(feature).toBeInstanceOf(Feature);
        expect(feature.id).toBe(MockFeature.id);
        expect(feature.name).toBe(MockFeature.name);
        expect(feature.key).toBe(MockFeature.key);
        expect(feature.planId).toBe(MockFeature.planId);
        expect(feature.hidden).toBe(MockFeature.hidden);
        expect(feature.isActive).toBe(MockFeature.isActive);
        expect(feature.hasQuota).toBe(MockFeature.hasQuota);
        expect(feature.quota).toBe(MockFeature.quota);
        expect(feature.quotaRenewalCycle).toBe(MockFeature.quotaRenewalCycle);
    });

    it('rehydrateBulk should rehydrate bulk features successfully', () => {
        const features = FeatureFactory.rehydrateBulk([MockFeature]);
        expect(features).toHaveLength(1);
        expect(features[0]).toBeInstanceOf(Feature);
        expect(features[0].id).toBe(MockFeature.id);
    });

    it('toModel should convert a feature to model successfully', () => {
        const feature = FeatureFactory.rehydrate(MockFeature);
        const model = FeatureFactory.toModel(feature);
        expect(model.id).toBe(feature.id);
        expect(model.name).toBe(feature.name);
        expect(model.key).toBe(feature.key);
        expect(model.planId).toBe(feature.planId);
    });

    it('toModelBulk should convert bulk features to models successfully', () => {
        const features = FeatureFactory.rehydrateBulk([MockFeature]);
        const models = FeatureFactory.toModelBulk(features);
        expect(models).toHaveLength(1);
        expect(models[0].id).toBe(features[0].id);
        expect(models[0].name).toBe(features[0].name);
    });
});
