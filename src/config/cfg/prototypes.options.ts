import { WhereClause } from "@domain/@shared/type/page.type";

let registered = false;

export const registerPrototypes = () => {

    if (registered)
        return;
    registered = true;

    Array.prototype.first = function <T>(this: T[]): T | undefined {
        return this.length
            ? this[0]
            : undefined;
    };

    Array.prototype.last = function <T>(this: T[]): T | undefined {
        return this.length
            ? this[this.length - 1]
            : undefined;
    };

    Array.prototype.isEmpty = function (): boolean {
        return this.length === 0;
    };

    Array.prototype.isNotEmpty = function (): boolean {
        return this.length > 0;
    };

    Array.prototype.updateAt = function <T>(this: T[], index: number, item: T): T[] {
        return [...this.slice(0, index), item, ...this.slice(index + 1)];
    };

    Array.prototype.updateById = function <T extends { id: number }>(
        this: T[],
        id: number,
        patch: Partial<T>,
    ): T[] {
        const i = this.findIndex(x => x.id === id);
        if (i < 0)
            return this;

        const copy = [...this];
        copy[i] = { ...copy[i], ...patch };
        return copy;
    };

    Array.prototype.removeAt = function <T>(this: T[], index: number): T[] {
        if (index < 0 || index >= this.length)
            throw new Error("Index out of bounds");

        return [...this.slice(0, index), ...this.slice(index + 1)];
    };

    Array.prototype.removeById = function <T extends { id: number }>(this: T[], id: number): T[] {
        const i = this.findIndex(x => x.id === id);
        if (i < 0)
            return this;

        return [...this.slice(0, i), ...this.slice(i + 1)];
    };

    Array.prototype.removeWhere = function <T>(this: T[], predicate: (x: T) => boolean): T[] {
        return this.filter(x => !predicate(x));
    };

    Array.prototype.groupBy = function <T, K extends keyof T>(
        this: T[],
        key: K,
    ): Record<string, T[]> {

        return this.reduce((acc, item) => {
            const k = String(item[key]);
            if (!acc[k])
                acc[k] = [];
            acc[k].push(item);
            return acc;
        }, {} as Record<string, T[]>);
    };

    Array.prototype.uniqueBy = function <T, K extends keyof T>(this: T[], key: K): T[] {

        const seen = new Set<unknown>();

        return this.filter(item => {
            const v = item[key];
            if (seen.has(v))
                return false;
            seen.add(v);
            return true;
        });
    };

    Array.prototype.toArrayIds = function <T extends { id: number }>(this: T[]): number[] {
        return this.map(x => x.id);
    };

    Array.prototype.chunks = function <T>(this: T[], size: number): T[][] {

        const result: T[][] = [];

        for (let i = 0; i < this.length; i += size)
            result.push(this.slice(i, i + size));

        return result;
    };

    Array.prototype.sumBy = function <T>(this: T[], selector: (item: T) => number): number {
        return this.reduce((acc, item) => acc + selector(item), 0);
    };

    Array.prototype.pluck = function <T, K extends keyof T>(this: T[], key: K): T[K][] {
        return this.map(x => x[key]);
    };

    Array.prototype.In = function <T>(this: T[]): WhereClause<T[]> {
        return { op: "in", args: this };
    };

    String.prototype.isBlank = function (): boolean {
        return this.trim().length === 0;
    };

    String.prototype.capitalize = function (): string {
        const s = this.trim();
        return s
            ? s[0].toUpperCase() + s.slice(1)
            : s;
    };

    String.prototype.stripAccents = function (): string {
        return this.normalize("NFD").replace(/\p{Diacritic}/gu, "");
    };

    String.prototype.toSlug = function (): string {
        return this
            .stripAccents()
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")
            .trim()
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-");
    };

    String.prototype.removeHtml = function (): string {
        return this.replace(/(<([^>]+)>)/gi, "");
    };

    String.prototype.truncate = function (max: number): string {
        return this.length <= max
            ? this.toString()
            : this.slice(0, max) + "...";
    };

    String.prototype.normalizeSpaces = function (): string {
        return this.trim().replace(/\s+/g, " ");
    };

    String.prototype.toSearchPattern = function (): string {
        return `%${ this.normalizeSpaces().replace(/\s+/g, "%") }%`;
    };

    String.prototype.escapeLike = function (): string {
        return this.replace(/[%_]/g, "\\$&");
    };

    String.prototype.Like = function (): WhereClause<string> {
        const v = this.normalizeSpaces();
        return { op: "like", args: `%${ v }%` };
    };

    String.prototype.ILike = function (): WhereClause<string> {
        const v = this.normalizeSpaces();
        return { op: "ilike", args: `%${ v }%` };
    };

    Number.prototype.Gt = function (): WhereClause<number> {
        return { op: "gt", args: Number(this) };
    };

    Number.prototype.Gte = function (): WhereClause<number> {
        return { op: "gte", args: Number(this) };
    };

    Number.prototype.Lt = function (): WhereClause<number> {
        return { op: "lt", args: Number(this) };
    };

    Number.prototype.Lte = function (): WhereClause<number> {
        return { op: "lte", args: Number(this) };
    };

    Date.prototype.Gt = function (): WhereClause<Date> {
        return { op: "gt", args: this };
    };

    Date.prototype.Gte = function (): WhereClause<Date> {
        return { op: "gte", args: this };
    };

    Date.prototype.Lt = function (): WhereClause<Date> {
        return { op: "lt", args: this };
    };

    Date.prototype.Lte = function (): WhereClause<Date> {
        return { op: "lte", args: this };
    };

    Date.prototype.Between = function (end: Date): WhereClause<[Date, Date]> {
        return { op: "between", args: [this, end] };
    };

    Object.pick = function <T extends object, K extends keyof T>(obj: T,keys: K[]): Pick<T, K> {
        const result = {} as Pick<T, K>;
        for (const k of keys)
            if (k in obj)
                result[ k ] = obj[ k ];
        return result;
    };

    Object.omit = function <T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
        const result = { ...obj };
        for (const k of keys)
            delete (result as Record<string, unknown>)[String(k)];
        return result;
    };

};