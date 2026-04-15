import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { IEventBus, EventInput } from "@domain/@shared/port/event-bus.port";
import { Logger } from "@observability/logger/logger.service";
import { Metrics } from "@observability/metrics/metrics.service";
import { Tracer } from "@observability/tracer/tracer.service";

@Injectable()
export class EventBusService implements IEventBus {

    constructor(
        private readonly eventEmitter: EventEmitter2,
        private readonly logger: Logger,
        private readonly metrics: Metrics,
        private readonly tracer: Tracer,
    ) {}

    async publish(input: EventInput): Promise<void> {
        const listenerCount = this.eventEmitter.listeners(input.name).length;
        const startedAt = Date.now();
        const span = this.tracer.start('event_bus.publish', {
            'event.name': input.name,
            'event.listeners': listenerCount,
        });

        this.metrics.increment('event_bus_publish_total', {
            context: 'EventBusService',
            event: input.name,
        });

        try {
            await this.eventEmitter.emitAsync(input.name, input);

            this.metrics.increment('event_bus_publish_success_total', {
                context: 'EventBusService',
                event: input.name,
            });
        } catch (error) {
            this.metrics.increment('event_bus_publish_failure_total', {
                context: 'EventBusService',
                event: input.name,
            });

            this.logger.error({
                msg: 'Event handler failed',
                error: error instanceof Error ? error.message : String(error),
                event: input.name,
                listenerCount,
            }, error instanceof Error ? error.stack : undefined, 'EventBusService');

            throw error;
        } finally {
            this.metrics.observe('event_bus_publish_duration_ms', Date.now() - startedAt, {
                context: 'EventBusService',
                event: input.name,
            });
            span.end();
        }
    }

}
