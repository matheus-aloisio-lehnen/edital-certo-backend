import { ArgumentMetadata } from "@nestjs/common";

import { TrimPipe } from "./trim.pipe";

describe("TrimPipe", () => {
    let pipe: TrimPipe;

    beforeEach(() => {
        pipe = new TrimPipe();
    });

    it("should trim strings in body root fields", () => {
        const metadata: ArgumentMetadata = { type: "body" };

        const value = {
            name: "  Matheus  ",
            email: "  test@email.com ",
        };

        const result = pipe.transform(value, metadata);

        expect(result).toEqual({
            name: "Matheus",
            email: "test@email.com",
        });
    });

    it("should trim nested objects", () => {
        const metadata: ArgumentMetadata = { type: "body" };

        const value = {
            user: {
                name: "  Matheus  ",
                profile: {
                    bio: "  hello world  ",
                },
            },
        };

        const result = pipe.transform(value, metadata);

        expect(result).toEqual({
            user: {
                name: "Matheus",
                profile: {
                    bio: "hello world",
                },
            },
        });
    });

    it("should trim arrays", () => {
        const metadata: ArgumentMetadata = { type: "body" };

        const value = {
            tags: ["  a  ", " b ", "c  "],
        };

        const result = pipe.transform(value, metadata);

        expect(result).toEqual({
            tags: ["a", "b", "c"],
        });
    });

    it("should trim nested arrays and objects", () => {
        const metadata: ArgumentMetadata = { type: "body" };

        const value = {
            items: [
                { name: "  one  " },
                { name: "  two " },
                ["  a ", " b  "],
            ],
        };

        const result = pipe.transform(value, metadata);

        expect(result).toEqual({
            items: [
                { name: "one" },
                { name: "two" },
                ["a", "b"],
            ],
        });
    });

    it("should keep non-string values unchanged", () => {
        const metadata: ArgumentMetadata = { type: "body" };

        const value = {
            active: true,
            count: 10,
            nullable: null,
            date: new Date("2026-01-01T00:00:00.000Z"),
        };

        const result = pipe.transform(value, metadata);

        expect(result).toEqual(value);
    });

    it("should return value unchanged when type is not body", () => {
        const queryMetadata: ArgumentMetadata = { type: "query" };
        const paramMetadata: ArgumentMetadata = { type: "param" };

        const value = {
            name: "  Matheus  ",
        };

        expect(pipe.transform(value, queryMetadata)).toBe(value);
        expect(pipe.transform(value, paramMetadata)).toBe(value);
    });

    it("should trim a body string", () => {
        const metadata: ArgumentMetadata = { type: "body" };

        const value = "  Matheus  ";

        const result = pipe.transform(value, metadata);

        expect(result).toBe("Matheus");
    });

    it("should return null unchanged", () => {
        const metadata: ArgumentMetadata = { type: "body" };

        const result = pipe.transform(null, metadata);

        expect(result).toBeNull();
    });
});