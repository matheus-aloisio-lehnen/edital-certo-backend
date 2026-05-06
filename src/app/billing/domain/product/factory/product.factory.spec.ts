import { describe, it, expect } from 'vitest';
import { ProductFactory } from "@billing/domain/product/factory/product.factory";
import { MockCreateInputProducts, MockProduct } from "@mock/in-memory.mock";
import { Product } from "@billing/domain/product/entity/product.entity";

describe('ProductFactory', () => {
    it('create should create a product successfully', () => {
        const product = ProductFactory.create(MockCreateInputProducts[0]);
        expect(product).toBeInstanceOf(Product);
        expect(product.name).toBe(MockCreateInputProducts[0].name);
        expect(product.kind).toBe(MockCreateInputProducts[0].kind);
    });

    it('createBulk should create bulk products successfully', () => {
        const products = ProductFactory.createBulk(MockCreateInputProducts);
        expect(products).toHaveLength(MockCreateInputProducts.length);
        expect(products[0]).toBeInstanceOf(Product);
    });

    it('rehydrate should rehydrate a product successfully', () => {
        const product = ProductFactory.rehydrate(MockProduct);
        expect(product).toBeInstanceOf(Product);
        expect(product.id).toBe(MockProduct.id);
        expect(product.name).toBe(MockProduct.name);
        expect(product.kind).toBe(MockProduct.kind);
        expect(product.prices).toHaveLength(1);
        expect(product.deletedAt).toBe(MockProduct.deletedAt);
    });

    it('toModel should map a product successfully', () => {
        const product = ProductFactory.create(MockCreateInputProducts[0]);
        const model = ProductFactory.toModel(product);

        expect(model.name).toBe(MockCreateInputProducts[0].name);
        expect(model.kind).toBe(MockCreateInputProducts[0].kind);
        expect(model.prices).toHaveLength(MockCreateInputProducts[0].prices.length);
    });

    it('rehydrateBulk should rehydrate bulk products successfully', () => {
        const products = ProductFactory.rehydrateBulk([MockProduct]);
        expect(products).toHaveLength(1);
        expect(products[0]).toBeInstanceOf(Product);
    });
});
