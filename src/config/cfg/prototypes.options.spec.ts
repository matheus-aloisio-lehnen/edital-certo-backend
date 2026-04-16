import { registerPrototypes } from "@cfg/prototypes.options";

describe("registerPrototypes", () => {
    beforeAll(() => {
        registerPrototypes();
        registerPrototypes();
    });

    it("registerPrototypes should extend array helpers", () => {
        const list = [{ id: 1, name: "a" }, { id: 2, name: "b" }, { id: 2, name: "b2" }];

        expect(list.first()).toEqual({ id: 1, name: "a" });
        expect(list.last()).toEqual({ id: 2, name: "b2" });
        expect([].isEmpty()).toBe(true);
        expect([1].isNotEmpty()).toBe(true);
        expect([1, 2, 3].updateAt(1, 5)).toEqual([1, 5, 3]);
        expect(list.updateById(2, { name: "patched" })).toEqual([{ id: 1, name: "a" }, { id: 2, name: "patched" }, { id: 2, name: "b2" }]);
        expect(list.updateById(99, { name: "patched" })).toBe(list);
        expect([1, 2, 3].removeAt(1)).toEqual([1, 3]);
        expect(() => [1, 2, 3].removeAt(4)).toThrow("Index out of bounds");
        expect(list.removeById(1)).toEqual([{ id: 2, name: "b" }, { id: 2, name: "b2" }]);
        expect(list.removeById(99)).toBe(list);
        expect([1, 2, 3].removeWhere(x => x > 1)).toEqual([1]);
        expect(list.groupBy("id")).toEqual({
            "1": [{ id: 1, name: "a" }],
            "2": [{ id: 2, name: "b" }, { id: 2, name: "b2" }],
        });
        expect(list.uniqueBy("id")).toEqual([{ id: 1, name: "a" }, { id: 2, name: "b" }]);
        expect(list.toArrayIds()).toEqual([1, 2, 2]);
        expect([1, 2, 3, 4, 5].chunks(2)).toEqual([[1, 2], [3, 4], [5]]);
        expect(list.sumBy(item => item.id)).toBe(5);
        expect(list.pluck("name")).toEqual(["a", "b", "b2"]);
        expect([1, 2, 3].In()).toEqual({ op: "in", args: [1, 2, 3] });
    });

    it("registerPrototypes should extend string helpers", () => {
        expect("   ".isBlank()).toBe(true);
        expect("  matheus".capitalize()).toBe("Matheus");
        expect("ação".stripAccents()).toBe("acao");
        expect(" Plano Start ".toSlug()).toBe("plano-start");
        expect("<b>bold</b>".removeHtml()).toBe("bold");
        expect("abcdef".truncate(3)).toBe("abc...");
        expect("abc".truncate(3)).toBe("abc");
        expect("  um   dois  ".normalizeSpaces()).toBe("um dois");
        expect("um dois".toSearchPattern()).toBe("%um%dois%");
        expect("%_".escapeLike()).toBe("\\%\\_");
        expect("  hello world ".Like()).toEqual({ op: "like", args: "%hello world%" });
        expect("  hello world ".ILike()).toEqual({ op: "ilike", args: "%hello world%" });
    });

    it("registerPrototypes should extend number and date helpers", () => {
        const start = new Date("2026-01-01");
        const end = new Date("2026-01-31");

        expect((10).Gt()).toEqual({ op: "gt", args: 10 });
        expect((10).Gte()).toEqual({ op: "gte", args: 10 });
        expect((10).Lt()).toEqual({ op: "lt", args: 10 });
        expect((10).Lte()).toEqual({ op: "lte", args: 10 });
        expect(start.Gt()).toEqual({ op: "gt", args: start });
        expect(start.Gte()).toEqual({ op: "gte", args: start });
        expect(start.Lt()).toEqual({ op: "lt", args: start });
        expect(start.Lte()).toEqual({ op: "lte", args: start });
        expect(start.Between(end)).toEqual({ op: "between", args: [start, end] });
    });

    it("registerPrototypes should extend object helpers", () => {
        const obj = { id: 1, name: "Matheus", email: "m@test.com" };

        expect(Object.pick(obj, ["id", "name"])).toEqual({ id: 1, name: "Matheus" });
        expect(Object.omit(obj, ["email"])).toEqual({ id: 1, name: "Matheus" });
        expect(obj).toEqual({ id: 1, name: "Matheus", email: "m@test.com" });
    });
});
