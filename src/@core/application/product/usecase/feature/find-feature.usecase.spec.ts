import { describe, expect, it, vi, beforeEach } from 'vitest';
import { FindFeatureUsecase } from './find-feature.usecase';
import { IFeatureRepository } from '@domain/product/port/feature.port';
import { IMetrics } from '@domain/@shared/port/metrics.port';
import { createMetricsMock } from '@mock/tests.mock';
import { MockFeature } from '@mock/in-memory.mock';
import { FeatureFactory } from '@domain/product/factory/feature.factory';
import { featureKey } from '@domain/product/constant/feature-key.constant';

describe('FindFeatureUsecase', () => {
    let usecase: FindFeatureUsecase;
    let featureRepository: IFeatureRepository;
    let metrics: IMetrics;

    beforeEach(() => {
        featureRepository = {
            findAll: vi.fn(),
            findById: vi.fn(),
            findByPlanIdAndKey: vi.fn(),
        } as any;
        metrics = createMetricsMock();
        usecase = new FindFeatureUsecase(featureRepository, metrics);
    });

    const feature = FeatureFactory.rehydrate(MockFeature);

    describe('findAll', () => {
        it('should return a page of features', async () => {
            const page = { list: [feature], total: 1 };
            (featureRepository.findAll as any).mockResolvedValue(page);

            const result = await usecase.findAll({ offset: 1, limit: 10 });

            expect(result).toBe(page);
            expect(metrics.increment).toHaveBeenCalledWith('feature.queried.all', expect.any(Object));
        });
    });

    describe('findById', () => {
        it('should return a feature by id', async () => {
            (featureRepository.findById as any).mockResolvedValue(feature);

            const result = await usecase.findById(1);

            expect(result).toBe(feature);
            expect(metrics.increment).toHaveBeenCalledWith('feature.queried.by-id', { found: 'true' });
        });

        it('should return null if feature not found', async () => {
            (featureRepository.findById as any).mockResolvedValue(null);

            const result = await usecase.findById(1);

            expect(result).toBeNull();
            expect(metrics.increment).toHaveBeenCalledWith('feature.queried.by-id', { found: 'false' });
        });
    });

    describe('findByPlanIdAndKey', () => {
        it('should return a feature by planId and key', async () => {
            (featureRepository.findByPlanIdAndKey as any).mockResolvedValue(feature);

            const result = await usecase.findByPlanIdAndKey(1, featureKey.library);

            expect(result).toBe(feature);
            expect(metrics.increment).toHaveBeenCalledWith('feature.queried.by-key', expect.objectContaining({ found: 'true' }));
        });
    });
});
