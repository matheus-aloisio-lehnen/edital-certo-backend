import { HttpStatus, Module, ValidationError, ValidationPipe } from "@nestjs/common";
import { APP_FILTER, APP_PIPE } from "@nestjs/core";

import { AppException } from "@shared/domain/exception/app.exception";
import { ObservabilityModule } from "@shared/infrastructure/observability/observability.module";
import { AllExceptionsFilter } from "@shared/infrastructure/transport/in/http/filters/all-exceptions.filter";
import { TrimPipe } from "@shared/infrastructure/transport/in/http/pipe/trim/trim.pipe";
import { resolveFirstValidationError } from "@shared/infrastructure/transport/in/http/validation/first-error.validation";

@Module({
    imports: [
        ObservabilityModule,
    ],
    providers: [
        {
            provide: APP_FILTER,
            useClass: AllExceptionsFilter,
        },
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
                        const error = resolveFirstValidationError(errors);
                        return new AppException(error.code, HttpStatus.BAD_REQUEST);
                    },
                }),
        },
    ],
})
export class SharedTransportInModule {}
