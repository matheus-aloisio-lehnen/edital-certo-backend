import { HttpStatus, Provider, ValidationError, ValidationPipe } from "@nestjs/common";
import { APP_PIPE } from "@nestjs/core";
import { TrimPipe } from "@pipes/trim/trim.pipe";
import { getFirstValidationError } from "@functions/functions.utils";
import { AppException } from "@domain/@shared/exceptions/app.exception";
import { BackendCode } from "@domain/@shared/constants/backend-code.constant";


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
                    const code = error?.code ?? BackendCode.badRequest;
                    return new AppException(code, HttpStatus.BAD_REQUEST);
                },
            }),
    },
];