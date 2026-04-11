import { Provider } from "@nestjs/common";
import { APP_FILTER } from "@nestjs/core";
import { AllExceptionsFilter } from "@app/@core/infrastructure/transport/http/filters/all-exceptions.filter";

export const provideGlobalFilters = (): Provider[] => [
    {
        provide: APP_FILTER,
        useClass: AllExceptionsFilter,
    },
];
