import { Body, Controller, Delete, Get, HttpStatus, Inject, Param, Post, Query } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

import { createDiscountUsecasePort, deleteDiscountUsecasePort, findDiscountUsecasePort, type ICreateDiscountUsecase, type IDeleteDiscountUsecase, type IFindDiscountUsecase } from "@billing/domain/discount/port/discount.port";
import { Discount } from "@billing/domain/discount/entity/discount.entity";
import { CreateDiscountDto } from "@billing/infrastructure/transport/in/http/discount/dto/create-discount.dto";
import { code } from "@shared/domain/constant/code.constant";
import { type Page } from "@shared/domain/type/page.type";
import { type Response } from "@shared/domain/type/http.type";
import { PageParamsInput } from "@shared/infrastructure/transport/in/http/input/page-params.input";

@ApiTags('Discounts')
@Controller({
    path: 'discounts',
    version: '1',
})
export class DiscountController {

    constructor(
        @Inject(findDiscountUsecasePort) private readonly findUsecase: IFindDiscountUsecase,
        @Inject(createDiscountUsecasePort) private readonly createUsecase: ICreateDiscountUsecase,
        @Inject(deleteDiscountUsecasePort) private readonly deleteUsecase: IDeleteDiscountUsecase,
    ) {
    }

    @Get()
    @ApiOperation({ summary: 'List all discounts' })
    @ApiResponse({ status: HttpStatus.OK, description: 'List of discounts retrieved successfully' })
    async findAll(@Query() query: PageParamsInput): Promise<Response<Page<Discount>>> {
        const pageParams = query.toPageParams();
        const data = await this.findUsecase.findAll(pageParams);
        return {
            data,
            message: "Lista de descontos recuperada com sucesso",
            code: code.findAllDiscountSuccess,
            statusCode: HttpStatus.OK,
        };
    }

    @Get('price/:priceId')
    @ApiOperation({ summary: 'List all discounts for a specific price' })
    @ApiResponse({ status: HttpStatus.OK, description: 'List of discounts for price retrieved successfully' })
    async findAllByPriceId(@Param('priceId') priceId: number, @Query() query: PageParamsInput): Promise<Response<Page<Discount>>> {
        const pageParams = query.toPageParams();
        const data = await this.findUsecase.findAllByPriceId(Number(priceId), pageParams);
        return {
            data,
            message: "Lista de descontos por preço recuperada com sucesso",
            code: code.findAllByPriceIdDiscountSuccess,
            statusCode: HttpStatus.OK,
        };
    }

    @Get(':id')
    @ApiOperation({ summary: 'Find discount by ID' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Discount retrieved successfully' })
    async findById(@Param('id') id: number): Promise<Response<Discount | null>> {
        const data = await this.findUsecase.findById(Number(id));
        return {
            data,
            message: "Desconto recuperado com sucesso",
            code: code.findByIdDiscountSuccess,
            statusCode: HttpStatus.OK,
        };
    }

    @Post()
    @ApiOperation({ summary: 'Create a new discount' })
    @ApiResponse({ status: HttpStatus.CREATED, description: 'Discount created successfully' })
    async create(@Body() body: CreateDiscountDto): Promise<Response<Discount>> {
        const data = await this.createUsecase.execute(body.toProps());
        return {
            data,
            message: "Desconto criado com sucesso",
            code: code.createDiscountSuccess,
            statusCode: HttpStatus.CREATED,
        };
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete discount by ID' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Discount removed successfully' })
    async delete(@Param('id') id: number): Promise<Response<boolean>> {
        const data = await this.deleteUsecase.delete(Number(id));
        return {
            data,
            message: "Desconto removido com sucesso",
            code: code.deleteDiscountSuccess,
            statusCode: HttpStatus.OK,
        };
    }

}
