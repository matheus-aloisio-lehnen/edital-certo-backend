import { buildPageParams, sortOrder } from "@domain/@shared/type/page.type";

describe("page.props", () => {
    it("should build default page params", () => {
        expect(buildPageParams()).toEqual({
            offset: 0,
            limit: 10,
            orderBy: "id",
            sortOrder: sortOrder.desc,
        });
    });

    it("should build custom page params", () => {
        expect(buildPageParams({
            offset: 20,
            limit: 5,
            orderBy: "createdAt",
            sortOrder: sortOrder.asc,
        })).toEqual({
            offset: 20,
            limit: 5,
            orderBy: "createdAt",
            sortOrder: sortOrder.asc,
        });
    });

    it("should include start, end and where only when provided", () => {
        expect(buildPageParams({
            start: "2026-01-01",
            end: "2026-01-31",
            where: { status: "active" },
        })).toEqual({
            offset: 0,
            limit: 10,
            orderBy: "id",
            sortOrder: sortOrder.desc,
            start: "2026-01-01",
            end: "2026-01-31",
            where: { status: "active" },
        });
    });
});
