import { type Currency } from "@shared/domain/type/language.type";
import { code } from "@shared/domain/constant/code.constant";
import { AppException } from "@shared/domain/exception/app.exception";

export class Money {

    private readonly cents: number;
    private readonly currency: Currency;

    private constructor(cents: number, currency: Currency) {
        this.cents = Math.round(cents);
        this.currency = currency;
    }

    static fromInteger(amount: number, currency: Currency): Money {
        return new Money(amount, currency);
    }

    static fromDecimal(amount: number, currency: Currency): Money {
        return new Money(amount * 100, currency);
    }

    add(other: Money): Money {
        this.ensureSameCurrency(other);
        return new Money(this.cents + other.cents, this.currency);
    }

    subtract(other: Money): Money {
        this.ensureSameCurrency(other);
        return new Money(this.cents - other.cents, this.currency);
    }

    multiply(quantity: number): Money {
        return new Money(this.cents * quantity, this.currency);
    }

    equals(other: Money): boolean {
        return this.cents === other.cents && this.currency === other.currency;
    }

    greaterThan(other: Money): boolean {
        this.ensureSameCurrency(other);
        return this.cents > other.cents;
    }

    isZero(): boolean {
        return this.cents === 0;
    }

    toDecimal(): number {
        return this.cents / 100;
    }

    private ensureSameCurrency(other: Money): void {
        if (this.currency !== other.currency)
            throw new AppException(code.moneyCurrencyMismatchError, 400);
    }

    get amount(): number {
        return this.cents;
    }

    get code(): Currency {
        return this.currency;
    }

}
