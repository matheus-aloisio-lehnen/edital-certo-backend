import { Type } from 'class-transformer';
import {
    IsArray,
    IsNotEmpty,
    IsOptional,
    IsString,
    ValidateNested,
    ArrayMinSize,
} from 'class-validator';
import { CreatePriceDto } from "@billing/infrastructure/transport/in/http/price/dto/create-price.dto";
import { CreatePlanProps } from "@billing/domain/plan/props/create-plan.props";


export class CreatePlanDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsOptional()
    @IsString()
    externalProductId?: string | null;

    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => CreatePriceDto)
    prices: CreatePriceDto[];

    toProps(): CreatePlanProps {
        return {
            name: this.name,
            externalProductId: this.externalProductId ?? null,
            prices: this.prices.map(price => price.toProps()),
        };
    }
}
