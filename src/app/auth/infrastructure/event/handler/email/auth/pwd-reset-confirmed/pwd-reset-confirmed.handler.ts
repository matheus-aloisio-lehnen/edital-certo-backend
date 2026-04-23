import { ConfigService } from "@nestjs/config";
import { Inject, Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { I18nService } from "nestjs-i18n";

import { emailPort, type IEmail } from "@shared/domain/port/email.port";
import { type ILogger, loggerPort } from "@shared/domain/port/logger.port";
import { eventName } from "@shared/domain/constant/event.constant";
import { type EventInput } from "@shared/domain/port/event-bus.port";
import { authPwdResetConfirmedTemplate } from "@auth/infrastructure/transport/out/email/template/auth-pwd-reset-confirmed.template";

@Injectable()
export class PwdResetConfirmedHandler {

    constructor(
        @Inject(emailPort) private readonly email: IEmail,
        @Inject(loggerPort) private readonly logger: ILogger,
        private readonly i18n: I18nService,
        private readonly config: ConfigService,
    ) {
    }

    @OnEvent(eventName.pwdResetConfirmed)
    async handle(input: EventInput): Promise<void> {
        const { to, langCode, ...payload } = input.payload as any;
        const lang = langCode || 'pt';

        if (!to)
            return this.logger.error(`Missing recipient for event: ${input.name}`, undefined, eventName.pwdResetConfirmed);

        const translated = this.i18n.t(`email.${input.name}`, { lang, args: payload, }) as any;
        const frontendUrl = this.config.get('app.urls.v1FrontendUrl');

        const html = authPwdResetConfirmedTemplate(lang, translated, payload, frontendUrl);

        await this.email.send({ to, subject: translated.subject, html });
    }

}
