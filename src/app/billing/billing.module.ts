import { Module } from "@nestjs/common";

import { BillingEventModule } from "@billing/infrastructure/event/event.module";
import { BillingPersistenceModule } from "@billing/infrastructure/persistence/persistence.module";
import { BillingTransportInModule } from "@billing/infrastructure/transport/in/transport-in.module";
import { BillingTransportOutModule } from "@billing/infrastructure/transport/out/transport-out.module";

@Module({
    imports: [
        BillingPersistenceModule,
        BillingTransportOutModule,
        BillingTransportInModule,
        BillingEventModule,
    ],
})
export class BillingModule {}
