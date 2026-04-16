import { describe, expect, it, vi, beforeEach, Mock } from 'vitest';
import { FindFeatureUsecase } from './find-feature.usecase';
import { IFeatureRepository } from '@product/port/feature.port';
import { IMetrics } from '@domain/@shared/port/metrics.port';
import { createMetricsMock, createFeatureRepositoryMock } from '@mock/tests.mock';
import { MockFeature } from '@mock/in-memory.mock';
import { FeatureFactory } from '@product/factory/feature.factory';
import { featureKey } from '@product/constant/feature-key.constant';

import { PageParams, sortOrder } from '@domain/@shared/type/page.type';

describe('FindFeatureUsecase', () => {
    let usecase: FindFeatureUsecase;
    let featureRepository: IFeatureRepository;
    let metrics: IMetrics;

    beforeEach(() => {
        featureRepository = createFeatureRepositoryMock();
        metrics = createMetricsMock();
        usecase = new FindFeatureUsecase(featureRepository, metrics);
    });

    const feature = FeatureFactory.rehydrate(MockFeature);

    it('findAll should return a page of features', async () => {
        const page = { list: [feature], count: 1, offset: 1, limit: 10 };
        (featureRepository.findAll as Mock).mockResolvedValue(page);

        const result = await usecase.findAll({ offset: 1, limit: 10, orderBy: 'id', sortOrder: sortOrder.desc });

        expect(result).toBe(page);
        expect(metrics.increment).toHaveBeenCalledWith('feature.queried.all', expect.any(Object));
    });

    it('findById should return a feature by id', async () => {
        (featureRepository.findById as Mock).mockResolvedValue(feature);

        const result = await usecase.findById(1);

        expect(result).toBe(feature);
        expect(metrics.increment).toHaveBeenCalledWith('feature.queried.by-id', { found: 'true' });
    });

    it('findById should return null if feature not found', async () => {
        (featureRepository.findById as Mock).mockResolvedValue(null);

        const result = await usecase.findById(1);

        expect(result).toBeNull();
        expect(metrics.increment).toHaveBeenCalledWith('feature.queried.by-id', { found: 'false' });
    });

    it('findByPlanIdAndKey should return a feature by planId and key', async () => {
        (featureRepository.findByPlanIdAndKey as Mock).mockResolvedValue(feature);

        const result = await usecase.findByPlanIdAndKey(1, featureKey.library);

        expect(result).toBe(feature);
        expect(metrics.increment).toHaveBeenCalledWith('feature.queried.by-key', expect.objectContaining({ found: 'true' }));
    });
});
