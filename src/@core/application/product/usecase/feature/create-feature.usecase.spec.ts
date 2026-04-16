import { describe, expect, it, vi, beforeEach, Mock } from 'vitest';
import { CreateFeatureUsecase } from './create-feature.usecase';
import { IFeatureRepository } from '@product/port/feature.port';
import { IProductValidatorService } from '@product/port/product-validator.port';
import {
    createTransactionManagerMock,
    createFeatureRepositoryMock,
    createProductValidatorServiceMock,
} from '@mock/tests.mock';
import { ITransactionManager } from "@domain/@shared/port/transaction.port";
import { MockFeatureInput, MockFeatureInputList } from '@mock/in-memory.mock';
import { Feature } from '@product/entity/feature.entity';

describe('CreateFeatureUsecase', () => {
    let usecase: CreateFeatureUsecase;
    let featureRepository: IFeatureRepository;
    let transactionManager: ITransactionManager;
    let productValidatorService: IProductValidatorService;

    beforeEach(() => {
        featureRepository = createFeatureRepositoryMock();
        transactionManager = createTransactionManagerMock();
        productValidatorService = createProductValidatorServiceMock();

        usecase = new CreateFeatureUsecase(
            featureRepository,
            transactionManager,
            productValidatorService
        );
    });

    it('create should create and save a new feature', async () => {
        const input = MockFeatureInput;
        (featureRepository.save as Mock).mockResolvedValue(undefined as any);

        const result = await usecase.create(input);

        expect(result).toBeInstanceOf(Feature);
        expect(result.key).toBe(input.key);
        expect(productValidatorService.validateFeaturesKeys).toHaveBeenCalledWith([input.key]);
        expect(featureRepository.save).toHaveBeenCalled();
        expect(transactionManager.run).toHaveBeenCalled();
    });

    it('createBulk should create and save multiple features', async () => {
        const inputList = MockFeatureInputList;
        (featureRepository.saveBulk as Mock).mockImplementation((features: Feature[]) => Promise.resolve(features));

        const result = await usecase.createBulk(inputList);

        expect(result).toHaveLength(inputList.length);
        expect(result[0]).toBeInstanceOf(Feature);
        expect(productValidatorService.validateFeaturesKeys).toHaveBeenCalledWith(inputList.map(i => i.key));
        expect(featureRepository.saveBulk).toHaveBeenCalled();
        expect(transactionManager.run).toHaveBeenCalled();
    });
});
