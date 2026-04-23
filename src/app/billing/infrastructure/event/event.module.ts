import { Module } from "@nestjs/common";

import { EmailOtpRequestedHandler } from "@billing/infrastructure/event/handler/email/email-otp-requested/email-otp-requested.handler";
import { SharedTransportOutModule } from "@shared/infrastructure/transport/out/transport-out.module";

@Module({
    imports: [
        SharedTransportOutModule,
    ],
    providers: [
        EmailOtpRequestedHandler,
    ],
})
export class BillingEventModule {}
