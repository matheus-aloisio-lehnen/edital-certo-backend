import { Body, Controller, Get, HttpStatus, Inject, Param, ParseArrayPipe, Post, Query } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

import { Plan } from "@billing/domain/plan/entity/plan.entity";
import { createPlanUsecasePort, findPlanUsecasePort, type ICreatePlanUsecase, type IFindPlanUsecase } from "@billing/domain/plan/port/plan.port";
import { CreatePlanDto } from "@billing/infrastructure/transport/in/http/plan/dto/create-plan.dto";
import { code } from "@shared/domain/constant/code.constant";
import { type Page } from "@shared/domain/type/page.type";
import { type Response } from "@shared/domain/type/http.type";
import { PageParamsInput } from "@shared/infrastructure/transport/in/http/input/page-params.input";

@ApiTags('Plans')
@Controller({
    path: 'plans',
    version: '1',
})
export class PlanController {

    constructor(
        @Inject(findPlanUsecasePort) private readonly findUsecase: IFindPlanUsecase,
        @Inject(createPlanUsecasePort) private readonly createUsecase: ICreatePlanUsecase,
    ) {
    }

    @Get()
    @ApiOperation({ summary: 'List all plans' })
    @ApiResponse({ status: HttpStatus.OK, description: 'List of plans retrieved successfully' })
    async findAll(@Query() query: PageParamsInput): Promise<Response<Page<Plan>>> {
        const pageParams = query.toPageParams();
        const data = await this.findUsecase.findAll(pageParams);
        return {
            data,
            message: "Lista de planos recuperada com sucesso",
            code: code.findAllPlanSuccess,
            statusCode: HttpStatus.OK,
        };
    }

    @Get(':id')
    @ApiOperation({ summary: 'Find plan by ID' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Plan retrieved successfully' })
    async findById(@Param('id') id: number): Promise<Response<Plan | null>> {
        const data = await this.findUsecase.findById(Number(id));
        return {
            data,
            message: "Plano recuperado com sucesso",
            code: code.findByIdPlanSuccess,
            statusCode: HttpStatus.OK,
        };
    }

    @Post()
    @ApiOperation({ summary: 'Create a new plan' })
    @ApiResponse({ status: HttpStatus.CREATED, description: 'Plan created successfully' })
    async create(@Body() body: CreatePlanDto): Promise<Response<Plan>> {
        const data = await this.createUsecase.execute(body.toProps());
        return {
            data,
            message: "Plano criado com sucesso",
            code: code.createPlanSuccess,
            statusCode: HttpStatus.CREATED,
        };
    }

    @Post('bulk')
    @ApiOperation({ summary: 'Create multiple plans in bulk' })
    @ApiResponse({ status: HttpStatus.CREATED, description: 'Plans created successfully in bulk' })
    async createBulk(@Body(new ParseArrayPipe({ items: CreatePlanDto })) body: CreatePlanDto[]): Promise<Response<Plan[]>> {
        const inputList = body.map(item => item.toProps());
        const data = await Promise.all(inputList.map(input => this.createUsecase.execute(input)));
        return {
            data,
            message: "Planos criados com sucesso em lote",
            code: code.createBulkPlanSuccess,
            statusCode: HttpStatus.CREATED,
        };
    }

}
