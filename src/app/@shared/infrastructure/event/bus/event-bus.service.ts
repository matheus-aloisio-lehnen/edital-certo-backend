import { Inject, Injectable } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";

import { type EventInput, type IEventBus } from "@shared/domain/port/event-bus.port";
import { type ILogger, loggerPort } from "@shared/domain/port/logger.port";
import { type IMetrics, metricsPort } from "@shared/domain/port/metrics.port";
import { type ITracer, tracerPort } from "@shared/domain/port/tracer.port";

@Injectable()
export class EventBusService implements IEventBus {

    constructor(
        private readonly eventEmitter: EventEmitter2,
        @Inject(loggerPort) private readonly logger: ILogger,
        @Inject(metricsPort) private readonly metrics: IMetrics,
        @Inject(tracerPort) private readonly tracer: ITracer,
    ) {
    }

    async publish(input: EventInput): Promise<void> {
        const listenerCount = this.eventEmitter.listeners(input.name).length;
        const startedAt = Date.now();
        const span = this.tracer.start("event_bus.publish", {
            "event.name": input.name,
            "event.listeners": listenerCount,
        });

        this.metrics.increment("event_bus_publish_total", {
            context: "EventBusService",
            event: input.name,
        });

        try {
            await this.eventEmitter.emitAsync(input.name, input);

            this.metrics.increment("event_bus_publish_success_total", {
                context: "EventBusService",
                event: input.name,
            });
        } catch (error) {
            this.metrics.increment("event_bus_publish_failure_total", {
                context: "EventBusService",
                event: input.name,
            });

            this.logger.error({
                msg: "Event handler failed",
                error: error instanceof Error ? error.message : String(error),
                event: input.name,
                listenerCount,
            }, error instanceof Error ? error.stack : undefined, "EventBusService");

            throw error;
        } finally {
            this.metrics.observe("event_bus_publish_duration_ms", Date.now() - startedAt, {
                context: "EventBusService",
                event: input.name,
            });
            span.end();
        }
    }

}
