import { describe, it, expect } from 'vitest';
import { Feature } from '@domain/product/entity/feature.entity';
import { quotaRenewalCycle } from '@domain/product/constant/quota-renewal-cycle.constant';
import { MockFeatureInput } from '@mock/in-memory.mock';

describe('Feature Entity', () => {
    it('should create a feature successfully', () => {
        const feature = new Feature(MockFeatureInput);

        expect(feature.name).toBe(MockFeatureInput.name);
        expect(feature.key).toBe(MockFeatureInput.key);
        expect(feature.planId).toBe(MockFeatureInput.planId);
        expect(feature.hasQuota).toBe(MockFeatureInput.hasQuota);
        expect(feature.quota).toBe(MockFeatureInput.quota);
        expect(feature.quotaRenewalCycle).toBe(MockFeatureInput.quotaRenewalCycle);
        expect(feature.isActive).toBe(false); // default from constructor
        expect(feature.hidden).toBe(true); // default from constructor
    });

    it('should throw error if name is empty', () => {
        expect(() => new Feature({ ...MockFeatureInput, name: '' })).toThrow();
    });

    it('should throw error if key is empty', () => {
        expect(() => new Feature({ ...MockFeatureInput, key: '' as any })).toThrow();
    });

    it('should throw error if quota is out of bounds when hasQuota is true', () => {
        expect(() => new Feature({ ...MockFeatureInput, hasQuota: true, quota: -2 })).toThrow();
    });

    it('should throw error if quota is not zero when hasQuota is false', () => {
        expect(() => new Feature({ ...MockFeatureInput, hasQuota: false, quota: 10 })).toThrow();
    });

    it('should activate and deactivate', () => {
        const feature = new Feature(MockFeatureInput);
        feature.activate();
        expect(feature.isActive).toBe(true);
        feature.deactivate();
        expect(feature.isActive).toBe(false);
    });

    it('should hide and show', () => {
        const feature = new Feature(MockFeatureInput);
        feature.show();
        expect(feature.hidden).toBe(false);
        feature.hide();
        expect(feature.hidden).toBe(true);
    });

    it('should enable quota', () => {
        const feature = new Feature({ ...MockFeatureInput, hasQuota: false, quota: 0 });
        feature.enableQuota(100, quotaRenewalCycle.monthly);
        expect(feature.hasQuota).toBe(true);
        expect(feature.quota).toBe(100);
        expect(feature.quotaRenewalCycle).toBe(quotaRenewalCycle.monthly);
    });

    it('should disable quota', () => {
        const feature = new Feature(MockFeatureInput);
        feature.disableQuota();
        expect(feature.hasQuota).toBe(false);
        expect(feature.quota).toBe(0);
    });

    it('should change quota', () => {
        const feature = new Feature(MockFeatureInput);
        feature.changeQuota(200);
        expect(feature.quota).toBe(200);
    });

    it('should throw error when changing quota if not enabled', () => {
        const feature = new Feature({ ...MockFeatureInput, hasQuota: false, quota: 0 });
        expect(() => feature.changeQuota(100)).toThrow();
    });

    it('should throw error when changing quota to out of bounds', () => {
        const feature = new Feature(MockFeatureInput);
        expect(() => feature.changeQuota(-2)).toThrow();
    });

    it('should throw error when planId is less than 1', () => {
        expect(() => new Feature({ ...MockFeatureInput, planId: 0 })).toThrow();
    });

    it('should throw error if id is accessed but not set', () => {
        const feature = new Feature(MockFeatureInput);
        expect(() => feature.id).toThrow();
    });

    it('should throw error if planId is accessed but not set', () => {
        const feature = new Feature({ ...MockFeatureInput, planId: undefined });
        expect(() => feature.planId).toThrow();
    });
});
