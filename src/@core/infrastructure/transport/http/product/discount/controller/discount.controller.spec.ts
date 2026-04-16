import { describe, it, expect, beforeEach, vi } from "vitest";

import { sortOrder } from "@domain/@shared/type/page.type";
import { DiscountController } from "@transport/http/product/discount/controller/discount.controller";

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

    it("should call findAll with transformed page params", async () => {
        const pageParams = {
            offset: 0,
            limit: 10,
            orderBy: "id",
            sortOrder: sortOrder.desc,
        };

        const query = {
            toPageParams: vi.fn().mockReturnValue(pageParams),
        } as any;

        const response = { list: [], count: 0, offset: 0, limit: 10 };
        findUsecase.findAll.mockResolvedValue(response);

        const result = await controller.findAll(query);

        expect(query.toPageParams).toHaveBeenCalledTimes(1);
        expect(findUsecase.findAll).toHaveBeenCalledWith(pageParams);
        expect(result).toBe(response);
    });

    it("should call findAllByPriceId with numeric priceId and page params", async () => {
        const pageParams = {
            offset: 0,
            limit: 10,
            orderBy: "id",
            sortOrder: sortOrder.desc,
        };

        const query = {
            toPageParams: vi.fn().mockReturnValue(pageParams),
        } as any;

        const response = { list: [], count: 0, offset: 0, limit: 10 };
        findUsecase.findAllByPriceId.mockResolvedValue(response);

        const result = await controller.findAllByPriceId("123" as any, query);

        expect(query.toPageParams).toHaveBeenCalledTimes(1);
        expect(findUsecase.findAllByPriceId).toHaveBeenCalledWith(123, pageParams);
        expect(result).toBe(response);
    });

    it("should call findById with numeric id", async () => {
        const response = { id: 1 };
        findUsecase.findById.mockResolvedValue(response);

        const result = await controller.findById("1" as any);

        expect(findUsecase.findById).toHaveBeenCalledWith(1);
        expect(result).toBe(response);
    });

    it("should call createUsecase with transformed props", async () => {
        const props = { priceId: 1 };

        const body = {
            toProps: vi.fn().mockReturnValue(props),
        } as any;

        const response = { id: 1 };
        createUsecase.execute.mockResolvedValue(response);

        const result = await controller.create(body);

        expect(body.toProps).toHaveBeenCalledTimes(1);
        expect(createUsecase.execute).toHaveBeenCalledWith(props);
        expect(result).toBe(response);
    });

    it("should call deleteUsecase with numeric id", async () => {
        deleteUsecase.delete.mockResolvedValue(undefined);

        const result = await controller.delete("1" as any);

        expect(deleteUsecase.delete).toHaveBeenCalledWith(1);
        expect(result).toBeUndefined();
    });
});