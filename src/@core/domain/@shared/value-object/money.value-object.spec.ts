import { Money } from '@domain/@shared/value-object/money.value-object';
import { AppException } from '@domain/@shared/exception/app.exception';
import { code } from '@domain/@shared/constant/code.constant';

describe('Money Value Object', () => {
    const BRL = 'BRL' as any;
    const USD = 'USD' as any;

    it('should create from decimal and integer correctly', () => {
        const m1 = Money.fromDecimal(99.90, BRL);
        const m2 = Money.fromInteger(9990, BRL);

        expect(m1.amount).toBe(9990);
        expect(m1.equals(m2)).toBe(true);
    });

    it('should avoid floating point issues during rounding', () => {
        const m = Money.fromDecimal(10.1 + 20.2, BRL); // 30.300000000000004
        expect(m.amount).toBe(3030);
    });

    it('should add money of same currency', () => {
        const m1 = Money.fromDecimal(10, BRL);
        const m2 = Money.fromDecimal(20, BRL);
        const result = m1.add(m2);

        expect(result.amount).toBe(3000);
        expect(result.code).toBe(BRL);
    });

    it('should subtract money of same currency', () => {
        const m1 = Money.fromDecimal(50, BRL);
        const m2 = Money.fromDecimal(20, BRL);
        const result = m1.subtract(m2);

        expect(result.amount).toBe(3000);
    });

    it('should multiply amount correctly', () => {
        const m = Money.fromDecimal(10, BRL);
        const result = m.multiply(3);

        expect(result.amount).toBe(3000);
    });

    it('should throw exception when currencies mismatch', () => {
        const brl = Money.fromDecimal(10, BRL);
        const usd = Money.fromDecimal(10, USD);

        const act = () => brl.add(usd);

        expect(act).toThrow(AppException);
        expect(act).toThrow(expect.objectContaining({
            message: code.moneyCurrencyMismatchError
        }));
    });

    it('should identify equality and comparisons', () => {
        const m1 = Money.fromDecimal(100, BRL);
        const m2 = Money.fromDecimal(100, BRL);
        const m3 = Money.fromDecimal(50, BRL);

        expect(m1.equals(m2)).toBe(true);
        expect(m1.greaterThan(m3)).toBe(true);
        expect(m3.isZero()).toBe(false);
        expect(Money.fromDecimal(0, BRL).isZero()).toBe(true);
    });

    it('should return correct decimal value', () => {
        const m = Money.fromInteger(1250, BRL);
        expect(m.toDecimal()).toBe(12.50);
    });

});