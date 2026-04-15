import { emailBaseTemplate } from "@transport/email/template/base.template";

export const billingEmailOtpRequestedTemplate = (lang: string, translated: any, payload: any): string => {
    const url = `${process.env.V1_FRONTEND_URL}`;

    const content = `
        <p style="margin-top: 0;">${translated.greeting}</p>
        
        <p>${translated.instruction}</p>

        <div style="padding: 16px 0;">
            <div style="
                display: inline-block;
                font-size: 32px;
                letter-spacing: 8px;
                font-weight: 800;
                color: #0058c9;
                background: #ffffff;
                padding: 12px 24px;
                border-radius: 12px;
                border: 1px solid #c1c6d7;
            ">
                ${payload.otpCode}
            </div>
        </div>

        <p style="font-size: 14px; color: #44474f;">
            ${translated.footer}
        </p>

        <div style="padding: 16px 0;">
            <a href="${url}" style="
                background-color: #0058c9;
                color: #ffffff !important;
                text-decoration: none;
                padding: 10px 24px;
                border-radius: 100px;
                font-weight: 600;
                display: inline-block;
                font-size: 14px;
                line-height: 20px;
            ">
                ${translated.cta}
            </a>
        </div>

        <p style="font-size: 13px; color: #757780; margin-top: 16px; margin-bottom: 0;">
            ${translated.warning}
        </p>
    `;

    return emailBaseTemplate(translated.title, content, lang);
};