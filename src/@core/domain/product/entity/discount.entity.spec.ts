import { describe, it, expect } from 'vitest';
import { discountType, discountDuration } from '@domain/product/constant/discount.constant';
import { AppException } from '@domain/@shared/exception/app.exception';
import { code } from '@domain/@shared/constant/code.constant';
import { MockDiscountInput } from '@mock/in-memory.mock';
import { Discount } from "@domain/product/entity/discount.entity";

describe('Discount Entity', () => {
    const validDiscountProps = MockDiscountInput;

    it('should create a discount successfully', () => {
        const discount = new Discount(validDiscountProps);

        expect(discount.key).toBe(validDiscountProps.key);
        expect(discount.name).toBe(validDiscountProps.name);
        expect(discount.type).toBe(validDiscountProps.type);
        expect(discount.value).toBe(validDiscountProps.value);
        expect(discount.duration).toBe(validDiscountProps.duration);
        expect(discount.campaignStartsAt).toBe(validDiscountProps.campaignStartsAt);
        expect(discount.campaignEndsAt).toBe(validDiscountProps.campaignEndsAt);
        expect(discount.externalDiscountId).toBe(validDiscountProps.externalDiscountId);
    });

    it('should throw error if priceId is less than 1', () => {
        expect(() => new Discount({ ...validDiscountProps, priceId: 0 })).toThrow();
    });

    it('should throw error if key is empty', () => {
        expect(() => new Discount({ ...validDiscountProps, key: '' })).toThrow(
            new AppException(code.discountKeyEmptyError, 400)
        );
    });

    it('should throw error if name is empty', () => {
        expect(() => new Discount({ ...validDiscountProps, name: ' ' })).toThrow(
            new AppException(code.discountNameEmptyError, 400)
        );
    });

    it('should throw error if type is missing', () => {
        expect(() => new Discount({ ...validDiscountProps, type: undefined as any })).toThrow(
            new AppException(code.discountTypeEmptyError, 400)
        );
    });

    it('should throw error if type is invalid', () => {
        expect(() => new Discount({ ...validDiscountProps, type: 'invalid' as any })).toThrow(
            new AppException(code.discountTypeInvalidError, 400)
        );
    });

    it('should throw error if percent value is out of bounds', () => {
        expect(() => new Discount({ ...validDiscountProps, type: discountType.percent, value: 0 })).toThrow(
            new AppException(code.discountPercentValueOutOfBoundsError, 400)
        );
        expect(() => new Discount({ ...validDiscountProps, type: discountType.percent, value: 100 })).toThrow(
            new AppException(code.discountPercentValueOutOfBoundsError, 400)
        );
    });

    it('should throw error if fixed value is negative', () => {
        expect(() => new Discount({ ...validDiscountProps, type: discountType.fixed, value: -1 })).toThrow(
            new AppException(code.discountValueNegativeError, 400)
        );
    });

    it('should create a fixed discount successfully', () => {
        const discount = new Discount({ ...validDiscountProps, type: discountType.fixed, value: 500 });
        expect(discount.value).toBe(500);
    });

    it('should throw error if duration is missing', () => {
        expect(() => new Discount({ ...validDiscountProps, duration: undefined as any })).toThrow(
            new AppException(code.discountDurationEmptyError, 400)
        );
    });

    it('should throw error if duration is invalid', () => {
        expect(() => new Discount({ ...validDiscountProps, duration: 'invalid' as any })).toThrow(
            new AppException(code.discountDurationInvalidError, 400)
        );
    });

    it('should throw error if repeating duration missing count', () => {
        expect(() => new Discount({ ...validDiscountProps, duration: discountDuration.repeating, count: undefined })).toThrow(
            new AppException(code.discountCountEmptyError, 400)
        );
    });

    it('should throw error if non-repeating duration has count', () => {
        expect(() => new Discount({ ...validDiscountProps, duration: discountDuration.once, count: 3 })).toThrow(
            new AppException(code.discountCountNotAllowedError, 400)
        );
    });

    it('should throw error if count is negative', () => {
        expect(() => new Discount({ ...validDiscountProps, duration: discountDuration.repeating, count: -1 })).toThrow(
            new AppException(code.discountCountNegativeError, 400)
        );
    });

    it('should create a repeating discount successfully', () => {
        const discount = new Discount({ ...validDiscountProps, duration: discountDuration.repeating, count: 6 });
        expect(discount.duration).toBe(discountDuration.repeating);
        expect(discount.count).toBe(6);
    });

    it('should throw error if campaignStartsAt is missing', () => {
        expect(() => new Discount({ ...validDiscountProps, campaignStartsAt: undefined as any })).toThrow(
            new AppException(code.discountCampaignStartsAtEmptyError, 400)
        );
    });

    it('should throw error if campaignEndsAt is missing', () => {
        expect(() => new Discount({ ...validDiscountProps, campaignEndsAt: undefined as any })).toThrow(
            new AppException(code.discountCampaignEndsAtEmptyError, 400)
        );
    });

    it('should throw error if campaignEndsAt is before campaignStartsAt', () => {
        expect(() => new Discount({ 
            ...validDiscountProps, 
            campaignStartsAt: new Date('2026-01-02'), 
            campaignEndsAt: new Date('2026-01-01') 
        })).toThrow(
            new AppException(code.discountCampaignEndsAtInvalidError, 400)
        );
    });

    it('should throw error if externalDiscountId is empty string', () => {
        expect(() => new Discount({ ...validDiscountProps, externalDiscountId: ' ' })).toThrow(
            new AppException(code.discountExternalIdEmptyError, 400)
        );
    });

    it('should link external discount id', () => {
        const discount = new Discount(validDiscountProps);
        discount.linkExternalDiscountId('new_ext_id');
        expect(discount.externalDiscountId).toBe('new_ext_id');
    });

    it('should throw error if id is accessed but not set', () => {
        const discount = new Discount(validDiscountProps);
        expect(() => discount.id).toThrow(new AppException(code.discountIdEmptyError, 500));
    });

    it('should throw error if priceId is accessed but not set', () => {
        const discount = new Discount({ ...validDiscountProps, priceId: undefined });
        expect(() => discount.priceId).toThrow(new AppException(code.discountPriceIdEmptyError, 500));
    });
});
