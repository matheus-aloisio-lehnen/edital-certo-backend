import { Body, Controller, Get, HttpStatus, Inject, Param, ParseArrayPipe, Post, Query } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

import { Price } from "@billing/domain/price/entity/price.entity";
import { createPriceUsecasePort, findPriceUsecasePort, type ICreatePriceUsecase, type IFindPriceUsecase } from "@billing/domain/price/port/price.port";
import { CreatePriceDto } from "@billing/infrastructure/transport/in/http/price/dto/create-price.dto";
import { code } from "@shared/domain/constant/code.constant";
import { type Page } from "@shared/domain/type/page.type";
import { type Response } from "@shared/domain/type/http.type";
import { PageParamsInput } from "@shared/infrastructure/transport/in/http/input/page-params.input";

@ApiTags('Prices')
@Controller({
    path: 'prices',
    version: '1',
})
export class PriceController {

    constructor(
        @Inject(findPriceUsecasePort) private readonly findUsecase: IFindPriceUsecase,
        @Inject(createPriceUsecasePort) private readonly createUsecase: ICreatePriceUsecase,
    ) {
    }

    @Get()
    @ApiOperation({ summary: 'List all prices' })
    @ApiResponse({ status: HttpStatus.OK, description: 'List of prices retrieved successfully' })
    async findAll(@Query() query: PageParamsInput): Promise<Response<Page<Price>>> {
        const pageParams = query.toPageParams();
        const data = await this.findUsecase.findAll(pageParams);
        return {
            data,
            message: "Lista de preços recuperada com sucesso",
            code: code.findAllPriceSuccess,
            statusCode: HttpStatus.OK,
        };
    }

    @Get(':id')
    @ApiOperation({ summary: 'Find price by ID' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Price retrieved successfully' })
    async findById(@Param('id') id: number): Promise<Response<Price | null>> {
        const data = await this.findUsecase.findById(Number(id));
        return {
            data,
            message: "Preço recuperado com sucesso",
            code: code.findByIdPriceSuccess,
            statusCode: HttpStatus.OK,
        };
    }

    @Post()
    @ApiOperation({ summary: 'Create a new price' })
    @ApiResponse({ status: HttpStatus.CREATED, description: 'Price created successfully' })
    async create(@Body() body: CreatePriceDto): Promise<Response<Price>> {
        const data = await this.createUsecase.execute(body.toProps());
        return {
            data,
            message: "Preço criado com sucesso",
            code: code.createPriceSuccess,
            statusCode: HttpStatus.CREATED,
        };
    }

    @Post('bulk')
    @ApiOperation({ summary: 'Create multiple prices in bulk' })
    @ApiResponse({ status: HttpStatus.CREATED, description: 'Prices created successfully in bulk' })
    async createBulk(@Body(new ParseArrayPipe({ items: CreatePriceDto })) body: CreatePriceDto[]): Promise<Response<Price[]>> {
        const data = await Promise.all(body.map(item => this.createUsecase.execute(item.toProps())));
        return {
            data,
            message: "Preços criados com sucesso em lote",
            code: code.createBulkPriceSuccess,
            statusCode: HttpStatus.CREATED,
        };
    }

}
