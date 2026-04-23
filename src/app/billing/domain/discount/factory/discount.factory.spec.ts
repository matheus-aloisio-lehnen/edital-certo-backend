import { describe, it, expect } from 'vitest';
import { DiscountFactory } from "@billing/domain/discount/factory/discount.factory";
import { MockDiscount, MockDiscountInput } from "@mock/in-memory.mock";
import { Discount } from "@billing/domain/discount/entity/discount.entity";

describe('DiscountFactory', () => {
    it('create should create a discount successfully', () => {
        const discount = DiscountFactory.create(MockDiscountInput);
        expect(discount).toBeInstanceOf(Discount);
        expect(discount.name).toBe(MockDiscountInput.name);
    });

    it('rehydrate should rehydrate a discount successfully', () => {
        const discount = DiscountFactory.rehydrate(MockDiscount);
        expect(discount).toBeInstanceOf(Discount);
        expect(discount.id).toBe(MockDiscount.id);
        expect(discount.name).toBe(MockDiscount.name);
        expect(discount.type).toBe(MockDiscount.type);
        expect(discount.value).toBe(MockDiscount.value);
        expect(discount.externalDiscountId).toBe(MockDiscount.externalDiscountId);
    });
});
