import { ValidationError } from "@nestjs/common";
import { code } from "@shared/domain/constant/code.constant";

export type ResolvedValidationError = {
    code: string;
    field?: string;
};

export const resolveFirstValidationError = (errors: ValidationError[], parentPath = ""): ResolvedValidationError => {
    for (const error of errors) {
        const field = parentPath
            ? `${parentPath}.${error.property}`
            : error.property;

        if (error.constraints) {
            const errorCode = Object.keys(error.constraints)[0];
            return { code: errorCode, field };
        }

        if (error.children?.length) {
            return resolveFirstValidationError(error.children, field);
        }
    }

    return { code: code.badRequest };
};
