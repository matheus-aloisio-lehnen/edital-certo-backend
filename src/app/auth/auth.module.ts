import { Module } from "@nestjs/common";

import { ObservabilityModule } from "@shared/infrastructure/observability/observability.module";
import { SharedTransportOutModule } from "@shared/infrastructure/transport/out/transport-out.module";
import { PwdResetConfirmedHandler } from "@auth/infrastructure/event/handler/email/auth/pwd-reset-confirmed/pwd-reset-confirmed.handler";
import { PwdResetRequestedHandler } from "@auth/infrastructure/event/handler/email/auth/pwd-reset-requested/pwd-reset-requested.handler";
import { WinbackConfirmedHandler } from "@auth/infrastructure/event/handler/email/auth/winback-confirmed/winback-confirmed.handler";
import { WinbackRequestedHandler } from "@auth/infrastructure/event/handler/email/auth/winback-requested/winback-requested.handler";

@Module({
    imports: [
        ObservabilityModule,
        SharedTransportOutModule,
    ],
    providers: [
        PwdResetConfirmedHandler,
        PwdResetRequestedHandler,
        WinbackConfirmedHandler,
        WinbackRequestedHandler,
    ],
})
export class AuthModule {}
