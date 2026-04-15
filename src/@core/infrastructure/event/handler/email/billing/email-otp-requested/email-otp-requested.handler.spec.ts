import { Test, TestingModule } from '@nestjs/testing';
import { I18nService } from 'nestjs-i18n';
import { vi } from 'vitest';

import { EmailOtpRequestedHandler } from './email-otp-requested.handler';
import { Email } from "@transport/email/email.service";

describe('EmailOtpRequestedHandler', () => {
  let service: EmailOtpRequestedHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailOtpRequestedHandler,
        { provide: Email, useValue: { send: vi.fn() } },
        { provide: I18nService, useValue: { t: vi.fn() } },
      ],
    }).compile();

    service = module.get<EmailOtpRequestedHandler>(EmailOtpRequestedHandler);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
