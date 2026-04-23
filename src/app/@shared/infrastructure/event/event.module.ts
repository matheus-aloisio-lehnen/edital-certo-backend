import { Module } from "@nestjs/common";

import { eventBusPort } from "@shared/domain/port/event-bus.port";
import { ObservabilityModule } from "@shared/infrastructure/observability/observability.module";
import { EventBusService } from "@shared/infrastructure/event/bus/event-bus.service";

@Module({
    imports: [
        ObservabilityModule,
    ],
    providers: [
        EventBusService,
        { provide: eventBusPort, useExisting: EventBusService },
    ],
    exports: [
        eventBusPort,
    ],
})
export class EventModule {}
