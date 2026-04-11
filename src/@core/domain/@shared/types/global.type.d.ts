declare global {

    interface Array<T> {
        first(): T | undefined;
        last(): T | undefined;
        isEmpty(): boolean;
        isNotEmpty(): boolean;

        updateAt(index: number, item: T): T[];
        updateById(id: number, patch: Partial<T>): T[];
        removeAt(index: number): T[];
        removeById(id: number): T[];
        removeWhere(predicate: (x: T) => boolean): T[];

        groupBy<K extends keyof T>(key: K): Record<string, T[]>;
        uniqueBy<K extends keyof T>(key: K): T[];

        toArrayIds(): number[];
        chunks(size: number): T[][];

        sumBy(selector: (item: T) => number): number;
        pluck<K extends keyof T>(key: K): T[K][];

        In(): WhereClause<T[]>;
    }

    interface String {
        isBlank(): boolean;
        capitalize(): string;
        stripAccents(): string;
        toSlug(): string;
        removeHtml(): string;
        truncate(max: number): string;
        normalizeSpaces(): string;
        toSearchPattern(): string;
        escapeLike(): string;

        Like(): WhereClause<string>;
        ILike(): WhereClause<string>;
    }

    interface Number {
        Gt(): WhereClause<number>;
        Gte(): WhereClause<number>;
        Lt(): WhereClause<number>;
        Lte(): WhereClause<number>;
    }

    interface Date {
        Gt(): WhereClause<Date>;
        Gte(): WhereClause<Date>;
        Lt(): WhereClause<Date>;
        Lte(): WhereClause<Date>;
        Between(end: Date): WhereClause<[Date, Date]>;
    }

    interface ObjectConstructor {
        pick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K>;
        omit<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K>;
    }
    
}

export {};
