import {
    Between,
    Equal,
    FindManyOptions,
    FindOptionsOrder,
    ILike,
    In,
    LessThan,
    LessThanOrEqual,
    Like,
    MoreThan,
    MoreThanOrEqual,
} from "typeorm";
import { startOfDay, endOfDay, isValid } from "date-fns";
import { type WhereClause, type PageParams } from "@shared/domain/type/page.type";
import { toSortOrder } from "@shared/domain/function/to-sort-order.function";
import { sortOrder } from "@shared/domain/type/page.type";

export const toQuery = <T>(params: PageParams, allowedOrderBy: string[]): FindManyOptions => {
    const baseWhere = buildWhere(params.where);
    const where = applyDateRange(baseWhere, params);
    const order = buildOrder(params, allowedOrderBy);

    return { where, order };
};

const buildWhere = (input?: Record<string, any>) => {
    if (!input)
        return {};

    let result: Record<string, any> = {};

    for (const key in input) {
        const value = input[key];
        if (!key)
            continue;

        const path = key.split(".");
        const whereCondition = toWhereCondition(value);

        const nested = buildNestedObject(path, whereCondition);
        result = deepMergeObjects(result, nested);
    }

    return result;
};

const applyDateRange = (where: Record<string, any>, params: PageParams) => {
    if (!params.start && !params.end)
        return where;

    const hasOverride = Object.keys(where).some((key) => key.includes("createdAt"));

    if (hasOverride)
        return where;

    const result = { ...where };

    const start = params.start ?? null;
    const end = params.end ?? null;

    const validStart = start && isValid(start)
        ? startOfDay(start)
        : null;

    const validEnd = end && isValid(end)
        ? endOfDay(end)
        : null;

    if (validStart && validEnd) {
        result["createdAt"] = Between(validStart, validEnd);
        return result;
    }

    if (validStart) {
        result["createdAt"] = MoreThanOrEqual(validStart);
        return result;
    }

    if (validEnd) {
        result["createdAt"] = LessThanOrEqual(validEnd);
        return result;
    }

    return result;
};

const buildOrder = <T>(params: PageParams, allowed: readonly string[],): FindOptionsOrder<T> => {
    const fallback = "id";
    const requestedOrderBy = params.orderBy ?? fallback;

    const orderBy = allowed.includes(requestedOrderBy)
        ? requestedOrderBy
        : fallback;

    const direction = toSortOrder(params.sortOrder, sortOrder.desc);

    return buildNestedObject(orderBy.split("."), direction) as FindOptionsOrder<T>;
};

const toWhereCondition = (value: any) => {
    const isObject = typeof value === "object" && value !== null;
    const isWhereClause = isObject && "op" in value;

    if (!isWhereClause)
        return Equal(value);

    const clause = value as WhereClause;

    switch (clause.op) {
        case "like":
            return Like(String(clause.args));
        case "ilike":
            return ILike(String(clause.args));
        case "in":
            return In(clause.args as any[]);
        case "gt":
            return MoreThan(clause.args);
        case "gte":
            return MoreThanOrEqual(clause.args);
        case "lt":
            return LessThan(clause.args);
        case "lte":
            return LessThanOrEqual(clause.args);
        case "between":
            const [start, end] = clause.args as [any, any];
            return Between(start, end);
        default:
            return Equal(clause.args);
    }
};

const buildNestedObject = (path: string[], value: any) => {
    const root: Record<string, any> = {};
    let current = root;

    path.forEach((segment, index) => {
        if (index === path.length - 1) {
            current[segment] = value;
            return;
        }

        current[segment] = {};
        current = current[segment];
    });

    return root;
};

const deepMergeObjects = (target: Record<string, any>, source: Record<string, any>) => {
    const result = { ...target };

    for (const key in source) {
        const targetValue = result[key];
        const sourceValue = source[key];

        const targetIsObject = targetValue !== null && typeof targetValue === "object";
        const sourceIsObject = sourceValue !== null && typeof sourceValue === "object";

        const targetIsDate = targetValue instanceof Date;
        const sourceIsDate = sourceValue instanceof Date;

        const shouldDeepMerge =
            targetIsObject &&
            sourceIsObject &&
            !targetIsDate &&
            !sourceIsDate;

        if (shouldDeepMerge) {
            result[key] = deepMergeObjects(targetValue, sourceValue);
            continue;
        }

        result[key] = sourceValue;
    }

    return result;
};
