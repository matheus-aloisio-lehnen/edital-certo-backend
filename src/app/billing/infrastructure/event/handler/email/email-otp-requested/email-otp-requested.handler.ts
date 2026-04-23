import { ConfigService } from "@nestjs/config";
import { OnEvent } from "@nestjs/event-emitter";
import { Inject, Injectable } from "@nestjs/common";

import { I18nService } from "nestjs-i18n";
import { emailPort, type IEmail } from "@shared/domain/port/email.port";
import { billingEmailOtpRequestedTemplate } from "@billing/infrastructure/transport/out/email/template/billing-email-otp-requested.template";
import { eventName } from "@shared/domain/constant/event.constant";
import { type EventInput } from "@shared/domain/port/event-bus.port";

@Injectable()
export class EmailOtpRequestedHandler {

    constructor(
        @Inject(emailPort) private readonly emailService: IEmail,
        private readonly i18n: I18nService,
        private readonly config: ConfigService
    ) {}

    @OnEvent(eventName.emailOtpRequested)
    async handle(input: EventInput): Promise<void> {
        const { to, langCode, ...payload } = input.payload as any;
        const lang = langCode || "pt";

        if (!to)
            throw new Error(`Missing recipient for event: ${input.name}`);

        const translated = this.i18n.t(`email.${input.name}`, { lang, args: payload }) as any;

        const frontendUrl = this.config.get("app.urls.v1FrontendUrl");
        const html = billingEmailOtpRequestedTemplate(lang, translated, payload, frontendUrl);

        await this.emailService.send({
            to: [{ email: to }],
            subject: translated.subject,
            html,
        });
    }

}
