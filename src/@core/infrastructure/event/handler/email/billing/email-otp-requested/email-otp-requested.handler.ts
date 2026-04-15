import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import type { EventInput } from '@domain/@shared/port/event-bus.port';

import { I18nService } from 'nestjs-i18n';

import { billingEmailOtpRequestedTemplate } from '@transport/email/template/billing-email-otp-requested.template';
import { eventName } from "@domain/@shared/constant/event.constant";
import { Email } from "@transport/email/email.service";

@Injectable()
export class EmailOtpRequestedHandler {

    constructor(
        private readonly emailService: Email,
        private readonly i18n: I18nService,
    ) {}

    @OnEvent(eventName.emailOtpRequested)
    async handle(input: EventInput): Promise<void> {
        const { to, langCode, ...payload } = input.payload as any;
        const lang = langCode || 'pt';

        if (!to)
            throw new Error(`Missing recipient for event: ${input.name}`);

        const translated = this.i18n.t(`email.${input.name}`, { lang, args: payload, }) as any;

        const html = billingEmailOtpRequestedTemplate(lang, translated, payload);

        await this.emailService.send({ to, subject: translated.subject, html });
    }

}
