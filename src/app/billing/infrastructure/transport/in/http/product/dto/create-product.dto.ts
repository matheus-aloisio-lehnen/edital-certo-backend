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
import { CreateProductProps } from "@billing/domain/product/props/create-product.props";


export class CreateProductDto {
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

    toProps(): CreateProductProps {
        return {
            name: this.name,
            externalProductId: this.externalProductId ?? null,
            prices: this.prices.map(price => price.toProps()),
        };
    }
}
