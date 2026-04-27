import { Body, Controller, Get, HttpStatus, Inject, Param, ParseArrayPipe, Post, Query } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

import { Product } from "@billing/domain/product/entity/product.entity";
import { createProductUsecasePort, findProductUsecasePort, type ICreateProductUsecase, type IFindProductUsecase } from "@billing/domain/product/port/product.port";
import { CreateProductDto } from "@billing/infrastructure/transport/in/http/product/dto/create-product.dto";
import { code } from "@shared/domain/constant/code.constant";
import { type Page } from "@shared/domain/type/page.type";
import { type Response } from "@shared/domain/type/http.type";
import { PageParamsInput } from "@shared/infrastructure/transport/in/http/input/page-params.input";

@ApiTags('Products')
@Controller({
    path: 'products',
    version: '1',
})
export class ProductController {

    constructor(
        @Inject(findProductUsecasePort) private readonly findUsecase: IFindProductUsecase,
        @Inject(createProductUsecasePort) private readonly createUsecase: ICreateProductUsecase,
    ) {
    }

    @Get()
    @ApiOperation({ summary: 'List all products' })
    @ApiResponse({ status: HttpStatus.OK, description: 'List of products retrieved successfully' })
    async findAll(@Query() query: PageParamsInput): Promise<Response<Page<Product>>> {
        const pageParams = query.toPageParams();
        const data = await this.findUsecase.findAll(pageParams);
        return {
            data,
            message: "Lista de produtos recuperada com sucesso",
            code: code.findAllProductSuccess,
            statusCode: HttpStatus.OK,
        };
    }

    @Get(':id')
    @ApiOperation({ summary: 'Find product by ID' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Product retrieved successfully' })
    async findById(@Param('id') id: number): Promise<Response<Product | null>> {
        const data = await this.findUsecase.findById(Number(id));
        return {
            data,
            message: "Produto recuperado com sucesso",
            code: code.findByIdProductSuccess,
            statusCode: HttpStatus.OK,
        };
    }

    @Post()
    @ApiOperation({ summary: 'Create a new product' })
    @ApiResponse({ status: HttpStatus.CREATED, description: 'Product created successfully' })
    async create(@Body() body: CreateProductDto): Promise<Response<Product>> {
        const data = await this.createUsecase.execute(body.toProps());
        return {
            data,
            message: "Produto criado com sucesso",
            code: code.createProductSuccess,
            statusCode: HttpStatus.CREATED,
        };
    }

    @Post('bulk')
    @ApiOperation({ summary: 'Create multiple products in bulk' })
    @ApiResponse({ status: HttpStatus.CREATED, description: 'Products created successfully in bulk' })
    async createBulk(@Body(new ParseArrayPipe({ items: CreateProductDto })) body: CreateProductDto[]): Promise<Response<Product[]>> {
        const inputList = body.map(item => item.toProps());
        const data = await Promise.all(inputList.map(input => this.createUsecase.execute(input)));
        return {
            data,
            message: "Produtos criados com sucesso em lote",
            code: code.createBulkProductSuccess,
            statusCode: HttpStatus.CREATED,
        };
    }

}
