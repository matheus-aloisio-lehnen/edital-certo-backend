import { Module } from "@nestjs/common";

import { loggerPort } from "@shared/domain/port/logger.port";
import { metricsPort } from "@shared/domain/port/metrics.port";
import { tracerPort } from "@shared/domain/port/tracer.port";
import { OpenTelemetryLogger } from "@shared/infrastructure/observability/logger/open-telemetry/opentelemetry-logger.adapter";
import { OpenTelemetryMetrics } from "@shared/infrastructure/observability/metrics/open-telemetry/opentelemetry-metrics.adapter";
import { OpenTelemetryTracer } from "@shared/infrastructure/observability/tracer/open-telemetry/opentelemetry-tracer.adapter";

@Module({
    imports: [],
    providers: [
        OpenTelemetryLogger,
        OpenTelemetryMetrics,
        OpenTelemetryTracer,
        { provide: loggerPort, useExisting: OpenTelemetryLogger },
        { provide: metricsPort, useExisting: OpenTelemetryMetrics },
        { provide: tracerPort, useExisting: OpenTelemetryTracer },
    ],
    exports: [
        loggerPort,
        metricsPort,
        tracerPort,
    ],
})
export class ObservabilityModule {}
