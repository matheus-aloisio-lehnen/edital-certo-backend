import { emailBaseTemplate } from "@shared/infrastructure/transport/out/email/template/base.template";

export const authWinbackRequestedTemplate = (lang: string, translated: any, payload: any, frontendUrl: string): string => {
    const url = `${frontendUrl}/confirmar-reativacao?h=${payload.hash}`;

    const content = `
        <p style="margin-top: 0;">${translated.greeting}</p>
        
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
            </div>
        
        <p style="font-size: 14px; color: #757780; margin-top: 16px;">
            ${translated.warning}
        </p>
        
        <p style="font-size: 14px; color: #757780; margin-bottom: 0;">
            ${translated.support}
        </p>
    `;

    return emailBaseTemplate(translated.title, content, lang, frontendUrl);
};
