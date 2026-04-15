import { HttpStatus, Provider, ValidationError, ValidationPipe } from "@nestjs/common";
import { APP_PIPE } from "@nestjs/core";
import { TrimPipe } from "@utils/pipe/trim/trim.pipe";
import { AppException } from "@domain/@shared/exception/app.exception";
import { code } from "@domain/@shared/constant/code.constant";
import { getFirstValidationError } from "@utils/function/global-function.utils";


export const provideGlobalPipes = (): Provider[] => [
    {
        provide: APP_PIPE,
        useClass: TrimPipe,
    },
    {
        provide: APP_PIPE,
        useFactory: () =>
            new ValidationPipe({
                whitelist: true,
                transform: true,
                validationError: {
                    target: false,
                    value: false,
                },
                exceptionFactory: (errors: ValidationError[]) => {
                    const error = getFirstValidationError(errors);
                    const errorCode = error?.code ?? code.badRequest;
                    return new AppException(errorCode, HttpStatus.BAD_REQUEST);
                },
            }),
    },
];