import { describe, it, expect } from 'vitest';
import { PriceFactory } from "@billing/domain/price/factory/price.factory";
import { Price } from "@billing/domain/price/entity/price.entity";
import { MockNestedPriceInput, MockPrice, MockPriceInput } from "@mock/in-memory.mock";

describe('PriceFactory', () => {
    const priceInput = MockPriceInput;
    const priceModel = MockPrice;

    it('create should create a price successfully', () => {
        const price = PriceFactory.create(priceInput);
        expect(price).toBeInstanceOf(Price);
        expect(price.cycle).toBe(priceInput.cycle);
    });

    it('createBulk should create bulk prices successfully', () => {
        const prices = PriceFactory.createBulk([priceInput]);
        expect(prices).toHaveLength(1);
        expect(prices[0]).toBeInstanceOf(Price);
    });

    it('rehydrate should rehydrate a price successfully', () => {
        const price = PriceFactory.rehydrate(priceModel);
        expect(price).toBeInstanceOf(Price);
        expect(price.id).toBe(priceModel.id);
        expect(price.productId).toBe(priceModel.productId);
        expect(price.cycle).toBe(priceModel.cycle);
        expect(price.value).toBe(priceModel.value);
        expect(price.discount?.id).toBe(priceModel.discounts[0].id);
    });

    it('rehydrateBulk should rehydrate bulk prices successfully', () => {
        const prices = PriceFactory.rehydrateBulk([priceModel]);
        expect(prices).toHaveLength(1);
        expect(prices[0]).toBeInstanceOf(Price);
    });

    it('toModel should map a standalone price with productId', () => {
        const price = PriceFactory.create(priceInput);
        const model = PriceFactory.toModel(price);

        expect(model.productId).toBe(priceInput.productId);
        expect(model.cycle).toBe(priceInput.cycle);
        expect(model.value).toBe(priceInput.value);
        expect(model.discounts).toEqual([]);
    });

    it('toModel should keep productId undefined for nested price creation', () => {
        const price = PriceFactory.create(MockNestedPriceInput);
        const model = PriceFactory.toModel(price);

        expect(model.productId).toBeUndefined();
        expect(model.cycle).toBe(MockNestedPriceInput.cycle);
    });
});
