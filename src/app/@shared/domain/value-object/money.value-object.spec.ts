import { describe, expect, it } from "vitest";

import { code } from "@shared/domain/constant/code.constant";
import { AppException } from "@shared/domain/exception/app.exception";
import { currency } from "@shared/domain/type/language.type";
import { Money } from "@shared/domain/value-object/money.value-object";

const BRL = currency.brl;
const USD = currency.usd;

describe("Money", () => {
    it("fromInteger should create money from cents", () => {
        const money = Money.fromInteger(3030, BRL);

        expect(money.amount).toBe(3030);
        expect(money.code).toBe(BRL);
    });

    it("fromDecimal should create money from decimal amount", () => {
        const money = Money.fromDecimal(30.3, BRL);

        expect(money.amount).toBe(3030);
    });

    it("add should add money of same currency", () => {
        const m1 = Money.fromDecimal(10, BRL);
        const m2 = Money.fromDecimal(20, BRL);
        const result = m1.add(m2);

        expect(result.amount).toBe(3000);
        expect(result.code).toBe(BRL);
    });

    it("subtract should subtract money of same currency", () => {
        const m1 = Money.fromDecimal(50, BRL);
        const m2 = Money.fromDecimal(20, BRL);
        const result = m1.subtract(m2);

        expect(result.amount).toBe(3000);
    });

    it("multiply should multiply amount correctly", () => {
        const money = Money.fromDecimal(10, BRL);
        const result = money.multiply(3);

        expect(result.amount).toBe(3000);
    });

    it("validateCurrency should throw exception when currencies mismatch", () => {
        const brl = Money.fromDecimal(10, BRL);
        const usd = Money.fromDecimal(10, USD);

        const act = () => brl.add(usd);

        expect(act).toThrow(AppException);
        expect(act).toThrow(expect.objectContaining({
            message: code.moneyCurrencyMismatchError,
        }));
    });

    it("equals, greaterThan and isZero should identify equality and comparisons", () => {
        const m1 = Money.fromDecimal(100, BRL);
        const m2 = Money.fromDecimal(100, BRL);
        const m3 = Money.fromDecimal(50, BRL);

        expect(m1.equals(m2)).toBe(true);
        expect(m1.greaterThan(m3)).toBe(true);
        expect(m3.isZero()).toBe(false);
        expect(Money.fromDecimal(0, BRL).isZero()).toBe(true);
    });

    it("toDecimal should return correct decimal value", () => {
        const money = Money.fromInteger(1250, BRL);

        expect(money.toDecimal()).toBe(12.5);
    });
});
