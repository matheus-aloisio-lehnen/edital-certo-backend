export const emailPort = Symbol('EMAIL_PORT');

export type ToEmail = {
    email: string;
};

export type SendEmailInput = {
    to: ToEmail[];
    subject: string;
    html: string;
};

export type SendEmailDto = SendEmailInput & {
    from: {
        email: string;
        name: string;
    };
};

export interface IEmail {
    send(input: SendEmailInput): Promise<void>;
}