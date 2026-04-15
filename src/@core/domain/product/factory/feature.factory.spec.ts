import { describe, it, expect } from 'vitest';
import { FeatureFactory } from './feature.factory';
import { MockFeatureInput, MockFeatureInputList, MockFeature } from '@mock/in-memory.mock';
import { Feature } from '@domain/product/entity/feature.entity';

describe('FeatureFactory', () => {
    it('should create a feature successfully', () => {
        const feature = FeatureFactory.create(MockFeatureInput);
        expect(feature).toBeInstanceOf(Feature);
        expect(feature.name).toBe(MockFeatureInput.name);
        expect(feature.key).toBe(MockFeatureInput.key);
    });

    it('should create bulk features successfully', () => {
        const features = FeatureFactory.createBulk(MockFeatureInputList);
        expect(features).toHaveLength(MockFeatureInputList.length);
        expect(features[0]).toBeInstanceOf(Feature);
        expect(features[1].name).toBe(MockFeatureInputList[1].name);
    });

    it('should rehydrate a feature successfully', () => {
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

    it('should rehydrate bulk features successfully', () => {
        const features = FeatureFactory.rehydrateBulk([MockFeature]);
        expect(features).toHaveLength(1);
        expect(features[0]).toBeInstanceOf(Feature);
        expect(features[0].id).toBe(MockFeature.id);
    });
});
