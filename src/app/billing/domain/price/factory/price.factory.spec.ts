import { describe, it, expect } from 'vitest';
import { MockPrice, MockPriceInput } from "@mock/in-memory.mock";
import { PriceFactory } from "@billing/domain/price/factory/price.factory";
import { Price } from "@billing/domain/price/entity/price.entity";

describe('PriceFactory', () => {
    it('create should create a price successfully', () => {
        const price = PriceFactory.create(MockPriceInput);
        expect(price).toBeInstanceOf(Price);
        expect(price.billingCycle).toBe(MockPriceInput.billingCycle);
    });

    it('createBulk should create bulk prices successfully', () => {
        const prices = PriceFactory.createBulk([MockPriceInput]);
        expect(prices).toHaveLength(1);
        expect(prices[0]).toBeInstanceOf(Price);
    });

    it('rehydrate should rehydrate a price successfully', () => {
        const price = PriceFactory.rehydrate(MockPrice);
        expect(price).toBeInstanceOf(Price);
        expect(price.id).toBe(MockPrice.id);
        expect(price.billingCycle).toBe(MockPrice.billingCycle);
        expect(price.value).toBe(MockPrice.value);
        expect(price.discount).not.toBeNull();
    });

    it('rehydrateBulk should rehydrate bulk prices successfully', () => {
        const prices = PriceFactory.rehydrateBulk([MockPrice]);
        expect(prices).toHaveLength(1);
        expect(prices[0]).toBeInstanceOf(Price);
    });
});
