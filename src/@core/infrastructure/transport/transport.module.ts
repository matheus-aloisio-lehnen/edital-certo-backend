import { Module } from '@nestjs/common';
import { Rabbitmq } from "@transport/rabbitmq/rabbitmq.service";
import { Email } from "@transport/email/email.service";
import { emailPort } from "@domain/@shared/port/email.port";
import { queuePort } from "@domain/@shared/port/queue.port";
import { ProductModule } from "@transport/http/product/product.module";

@Module({
    imports: [
        ProductModule,
    ],
    providers: [
        Email,
        Rabbitmq,
        { provide: emailPort, useExisting: Email },
        { provide: queuePort, useExisting: Rabbitmq }
    ],
    exports: [ emailPort, queuePort ]
})
export class TransportModule {
}
