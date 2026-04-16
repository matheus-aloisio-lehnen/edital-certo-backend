import { Controller, Get, Param, Query, Post, Body, Delete, Inject } from '@nestjs/common';

import type { IFindDiscountUsecase, ICreateDiscountUsecase, IDeleteDiscountUsecase, } from '@product/port/discount.port';
import { findDiscountUsecasePort, createDiscountUsecasePort, deleteDiscountUsecasePort, } from '@product/port/discount.port';
import { CreateDiscountDto } from "@transport/http/product/discount/dto/create-discount.dto";
import { PageParamsDto } from "@transport/http/@shared/dto/page-params.dto";

@Controller('discount')
export class DiscountController {

    constructor(
        @Inject(findDiscountUsecasePort) private readonly findUsecase: IFindDiscountUsecase,
        @Inject(createDiscountUsecasePort) private readonly createUsecase: ICreateDiscountUsecase,
        @Inject(deleteDiscountUsecasePort) private readonly deleteUsecase: IDeleteDiscountUsecase,
    ) {}

    @Get()
    async findAll(@Query() query: PageParamsDto) {
        const pageParams = query.toPageParams()
        return this.findUsecase.findAll(pageParams);
    }

    @Get('price/:priceId')
    async findAllByPriceId(@Param('priceId') priceId: number, @Query() query: PageParamsDto) {
        const pageParams = query.toPageParams()
        return this.findUsecase.findAllByPriceId(Number(priceId), pageParams);
    }

    @Get(':id')
    async findById(@Param('id') id: number) {
        return this.findUsecase.findById(Number(id));
    }

    @Post()
    async create(@Body() body: CreateDiscountDto) {
        return this.createUsecase.execute(body.toProps());
    }

    @Delete(':id')
    async delete(@Param('id') id: number) {
        return this.deleteUsecase.delete(Number(id));
    }

}