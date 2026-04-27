import { describe, it, expect } from 'vitest';
import { AppException } from '@shared/domain/exception/app.exception';
import { code } from '@shared/domain/constant/code.constant';
import { MockCreateProducts } from '@mock/in-memory.mock';
import { Product } from "@billing/domain/product/entity/product.entity";

describe('Product', () => {
    const validProductProps = MockCreateProducts[1];

    it('constructor should create a product successfully', () => {
        const product = new Product(validProductProps);

        expect(product.name).toBe(validProductProps.name);
        expect(product.isActive).toBe(true);
        expect(product.prices).toHaveLength(validProductProps.prices.length);
    });

    it('validate should throw error if name is empty', () => {
        expect(() => new Product({ ...validProductProps, name: '' })).toThrow();
    });

    it('validate should throw error if prices are empty', () => {
        expect(() => new Product({ ...validProductProps, prices: [] })).toThrow(
            new AppException(code.productPricesEmptyError, 400)
        );
    });

    it('deactivate should deactivate product', () => {
        const product = new Product(validProductProps);
        product.deactivate();
        expect(product.isActive).toBe(false);
    });

    it('linkExternalProductId should link external product id', () => {
        const product = new Product(validProductProps);
        product.linkExternalProductId('ext_product_123');
        expect(product.externalProductId).toBe('ext_product_123');
    });

    it('id getter should throw error if id is not set', () => {
        const product = new Product(validProductProps);
        expect(() => product.id).toThrow(new AppException(code.productIdEmptyError, 400));
    });
});
