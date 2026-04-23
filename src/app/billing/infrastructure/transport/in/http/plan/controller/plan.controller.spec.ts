import { describe, it, expect, beforeEach, vi } from "vitest";
import { HttpStatus } from "@nestjs/common";

import { sortOrder } from "@shared/domain/type/page.type";
import { PlanController } from "./plan.controller";
import { code } from "@shared/domain/constant/code.constant";

describe("PlanController", () => {
    let controller: PlanController;

    const findUsecase = {
        findAll: vi.fn(),
        findById: vi.fn(),
    };

    const createUsecase = {
        execute: vi.fn(),
    };

    beforeEach(() => {
        vi.clearAllMocks();
        controller = new PlanController(
            findUsecase as any,
            createUsecase as any,
        );
    });

    it("should call findAll with transformed page params and return response envelope", async () => {
        const pageParams = {
            offset: 0,
            limit: 10,
            orderBy: "id",
            sortOrder: sortOrder.desc,
        };

        const query = {
            toPageParams: vi.fn().mockReturnValue(pageParams),
        } as any;

        const data = { list: [], count: 0, offset: 0, limit: 10 };
        findUsecase.findAll.mockResolvedValue(data);

        const result = await controller.findAll(query);

        expect(query.toPageParams).toHaveBeenCalledTimes(1);
        expect(findUsecase.findAll).toHaveBeenCalledWith(pageParams);
        expect(result).toEqual({
            data,
            message: "Lista de planos recuperada com sucesso",
            code: code.findAllPlanSuccess,
            statusCode: HttpStatus.OK,
        });
    });

    it("should call findById with numeric id and return response envelope", async () => {
        const data = { id: 1 };
        findUsecase.findById.mockResolvedValue(data);

        const result = await controller.findById("1" as any);

        expect(findUsecase.findById).toHaveBeenCalledWith(1);
        expect(result).toEqual({
            data,
            message: "Plano recuperado com sucesso",
            code: code.findByIdPlanSuccess,
            statusCode: HttpStatus.OK,
        });
    });

    it("should call createUsecase with transformed props and return response envelope", async () => {
        const props = { name: "Plan 1" };

        const body = {
            toProps: vi.fn().mockReturnValue(props),
        } as any;

        const data = { id: 1 };
        createUsecase.execute.mockResolvedValue(data);

        const result = await controller.create(body);

        expect(body.toProps).toHaveBeenCalledTimes(1);
        expect(createUsecase.execute).toHaveBeenCalledWith(props);
        expect(result).toEqual({
            data,
            message: "Plano criado com sucesso",
            code: code.createPlanSuccess,
            statusCode: HttpStatus.CREATED,
        });
    });

    it("should call createBulk with transformed props and return response envelope", async () => {
        const props1 = { name: "Plan 1" };
        const props2 = { name: "Plan 2" };

        const body = [
            { toProps: vi.fn().mockReturnValue(props1) },
            { toProps: vi.fn().mockReturnValue(props2) },
        ] as any;

        const data = [{ id: 1 }, { id: 2 }];
        createUsecase.execute
            .mockResolvedValueOnce(data[0])
            .mockResolvedValueOnce(data[1]);

        const result = await controller.createBulk(body);

        expect(body[0].toProps).toHaveBeenCalledTimes(1);
        expect(body[1].toProps).toHaveBeenCalledTimes(1);
        expect(createUsecase.execute).toHaveBeenNthCalledWith(1, props1);
        expect(createUsecase.execute).toHaveBeenNthCalledWith(2, props2);
        expect(result).toEqual({
            data,
            message: "Planos criados com sucesso em lote",
            code: code.createBulkPlanSuccess,
            statusCode: HttpStatus.CREATED,
        });
    });
});
