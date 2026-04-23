import { describe, it, expect, beforeEach, vi } from "vitest";
import { HttpStatus } from "@nestjs/common";

import { sortOrder } from "@shared/domain/type/page.type";
import { DiscountController } from "./discount.controller";
import { code } from "@shared/domain/constant/code.constant";

describe("DiscountController", () => {
    let controller: DiscountController;

    const findUsecase = {
        findAll: vi.fn(),
        findAllByPriceId: vi.fn(),
        findById: vi.fn(),
    };

    const createUsecase = {
        execute: vi.fn(),
    };

    const deleteUsecase = {
        delete: vi.fn(),
    };

    beforeEach(() => {
        vi.clearAllMocks();
        controller = new DiscountController(
            findUsecase as any,
            createUsecase as any,
            deleteUsecase as any,
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
            message: "Lista de descontos recuperada com sucesso",
            code: code.findAllDiscountSuccess,
            statusCode: HttpStatus.OK,
        });
    });

    it("should call findAllByPriceId with numeric priceId and page params and return response envelope", async () => {
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
        findUsecase.findAllByPriceId.mockResolvedValue(data);

        const result = await controller.findAllByPriceId("123" as any, query);

        expect(query.toPageParams).toHaveBeenCalledTimes(1);
        expect(findUsecase.findAllByPriceId).toHaveBeenCalledWith(123, pageParams);
        expect(result).toEqual({
            data,
            message: "Lista de descontos por preço recuperada com sucesso",
            code: code.findAllByPriceIdDiscountSuccess,
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
            message: "Desconto recuperado com sucesso",
            code: code.findByIdDiscountSuccess,
            statusCode: HttpStatus.OK,
        });
    });

    it("should call createUsecase with transformed props and return response envelope", async () => {
        const props = { priceId: 1 };

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
            message: "Desconto criado com sucesso",
            code: code.createDiscountSuccess,
            statusCode: HttpStatus.CREATED,
        });
    });

    it("should call deleteUsecase with numeric id and return response envelope", async () => {
        const data = true;
        deleteUsecase.delete.mockResolvedValue(data);

        const result = await controller.delete("1" as any);

        expect(deleteUsecase.delete).toHaveBeenCalledWith(1);
        expect(result).toEqual({
            data,
            message: "Desconto removido com sucesso",
            code: code.deleteDiscountSuccess,
            statusCode: HttpStatus.OK,
        });
    });
});
