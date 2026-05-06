import { describe, it, expect } from 'vitest';
import { Price } from '@billing/domain/price/entity/price.entity';
import { AppException } from '@shared/domain/exception/app.exception';
import { code } from '@shared/domain/constant/errors.constant';
import { billingCycle } from '@billing/domain/price/constant/billing-cycle.constant';
import { billingType } from '@billing/domain/price/constant/billing-type.constant';
import { MockDiscountInput, MockNestedPriceInput, MockPriceInput } from '@mock/in-memory.mock';

describe('Price', () => {
    const validPriceProps = MockPriceInput;

    it('constructor should create a price successfully', () => {
        const price = new Price(validPriceProps);

        expect(price.productId).toBe(validPriceProps.productId);
        expect(price.cycle).toBe(validPriceProps.cycle);
        expect(price.type).toBe(validPriceProps.type);
        expect(price.value).toBe(validPriceProps.value);
        expect(price.version).toBe(validPriceProps.version);
        expect(price.externalPriceId).toBe(validPriceProps.externalPriceId);
    });

    it('validate should throw error if productId is less than 1', () => {
        expect(() => new Price({ ...validPriceProps, productId: 0 })).toThrow(AppException);
    });

    it('validate should throw error if cycle is missing', () => {
        expect(() => new Price({ ...validPriceProps, cycle: undefined as any })).toThrow(
            new AppException(code.priceCycleEmptyError, 400)
        );
    });

    it('validate should throw error if cycle is invalid', () => {
        expect(() => new Price({ ...validPriceProps, cycle: 'invalid' as any })).toThrow(
            new AppException(code.priceCycleInvalidError, 400)
        );
    });

    it('validate should throw error if value is negative', () => {
        expect(() => new Price({ ...validPriceProps, value: -1 })).toThrow(
            new AppException(code.priceValueNegativeError, 400)
        );
    });

    it('validate should throw error if value is not integer', () => {
        expect(() => new Price({ ...validPriceProps, value: 19.99 as any })).toThrow(
            new AppException(code.priceValueNegativeError, 400)
        );
    });

    it('validate should throw error if externalPriceId is empty string', () => {
        expect(() => new Price({ ...validPriceProps, externalPriceId: ' ' })).toThrow(code.priceExternalIdEmptyError);
    });

    it('should create price with discount', () => {
        const price = new Price({ ...validPriceProps, discount: MockDiscountInput });
        expect(price.discount?.name).toBe(MockDiscountInput.name);
    });

    it('should default version to 1', () => {
        const price = new Price({ ...validPriceProps, version: undefined });
        expect(price.version).toBe(1);
    });

    it('linkExternalPriceId should link external price id', () => {
        const price = new Price(validPriceProps);
        price.linkExternalPriceId('new_ext_price_id');
        expect(price.externalPriceId).toBe('new_ext_price_id');
    });

    it('id getter should throw error if id is not set', () => {
        const price = new Price(validPriceProps);
        expect(() => price.id).toThrow(AppException);
    });

    it('should allow price without productId for nested product creation', () => {
        const price = new Price(MockNestedPriceInput);
        expect(price.productId).toBeUndefined();
    });
});
