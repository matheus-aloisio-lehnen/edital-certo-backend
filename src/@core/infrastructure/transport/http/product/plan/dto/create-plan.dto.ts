import { Type } from 'class-transformer';
import {
    IsArray,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    ValidateNested,
    ArrayMinSize,
} from 'class-validator';

import { planKey } from '@product/constant/plan-key.constant';
import type { PlanKey } from '@product/constant/plan-key.constant';
import type { CreatePlanProps } from '@product/props/create-plan.props';

import { CreateFeatureDto } from '@transport/http/product/feature/dto/create-feature.dto';
import { CreatePriceDto } from '@transport/http/product/price/dto/create-price.dto';

export class CreatePlanDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEnum(planKey)
    key: PlanKey;

    @IsOptional()
    @IsString()
    externalProductId?: string | null;

    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => CreateFeatureDto)
    features: CreateFeatureDto[];

    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => CreatePriceDto)
    prices: CreatePriceDto[];

    toProps(): CreatePlanProps {
        return {
            name: this.name,
            key: this.key,
            externalProductId: this.externalProductId ?? null,
            features: this.features.map(feature => feature.toProps()),
            prices: this.prices.map(price => price.toProps()),
        };
    }
}