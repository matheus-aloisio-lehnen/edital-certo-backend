export const emailPort = Symbol('EMAIL_PORT');

export type SendEmailInput = {
    to: string;
    subject: string;
    html: string;
};

export interface IEmail {
    send(input: SendEmailInput): Promise<void>;
}