import { Feature } from "@domain/product/entity/feature.entity";
import { FeatureKeys } from "@domain/product/constants/feature-keys.constant";
import { ResetWindows } from "@domain/product/constants/reset-window.constant";
import { AppException } from "@domain/@shared/exceptions/app.exception";
import { BackendCode } from "@domain/@shared/constants/backend-code.constant";

describe('Feature Entity', () => {
    it('should create a valid feature with default values', () => {
        const feature = new Feature({
            name: 'Library',
            key: FeatureKeys.library,
            resetWindow: ResetWindows.monthly
        });

        expect(feature.isActive).toBe(false);
        expect(feature.hidden).toBe(true);
        expect(feature.hasQuota).toBe(false);
        expect(feature.quota).toBe(-1);
    });

    it('should throw error if name is empty', () => {
        const createInvalid = () => new Feature({
            name: '',
            key: FeatureKeys.library,
            resetWindow: ResetWindows.monthly
        });

        expect(createInvalid).toThrow(AppException);
        expect(createInvalid).toThrow(expect.objectContaining({
            message: BackendCode.featureNameEmpty
        }));
    });

    it('should throw error if key is missing', () => {
        const createInvalid = () => new Feature({
            name: 'Summary',
            key: undefined as any,
            resetWindow: ResetWindows.monthly
        });

        expect(createInvalid).toThrow(AppException);
        expect(createInvalid).toThrow(expect.objectContaining({
            message: BackendCode.featureKeyEmpty
        }));
    });

    it('should activate and deactivate correctly', () => {
        const feature = new Feature({
            name: 'Write',
            key: FeatureKeys.write,
            resetWindow: ResetWindows.monthly
        });

        expect(feature.isActive).toBe(false);
        feature.activate();
        expect(feature.isActive).toBe(true);

        feature.deactivate();
        expect(feature.isActive).toBe(false);
    });

    it('should toggle visibility', () => {
        const feature = new Feature({
            name: 'Evaluate',
            key: FeatureKeys.evaluate,
            resetWindow: ResetWindows.monthly
        });

        expect(feature.hidden).toBe(true);
        feature.toggleVisibility();
        expect(feature.hidden).toBe(false);

        feature.toggleVisibility();
        expect(feature.hidden).toBe(true);
    });

    it('should set unlimited quota', () => {
        const feature = new Feature({
            name: 'AI Help',
            key: FeatureKeys.aiHelp,
            resetWindow: ResetWindows.monthly,
            hasQuota: true,
            quota: 100
        });

        feature.setUnlimitedQuota();

        expect(feature.hasQuota).toBe(false);
        expect(feature.quota).toBe(-1);
    });
});