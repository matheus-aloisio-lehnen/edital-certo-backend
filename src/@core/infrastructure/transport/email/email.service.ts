import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Mailjet, { Client } from 'node-mailjet';

import { AppConfig, appConfig } from '@cfg/app.config';
import { EventInput, IEventBus } from '@domain/@shared/ports/event-bus.port';

import { confirmPwdReset } from '@templates/confirm-pwd-reset';
import { confirmWinback } from '@templates/confirm-winback';
import { requestPwdReset } from '@templates/request-pwd-reset';
import { requestWinback } from '@templates/request-winback';
import { requestEmailOtp } from '@templates/request-email-otp'; // Adicionado
import { I18nService } from "nestjs-i18n";
import { Logger } from "@logger/logger.service";

@Injectable()
export class EmailService implements IEventBus {
    private readonly client: Client;
    private readonly from: string;

    private readonly emailTemplates = {
        requestPwdReset: {
            template: (lang: string, trans: any, payload: any) => requestPwdReset(lang, trans, payload),
        },
        confirmPwdReset: {
            template: (lang: string, trans: any, payload: any) => confirmPwdReset(lang, trans, payload),
        },
        requestWinback: {
            template: (lang: string, trans: any, payload: any) => requestWinback(lang, trans, payload),
        },
        confirmWinback: {
            template: (lang: string, trans: any, payload: any) => confirmWinback(lang, trans, payload),
        },
        requestEmailOtp: {
            template: (lang: string, trans: any, payload: any) => requestEmailOtp(lang, trans, payload),
        },
    };

    constructor(
        private readonly configService: ConfigService,
        private readonly logger: Logger,
        private readonly i18n: I18nService
    ) {
        const email = this.configService.get<AppConfig>(appConfig.KEY)?.email;

        if (!email?.apiKey || !email?.apiSecret || !email?.from)
            throw new Error('MailJet configuration keys not found');

        this.from = email.from;
        this.client = Mailjet.apiConnect(email.apiKey, email.apiSecret);
    }

    async publish(input: EventInput): Promise<void> {
        const { to, langCode, ...payload } = input.payload as any;
        const lang = langCode || 'pt';

        const event = this.emailTemplates[input.name];

        if (!event)
            return this.logger.error(`Email template not found for event: ${input.name}`, undefined, 'EmailService');

        const i18nKey = `email.${input.name}`;
        const translated = this.i18n.t(i18nKey, { lang, args: payload }) as any;
        const html = event.template(lang, translated, payload);

        const message = {
            From: { Email: this.from, Name: 'Edital Certo' },
            To: [{ Email: to }],
            Subject: translated.subject,
            HTMLPart: html,
        };

        try {
            await this.client
                .post('send', { version: 'v3.1' })
                .request({ Messages: [message] });
        } catch (err) {
            this.logger.error(`Failed to send email: ${input.name}`, err.stack, 'EmailService');
        }
    }

}