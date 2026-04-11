import { ValidationError } from "@nestjs/common";

export const getFirstValidationError = (errors: ValidationError[], parentPath = "",): { code: string; field: string } | null => {
    for (const error of errors) {
        const field = parentPath
            ? `${parentPath}.${error.property}`
            : error.property;

        if (error.constraints) {
            const code = Object.keys(error.constraints)[0];
            return { code, field };
        }

        if (error.children?.length) {
            const child = getFirstValidationError(error.children, field);
            if (child)
                return child;
        }
    }

    return null;
};
