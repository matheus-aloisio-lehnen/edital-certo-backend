import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import type { EventInput } from '@domain/@shared/port/event-bus.port';

import { I18nService } from 'nestjs-i18n';

import { authWinbackRequestedTemplate } from '@transport/email/template/auth-winback-requested.template';
import { Email } from "@transport/email/email.service";
import { eventName } from "@domain/@shared/constant/event.constant";

@Injectable()
export class WinbackRequestedHandler {

    constructor(
        private readonly email: Email,
        private readonly i18n: I18nService,
    ) {}

    @OnEvent(eventName.winbackRequested)
    async handle(input: EventInput): Promise<void> {
        const { to, langCode, ...payload } = input.payload as any;
        const lang = langCode || 'pt';

        if (!to)
            throw new Error(`Missing recipient for event: ${input.name}`);

        const translated = this.i18n.t(`email.${input.name}`, { lang, args: payload, }) as any;

        const html = authWinbackRequestedTemplate(lang, translated, payload);

        await this.email.send({ to, subject: translated.subject, html });
    }

}
