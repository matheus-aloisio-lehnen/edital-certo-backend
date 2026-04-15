import { describe, expect, it, vi, beforeEach } from 'vitest';
import { UpdateFeatureUsecase } from '@application/product/usecase/feature/update-feature.usecase';
import { IFeatureRepository } from '@domain/product/port/feature.port';
import { createTransactionManagerMock } from '@mock/tests.mock';
import { MockFeature } from '@mock/in-memory.mock';
import { FeatureFactory } from '@domain/product/factory/feature.factory';
import { quotaRenewalCycle } from '@domain/product/constant/quota-renewal-cycle.constant';
import { AppException } from '@domain/@shared/exception/app.exception';

describe('UpdateFeatureUsecase', () => {
    let usecase: UpdateFeatureUsecase;
    let featureRepository: IFeatureRepository;
    let transactionManager: any;

    beforeEach(() => {
        featureRepository = {
            findById: vi.fn(),
            save: vi.fn(),
        } as any;
        transactionManager = createTransactionManagerMock();
        usecase = new UpdateFeatureUsecase(featureRepository, transactionManager);
    });

    const createFeature = () => FeatureFactory.rehydrate(MockFeature);

    describe('activate', () => {
        it('should activate a feature', async () => {
            const feature = createFeature();
            vi.spyOn(feature, 'activate');
            (featureRepository.findById as any).mockResolvedValue(feature);

            await usecase.activate(1);

            expect(feature.activate).toHaveBeenCalled();
            expect(featureRepository.save).toHaveBeenCalledWith(feature);
        });

        it('should throw if feature not found', async () => {
            (featureRepository.findById as any).mockResolvedValue(null);
            await expect(usecase.activate(1)).rejects.toThrow(AppException);
        });
    });

    describe('deactivate', () => {
        it('should deactivate a feature', async () => {
            const feature = createFeature();
            vi.spyOn(feature, 'deactivate');
            (featureRepository.findById as any).mockResolvedValue(feature);

            await usecase.deactivate(1);

            expect(feature.deactivate).toHaveBeenCalled();
            expect(featureRepository.save).toHaveBeenCalledWith(feature);
        });
    });

    describe('hide', () => {
        it('should hide a feature', async () => {
            const feature = createFeature();
            vi.spyOn(feature, 'hide');
            (featureRepository.findById as any).mockResolvedValue(feature);

            await usecase.hide(1);

            expect(feature.hide).toHaveBeenCalled();
            expect(featureRepository.save).toHaveBeenCalledWith(feature);
        });
    });

    describe('show', () => {
        it('should show a feature', async () => {
            const feature = createFeature();
            vi.spyOn(feature, 'show');
            (featureRepository.findById as any).mockResolvedValue(feature);

            await usecase.show(1);

            expect(feature.show).toHaveBeenCalled();
            expect(featureRepository.save).toHaveBeenCalledWith(feature);
        });
    });

    describe('enableQuota', () => {
        it('should enable quota for a feature', async () => {
            const feature = createFeature();
            vi.spyOn(feature, 'enableQuota');
            (featureRepository.findById as any).mockResolvedValue(feature);

            await usecase.enableQuota(1, 5, quotaRenewalCycle.monthly);

            expect(feature.enableQuota).toHaveBeenCalledWith(5, quotaRenewalCycle.monthly);
            expect(featureRepository.save).toHaveBeenCalledWith(feature);
        });
    });

    describe('disableQuota', () => {
        it('should disable quota for a feature', async () => {
            const feature = createFeature();
            vi.spyOn(feature, 'disableQuota');
            (featureRepository.findById as any).mockResolvedValue(feature);

            await usecase.disableQuota(1);

            expect(feature.disableQuota).toHaveBeenCalled();
            expect(featureRepository.save).toHaveBeenCalledWith(feature);
        });
    });

    describe('changeQuota', () => {
        it('should change quota for a feature', async () => {
            const feature = createFeature();
            vi.spyOn(feature, 'changeQuota');
            (featureRepository.findById as any).mockResolvedValue(feature);

            await usecase.changeQuota(1, 20);

            expect(feature.changeQuota).toHaveBeenCalledWith(20);
            expect(featureRepository.save).toHaveBeenCalledWith(feature);
        });
    });
});
