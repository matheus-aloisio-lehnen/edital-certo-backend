import { describe, it, expect } from 'vitest';
import { Price } from '@domain/product/entity/price.entity';
import { AppException } from '@domain/@shared/exception/app.exception';
import { code } from '@domain/@shared/constant/code.constant';
import { MockPriceInput } from '@mock/in-memory.mock';

describe('Price Entity', () => {
    const validPriceProps = MockPriceInput;

    it('should create a price successfully', () => {
        const price = new Price(validPriceProps);

        expect(price.planId).toBe(validPriceProps.planId);
        expect(price.key).toBe(validPriceProps.key);
        expect(price.currency).toBe(validPriceProps.currency);
        expect(price.billingCycle).toBe(validPriceProps.billingCycle);
        expect(price.value.amount).toBe(validPriceProps.value);
        expect(price.value.code).toBe(validPriceProps.currency);
        expect(price.discount).toBeDefined();
        expect(price.discount?.key).toBe(validPriceProps.discount?.key);
        expect(price.isActive).toBe(true);
        expect(price.externalPriceId).toBe(validPriceProps.externalPriceId);
    });

    it('should throw error if planId is less than 1', () => {
        expect(() => new Price({ ...validPriceProps, planId: 0 })).toThrow(
            new AppException(code.pricePlanIdInvalidError, 400)
        );
    });

    it('should throw error if key is empty', () => {
        expect(() => new Price({ ...validPriceProps, key: '' as any })).toThrow(
            new AppException(code.priceKeyEmptyError, 400)
        );
    });

    it('should throw error if billingCycle is missing', () => {
        expect(() => new Price({ ...validPriceProps, billingCycle: undefined as any })).toThrow(
            new AppException(code.priceBillingCycleEmptyError, 400)
        );
    });

    it('should throw error if billingCycle is invalid', () => {
        expect(() => new Price({ ...validPriceProps, billingCycle: 'invalid' as any })).toThrow(
            new AppException(code.priceBillingCycleInvalidError, 400)
        );
    });

    it('should NOT throw error if currency matches between Price and Money', () => {
        // Since Price constructor uses Money.fromInteger(data.value, data.currency),
        // it's actually impossible to have mismatch unless the Price constructor logic is changed.
        // The check in Price.validate() is redundant or for extra safety if _value could be set otherwise.
        const price = new Price(validPriceProps);
        expect(price.currency).toBe(price.value.code);
    });

    it('should throw error if value is negative', () => {
        expect(() => new Price({ ...validPriceProps, value: -1 })).toThrow(
            new AppException(code.priceValueNegativeError, 400)
        );
    });

    it('should throw error if externalPriceId is empty string', () => {
        expect(() => new Price({ ...validPriceProps, externalPriceId: ' ' })).toThrow(
            new AppException(code.priceExternalIdEmptyError, 400)
        );
    });

    it('should activate and deactivate', () => {
        const price = new Price(validPriceProps);
        price.deactivate();
        expect(price.isActive).toBe(false);
        price.activate();
        expect(price.isActive).toBe(true);
    });

    it('should link external price id', () => {
        const price = new Price(validPriceProps);
        price.linkExternalPriceId('new_ext_price_id');
        expect(price.externalPriceId).toBe('new_ext_price_id');
    });

    it('should throw error if id is accessed but not set', () => {
        const price = new Price(validPriceProps);
        expect(() => price.id).toThrow(new AppException(code.priceIdEmptyError, 500));
    });

    it('should throw error if planId is accessed but not set', () => {
        const price = new Price({ ...validPriceProps, planId: undefined });
        expect(() => price.planId).toThrow(new AppException(code.pricePlanIdEmptyError, 500));
    });
});
