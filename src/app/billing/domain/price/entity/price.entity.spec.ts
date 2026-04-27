import { describe, it, expect } from 'vitest';
import { Price } from '@billing/domain/price/entity/price.entity';
import { AppException } from '@shared/domain/exception/app.exception';
import { code } from '@shared/domain/constant/code.constant';
import { MockPriceInput } from '@mock/in-memory.mock';

describe('Price', () => {
    const validPriceProps = MockPriceInput;

    it('constructor should create a price successfully', () => {
        const price = new Price(validPriceProps);

        expect(price.productId).toBe(validPriceProps.productId);
        expect(price.billingCycle).toBe(validPriceProps.billingCycle);
        expect(price.value).toBe(validPriceProps.value);
        expect(price.discount).toBeDefined();
        expect(price.discount?.name).toBe(validPriceProps.discount?.name);
        expect(price.isActive).toBe(true);
        expect(price.externalPriceId).toBe(validPriceProps.externalPriceId);
    });

    it('validate should throw error if productId is less than 1', () => {
        expect(() => new Price({ ...validPriceProps, productId: 0 })).toThrow(AppException);
    });

    it('validate should throw error if billingCycle is missing', () => {
        expect(() => new Price({ ...validPriceProps, billingCycle: undefined as any })).toThrow(
            new AppException(code.priceBillingCycleEmptyError, 400)
        );
    });

    it('validate should throw error if billingCycle is invalid', () => {
        expect(() => new Price({ ...validPriceProps, billingCycle: 'invalid' as any })).toThrow(
            new AppException(code.priceBillingCycleInvalidError, 400)
        );
    });

    it('validate should throw error if value is negative', () => {
        expect(() => new Price({ ...validPriceProps, value: -1 })).toThrow(
            new AppException(code.priceValueNegativeError, 400)
        );
    });

    it('validate should throw error if externalPriceId is empty string', () => {
        expect(() => new Price({ ...validPriceProps, externalPriceId: ' ' })).toThrow(
            new AppException(code.priceExternalIdEmptyError, 400)
        );
    });

    it('activate should activate and deactivate should deactivate', () => {
        const price = new Price(validPriceProps);
        price.deactivate();
        expect(price.isActive).toBe(false);
        price.activate();
        expect(price.isActive).toBe(true);
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

    it('productId getter should throw error if productId is not set', () => {
        const price = new Price({ ...validPriceProps, productId: undefined });
        expect(() => price.productId).toThrow(new AppException(code.priceProductIdEmptyError, 500));
    });
});
