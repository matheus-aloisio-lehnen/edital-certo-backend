import { ConfigService } from "@nestjs/config";
import { Inject, Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { I18nService } from "nestjs-i18n";

import { authPwdResetRequestedTemplate } from "@auth/infrastructure/transport/out/email/template/auth-pwd-reset-requested.template";
import { eventName } from "@shared/domain/constant/event.constant";
import { emailPort, type IEmail } from "@shared/domain/port/email.port";
import { type EventInput } from "@shared/domain/port/event-bus.port";

@Injectable()
export class PwdResetRequestedHandler {

    constructor(
        @Inject(emailPort) private readonly email: IEmail,
        private readonly i18n: I18nService,
        private readonly config: ConfigService,
    ) {
    }

    @OnEvent(eventName.pwdResetRequested)
    async handle(input: EventInput): Promise<void> {
        const { to, langCode, ...payload } = input.payload as any;
        const lang = langCode || 'pt';

        if (!to)
            throw new Error(`Missing recipient for event: ${input.name}`);

        const translated = this.i18n.t(`email.${input.name}`, { lang, args: payload, }) as any;
        const frontendUrl = this.config.get('app.urls.v1FrontendUrl');

        const html = authPwdResetRequestedTemplate(lang, translated, payload, frontendUrl);

        await this.email.send({ to, subject: translated.subject, html });
    }

}
