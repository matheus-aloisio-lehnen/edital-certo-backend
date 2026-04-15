import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { I18nService } from 'nestjs-i18n';
import { Logger } from '@observability/logger/logger.service';
import { authPwdResetConfirmedTemplate } from '@transport/email/template/auth-pwd-reset-confirmed.template';
import { Email } from "@transport/email/email.service";
import { eventName } from "@domain/@shared/constant/event.constant";
import type { EventInput } from "@domain/@shared/port/event-bus.port";

@Injectable()
export class PwdResetConfirmedHandler {

    constructor(
        private readonly email: Email,
        private readonly i18n: I18nService,
        private readonly logger: Logger,
    ) {
    }

    @OnEvent(eventName.pwdResetConfirmed)
    async handle(input: EventInput): Promise<void> {
        const { to, langCode, ...payload } = input.payload as any;
        const lang = langCode || 'pt';

        if (!to)
            return this.logger.error(`Missing recipient for event: ${input.name}`, undefined, eventName.pwdResetConfirmed);

        const translated = this.i18n.t(`email.${input.name}`, { lang, args: payload, }) as any;

        const html = authPwdResetConfirmedTemplate(lang, translated, payload);

        await this.email.send({ to, subject: translated.subject, html });
    }

}