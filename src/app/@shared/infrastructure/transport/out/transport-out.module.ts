import { Module } from "@nestjs/common";

import { emailPort } from "@shared/domain/port/email.port";
import { queuePort } from "@shared/domain/port/queue.port";
import { ObservabilityModule } from "@shared/infrastructure/observability/observability.module";
import { MailtrapAdapter } from "@shared/infrastructure/transport/out/email/mailtrap/mailtrap.adapter";
import { HttpService } from "@shared/infrastructure/transport/out/http/axios/http.service";
import { RabbitmqAdapter } from "@shared/infrastructure/transport/out/queue/rabbitmq/rabbitmq.adapter";

@Module({
    imports: [
        ObservabilityModule,
    ],
    providers: [
        HttpService,
        MailtrapAdapter,
        RabbitmqAdapter,
        { provide: emailPort, useExisting: MailtrapAdapter },
        { provide: queuePort, useExisting: RabbitmqAdapter },
    ],
    exports: [
        emailPort,
        queuePort,
    ],
})
export class SharedTransportOutModule {}
