import { emailBaseTemplate } from "@templates/base";

export const confirmPwdReset = (lang: string, translated: any, payload: any): string => {
    const content = `
        <p style="margin-top: 0;">${translated.greeting}</p>
        
        <p>${translated.warning}</p>

        <div style="padding: 16px 0;">
            <a href="${process.env.V1_FRONTEND_URL}" style="
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
    `;

    return emailBaseTemplate(translated.title, content, lang);
};