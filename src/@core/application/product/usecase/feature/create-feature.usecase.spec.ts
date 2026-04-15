import { describe, expect, it, vi, beforeEach } from 'vitest';
import { CreateFeatureUsecase } from '@application/product/usecase/feature/create-feature.usecase';
import { IFeatureRepository } from '@domain/product/port/feature.port';
import { IProductValidatorService } from '@domain/product/port/product-validator.port';
import { createTransactionManagerMock } from '@mock/tests.mock';
import { MockFeatureInput, MockFeatureInputList } from '@mock/in-memory.mock';
import { Feature } from '@domain/product/entity/feature.entity';

describe('CreateFeatureUsecase', () => {
    let usecase: CreateFeatureUsecase;
    let featureRepository: IFeatureRepository;
    let transactionManager: any;
    let productValidatorService: IProductValidatorService;

    beforeEach(() => {
        featureRepository = {
            save: vi.fn(),
            saveBulk: vi.fn(),
        } as any;
        transactionManager = createTransactionManagerMock();
        productValidatorService = {
            validateFeaturesKeys: vi.fn(),
        } as any;

        usecase = new CreateFeatureUsecase(
            featureRepository,
            transactionManager,
            productValidatorService
        );
    });

    describe('create', () => {
        it('should create and save a new feature', async () => {
            const input = MockFeatureInput;
            (featureRepository.save as any).mockResolvedValue(undefined);

            const result = await usecase.create(input);

            expect(result).toBeInstanceOf(Feature);
            expect(result.key).toBe(input.key);
            expect(productValidatorService.validateFeaturesKeys).toHaveBeenCalledWith([input.key]);
            expect(featureRepository.save).toHaveBeenCalled();
            expect(transactionManager.run).toHaveBeenCalled();
        });
    });

    describe('createBulk', () => {
        it('should create and save multiple features', async () => {
            const inputList = MockFeatureInputList;
            (featureRepository.saveBulk as any).mockImplementation((features: Feature[]) => Promise.resolve(features));

            const result = await usecase.createBulk(inputList);

            expect(result).toHaveLength(inputList.length);
            expect(result[0]).toBeInstanceOf(Feature);
            expect(productValidatorService.validateFeaturesKeys).toHaveBeenCalledWith(inputList.map(i => i.key));
            expect(featureRepository.saveBulk).toHaveBeenCalled();
            expect(transactionManager.run).toHaveBeenCalled();
        });
    });
});
