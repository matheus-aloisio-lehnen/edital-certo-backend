import { Module } from '@nestjs/common';
import { Logger } from "@observability/logger/logger.service";
import { Metrics } from "@observability/metrics/metrics.service";
import { Tracer } from "@observability/tracer/tracer.service";
import { loggerPort } from "@domain/@shared/port/logger.port";
import { metricsPort } from "@app/@core/domain/@shared/port/metrics.port";
import { tracerPort } from "@app/@core/domain/@shared/port/tracer.port";

@Module({
    providers: [
        Logger,
        Metrics,
        Tracer,
        { provide: loggerPort, useExisting: Logger },
        { provide: metricsPort, useExisting: Metrics },
        { provide: tracerPort, useExisting: Tracer },
    ],
    exports: [ loggerPort, metricsPort, tracerPort ]
})
export class ObservabilityModule {
}
