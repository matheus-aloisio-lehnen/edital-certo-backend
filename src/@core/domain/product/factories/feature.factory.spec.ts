import { FeatureKeys } from "@domain/product/constants/feature-keys.constant";
import { ResetWindows } from "@domain/product/constants/reset-window.constant";
import { FeatureFactory } from "@domain/product/factories/feature.factory";
import { Feature } from "@domain/product/entity/feature.entity";

describe('Feature Factory', () => {
    const validData = {
        id: 1,
        name: 'AI Help',
        key: FeatureKeys.aiHelp,
        hidden: false,
        isActive: true,
        hasQuota: true,
        quota: 50,
        resetWindow: ResetWindows.monthly
    };

    it('should create a new feature instance with correct defaults', () => {
        const feature = FeatureFactory.create({
            name: 'Library',
            key: FeatureKeys.library,
            resetWindow: ResetWindows.monthly
        });

        expect(feature).toBeInstanceOf(Feature);
        expect(feature.name).toBe('Library');
        expect(feature.id).toBeUndefined();

        expect(feature.isActive).toBe(false);
        expect(feature.hidden).toBe(true);
    });

    it('should rehydrate a feature with existing data bypassing constructor defaults', () => {
        const feature = FeatureFactory.rehydrate(validData);

        expect(feature).toBeInstanceOf(Feature);
        expect(feature.id).toBe(1);
        expect(feature.isActive).toBe(true);
        expect(feature.hidden).toBe(false);
        expect(typeof feature.activate).toBe('function');
    });

    it('should create bulk feature instances', () => {
        const dataList = [
            { name: 'F1', key: FeatureKeys.calendar, resetWindow: ResetWindows.monthly },
            { name: 'F2', key: FeatureKeys.summary, resetWindow: ResetWindows.monthly }
        ];

        const features = FeatureFactory.createBulk(dataList);

        expect(features).toHaveLength(2);
        expect(features[0]).toBeInstanceOf(Feature);
        expect(features[1].name).toBe('F2');
        expect(features[0].isActive).toBe(false);
    });

    it('should rehydrate bulk features from data list', () => {
        const dataList = [
            { ...validData, id: 10 },
            { ...validData, id: 20, name: 'Multi User', key: FeatureKeys.multiUser }
        ];

        const features = FeatureFactory.rehydrateBulk(dataList);

        expect(features).toHaveLength(2);
        expect(features[0].id).toBe(10);
        expect(features[1].id).toBe(20);
        expect(features[1].key).toBe(FeatureKeys.multiUser);
    });

    it('should trigger entity validation only during create', () => {
        const invalidData = { name: '', key: FeatureKeys.write, resetWindow: ResetWindows.monthly };

        expect(() => FeatureFactory.create(invalidData)).toThrow();

        const rehydrated = FeatureFactory.rehydrate(invalidData);
        expect(rehydrated.name).toBe('');
        expect(rehydrated).toBeInstanceOf(Feature);
    });
});