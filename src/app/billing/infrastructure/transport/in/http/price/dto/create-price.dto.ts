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
import { billingType, type BillingType } from "@billing/domain/price/constant/billing-type.constant";
import { type CreatePriceProps } from "@billing/domain/price/props/create-price.props";
import { CreateDiscountDto } from "@billing/infrastructure/transport/in/http/discount/dto/create-discount.dto";

export class CreatePriceDto {
    @IsEnum(billingCycle)
    cycle: BillingCycle;

    @IsEnum(billingType)
    type: BillingType;

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
            cycle: this.cycle,
            type: this.type,
            value: this.value,
            discount: this.discount?.toProps(),
            externalPriceId: this.externalPriceId,
        };
    }
}
