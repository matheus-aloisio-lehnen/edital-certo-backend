import { ConfigService } from '@nestjs/config';
import { I18nService } from 'nestjs-i18n';
import Mailjet from 'node-mailjet';
import { EmailService } from './email.service';
import { Logger } from '@logger/logger.service';
import { MockConfigService } from "@mock/tests.mock";

vi.mock('node-mailjet', () => ({
    default: {
        apiConnect: vi.fn(),
    },
}));

vi.mock('@templates/request-pwd-reset', () => ({
    requestPwdReset: vi.fn(() => '<p>request-pwd-reset</p>'),
}));

vi.mock('@templates/confirm-pwd-reset', () => ({
    confirmPwdReset: vi.fn(() => '<p>confirm-pwd-reset</p>'),
}));

describe('EmailService', () => {
    const requestMock = vi.fn().mockResolvedValue({ body: {} });
    const postMock = vi.fn(() => ({ request: requestMock }));
    const apiConnectMock = vi.mocked(Mailjet.apiConnect);

    const loggerMock = {
        error: vi.fn(),
        log: vi.fn(),
    } as unknown as Logger;

    const i18nMock = {
        t: vi.fn().mockReturnValue({
            subject: 'Assunto do I18n',
            greeting: 'Olá Matheus',
        }),
    } as unknown as I18nService;

    // Usando o Mock Global
    const configService = MockConfigService as unknown as ConfigService;

    let service: EmailService;

    beforeEach(() => {
        vi.clearAllMocks();

        apiConnectMock.mockReturnValue({
            post: postMock,
        } as any);

        service = new EmailService(configService, loggerMock, i18nMock);
    });

    it('should connect Mailjet with config credentials', () => {
        expect(apiConnectMock).toHaveBeenCalledWith('api-key', 'api-secret');
    });

    it('should send request password reset email with i18n subject', async () => {
        await service.publish({
            name: 'requestPwdReset',
            payload: {
                to: 'user@mail.com',
                userName: 'Matheus',
                hash: 'abc123',
            },
        });

        expect(postMock).toHaveBeenCalledWith('send', { version: 'v3.1' });
        expect(requestMock).toHaveBeenCalledWith({
            Messages: [
                {
                    From: {
                        Email: 'noreply@editalcerto.com',
                        Name: 'Edital Certo',
                    },
                    To: [{ Email: 'user@mail.com' }],
                    Subject: 'Assunto do I18n',
                    HTMLPart: '<p>request-pwd-reset</p>',
                },
            ],
        });
    });

    it('should log error when template is not found', async () => {
        await service.publish({
            name: 'nonExistentEvent' as any,
            payload: { to: 'test@test.com' },
        });

        expect(loggerMock.error).toHaveBeenCalledWith(
            expect.stringContaining('Email template not found'),
            undefined,
            'EmailService'
        );
    });

    it('should throw when email config is missing', () => {
        vi.mocked(configService.get).mockReturnValueOnce({
            email: { apiKey: '', apiSecret: '', from: '' }
        });

        expect(() => new EmailService(configService, loggerMock, i18nMock)).toThrow(
            'MailJet configuration keys not found',
        );
    });
});