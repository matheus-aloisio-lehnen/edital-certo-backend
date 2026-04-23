import { Type } from 'class-transformer';
import {
    IsEnum,
    IsNumber,
    IsOptional,
    IsString,
    IsNotEmpty,
    ValidateNested,
} from 'class-validator';

import { billingCycle, type BillingCycle } from "@billing/domain/price/constant/billing-cycle.constant";
import { type CreatePriceProps } from "@billing/domain/price/props/create-price.props";
import { CreateDiscountDto } from "@billing/infrastructure/transport/in/http/discount/dto/create-discount.dto";

export class CreatePriceDto {
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
            billingCycle: this.billingCycle,
            value: this.value,
            discount: this.discount?.toProps(),
            externalPriceId: this.externalPriceId,
        };
    }
}
