import { describe, it, expect } from 'vitest';
import { PriceFactory } from './price.factory';
import { MockPriceInput, MockPrice } from '@mock/in-memory.mock';
import { Price } from '@domain/product/entity/price.entity';
import { Money } from '@domain/@shared/value-object/money.value-object';

describe('PriceFactory', () => {
    it('should create a price successfully', () => {
        const price = PriceFactory.create(MockPriceInput);
        expect(price).toBeInstanceOf(Price);
        expect(price.key).toBe(MockPriceInput.key);
    });

    it('should create bulk prices successfully', () => {
        const prices = PriceFactory.createBulk([MockPriceInput]);
        expect(prices).toHaveLength(1);
        expect(prices[0]).toBeInstanceOf(Price);
    });

    it('should rehydrate a price successfully', () => {
        const price = PriceFactory.rehydrate(MockPrice);
        expect(price).toBeInstanceOf(Price);
        expect(price.id).toBe(MockPrice.id);
        expect(price.key).toBe(MockPrice.key);
        expect(price.value).toBeInstanceOf(Money);
        expect(price.value.amount).toBe(MockPrice.value);
        expect(price.discount).not.toBeNull();
    });

    it('should rehydrate bulk prices successfully', () => {
        const prices = PriceFactory.rehydrateBulk([MockPrice]);
        expect(prices).toHaveLength(1);
        expect(prices[0]).toBeInstanceOf(Price);
    });
});
