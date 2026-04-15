import { Module } from '@nestjs/common';
import { EventBusService } from "@event/bus/event-bus.service";
import { WinbackRequestedHandler } from "@event/handler/email/auth/winback-requested/winback-requested.handler";
import { WinbackConfirmedHandler } from "@event/handler/email/auth/winback-confirmed/winback-confirmed.handler";
import { PwdResetRequestedHandler } from "@event/handler/email/auth/pwd-reset-requested/pwd-reset-requested.handler";
import { PwdResetConfirmedHandler } from "@event/handler/email/auth/pwd-reset-confirmed/pwd-reset-confirmed.handler";
import { EmailOtpRequestedHandler } from "@event/handler/email/billing/email-otp-requested/email-otp-requested.handler";
import { eventBus } from "@domain/@shared/port/event-bus.port";

@Module({
    providers: [
        PwdResetConfirmedHandler,
        PwdResetRequestedHandler,
        WinbackRequestedHandler,
        WinbackConfirmedHandler,
        EmailOtpRequestedHandler,
        EventBusService,
        { provide: eventBus, useExisting: EventBusService },
    ],
    exports: [eventBus],
})
export class EventModule {}
