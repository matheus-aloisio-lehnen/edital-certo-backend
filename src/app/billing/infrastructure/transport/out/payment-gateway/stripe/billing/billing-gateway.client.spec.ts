import { describe, it, expect, vi, beforeEach } from 'vitest';
import { StripeBillingGatewayClient } from "@billing/infrastructure/transport/out/payment-gateway/stripe/billing/billing-gateway.client";
import Stripe from "stripe";
import { HttpStatus } from "@nestjs/common";
import { code } from "@shared/domain/constant/code.constant";
import { createConfigServiceMock } from "@mock/tests.mock";

const mockedStripe = vi.hoisted(() => ({
    instance: null as any,
}));

vi.mock('stripe', () => {
    class StripeMock {
        constructor() {
            return mockedStripe.instance;
        }
    }

    return {
        default: StripeMock,
    };
});

describe('StripeBillingGatewayClient', () => {
    const secretKey = 'sk_test_123';

    let stripeClient: any;
    let client: StripeBillingGatewayClient;

    beforeEach(() => {
        stripeClient = {
            products: {
                create: vi.fn(),
                update: vi.fn(),
            },
            prices: {
                create: vi.fn(),
                update: vi.fn(),
            },
            coupons: {
                create: vi.fn(),
                del: vi.fn(),
            },
        };

        mockedStripe.instance = stripeClient;

        const configService = createConfigServiceMock({
            paymentGateway: {
                secretKey,
            },
        });

        client = new StripeBillingGatewayClient(configService);
    });

    it('should throw if stripe secret key is missing', () => {
        const configService = createConfigServiceMock({
            paymentGateway: {
                secretKey: '',
            },
        });

        expect(() => new StripeBillingGatewayClient(configService)).toThrow("Stripe secretKey not found");
    });

    it('should create product', async () => {
        stripeClient.products.create.mockResolvedValue({
            id: 'prod_1',
            active: true,
            name: 'Plan 1',
            description: 'Desc',
        });

        const result = await client.createProduct({
            active: true,
            name: 'Plan 1',
            statement_descriptor: 'Plan 1',
            metadata: { planId: '1' },
        } as any);

        expect(stripeClient.products.create).toHaveBeenCalledWith({
            active: true,
            name: 'Plan 1',
            statement_descriptor: 'Plan 1',
            metadata: { planId: '1' },
        });
        expect(result).toEqual({
            id: 'prod_1',
            active: true,
            name: 'Plan 1',
            description: 'Desc',
        });
    });

    it('should update product', async () => {
        await client.updateProduct({
            productId: 'prod_1',
            active: false,
        });

        expect(stripeClient.products.update).toHaveBeenCalledWith('prod_1', {
            productId: 'prod_1',
            active: false,
        });
    });

    it('should create price', async () => {
        stripeClient.prices.create.mockResolvedValue({
            id: 'price_1',
            active: true,
            currency: 'brl',
            product: 'prod_1',
            unit_amount: 1000,
            recurring: {
                interval: 'month',
            },
        });

        const result = await client.createPrice({
            currency: 'BRL',
            active: true,
            product: 'prod_1',
            recurring: {
                interval: 'month',
            },
            unit_amount: 1000,
            metadata: { priceId: '1' },
        } as any);

        expect(stripeClient.prices.create).toHaveBeenCalledWith({
            currency: 'BRL',
            active: true,
            product: 'prod_1',
            recurring: {
                interval: 'month',
            },
            unit_amount: 1000,
            metadata: { priceId: '1' },
        });
        expect(result).toEqual({
            id: 'price_1',
            active: true,
            product: 'prod_1',
            unit_amount: 1000,
            recurring: {
                interval: 'month',
            },
        });
    });

    it('should throw AppException when price recurring interval is missing', async () => {
        stripeClient.prices.create.mockResolvedValue({
            id: 'price_1',
            active: true,
            currency: 'brl',
            product: 'prod_1',
            unit_amount: 1000,
            recurring: {},
        });

        await expect(client.createPrice({
            currency: 'BRL',
            active: true,
            product: 'prod_1',
            recurring: {
                interval: 'month',
            },
            unit_amount: 1000,
        } as any)).rejects.toMatchObject({
            code: code.stripePriceRecurringError,
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'Stripe price recurring interval not found',
        });
    });

    it('should update price', async () => {
        await client.updatePrice({
            priceId: 'price_1',
            active: false,
        });

        expect(stripeClient.prices.update).toHaveBeenCalledWith('price_1', {
            priceId: 'price_1',
            active: false,
        });
    });

    it('should create coupon', async () => {
        stripeClient.coupons.create.mockResolvedValue({
            id: 'coupon_1',
            percent_off: 10,
            amount_off: null,
            currency: 'brl',
        });

        const result = await client.createCoupon({
            duration: 'once',
            percent_off: 10,
            amount_off: null,
            currency: 'BRL',
        } as any);

        expect(stripeClient.coupons.create).toHaveBeenCalledWith({
            duration: 'once',
            percent_off: 10,
            amount_off: null,
            currency: 'BRL',
        });
        expect(result).toEqual({
            id: 'coupon_1',
            percent_off: 10,
            amount_off: null,
            currency: 'BRL',
        });
    });

    it('should throw AppException when coupon currency is missing', async () => {
        await expect(client.createCoupon({
            duration: 'once',
            percent_off: 10,
            amount_off: null,
        } as any)).rejects.toMatchObject({
            code: code.stripeCouponCurrencyNotFoundError,
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'Stripe coupon currency not found',
        });
    });

    it('should delete coupon', async () => {
        await client.deleteCoupon('coupon_1');

        expect(stripeClient.coupons.del).toHaveBeenCalledWith('coupon_1');
    });
});
