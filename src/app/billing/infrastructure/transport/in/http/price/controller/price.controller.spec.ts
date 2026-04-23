import { describe, it, expect, beforeEach, vi } from "vitest";
import { HttpStatus } from "@nestjs/common";

import { code } from "@shared/domain/constant/code.constant";
import { sortOrder } from "@shared/domain/type/page.type";

import { PriceController } from "./price.controller";

describe("PriceController", () => {
    let controller: PriceController;

    const findUsecase = {
        findAll: vi.fn(),
        findById: vi.fn(),
    };

    const createUsecase = {
        execute: vi.fn(),
    };

    beforeEach(() => {
        vi.clearAllMocks();
        controller = new PriceController(
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
            message: "Lista de preços recuperada com sucesso",
            code: code.findAllPriceSuccess,
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
            message: "Preço recuperado com sucesso",
            code: code.findByIdPriceSuccess,
            statusCode: HttpStatus.OK,
        });
    });

    it("should call createUsecase with transformed props and return response envelope", async () => {
        const props = { value: 100 };

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
            message: "Preço criado com sucesso",
            code: code.createPriceSuccess,
            statusCode: HttpStatus.CREATED,
        });
    });

    it("should call createBulk with transformed props and return response envelope", async () => {
        const props1 = { value: 100 };
        const props2 = { value: 200 };

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
            message: "Preços criados com sucesso em lote",
            code: code.createBulkPriceSuccess,
            statusCode: HttpStatus.CREATED,
        });
    });
});
