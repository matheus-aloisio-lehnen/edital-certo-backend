import { Type } from 'class-transformer';
import {
    IsEnum,
    IsNumber,
    IsOptional,
    IsString,
    IsNotEmpty,
    ValidateNested,
} from 'class-validator';

import { currency } from '@domain/@shared/type/language.type';
import type { Currency } from '@domain/@shared/type/language.type';
import { billingCycle } from '@product/constant/billing-cycle.constant';
import type { BillingCycle } from '@product/constant/billing-cycle.constant';
import { priceKey } from '@product/constant/price-key.constant';
import type { PriceKey } from '@product/constant/price-key.constant';

import { CreateDiscountDto } from '@transport/http/product/discount/dto/create-discount.dto';
import type { CreatePriceProps } from '@product/props/create-price.props';

export class CreatePriceDto {
    @IsEnum(priceKey)
    key: PriceKey;

    @IsEnum(currency)
    currency: Currency;

    @IsEnum(billingCycle)
    billingCycle: BillingCycle;

    @Type(() => Number)
    @IsNumber()
    value: number;

    @IsOptional()
    @ValidateNested()
    @Type(() => CreateDiscountDto)
    discount?: CreateDiscountDto;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    externalPriceId?: string;

    toProps(): CreatePriceProps {
        return {
            key: this.key,
            currency: this.currency,
            billingCycle: this.billingCycle,
            value: this.value,
            discount: this.discount?.toProps(),
            externalPriceId: this.externalPriceId,
        };
    }
}