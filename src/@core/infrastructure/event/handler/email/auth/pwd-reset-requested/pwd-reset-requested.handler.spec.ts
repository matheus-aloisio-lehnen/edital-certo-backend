import { Test, TestingModule } from '@nestjs/testing';
import { I18nService } from 'nestjs-i18n';
import { vi } from 'vitest';

import { PwdResetRequestedHandler } from './pwd-reset-requested.handler';
import { Email } from "@transport/email/email.service";

describe('PwdResetRequestedHandler', () => {
  let service: PwdResetRequestedHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PwdResetRequestedHandler,
        { provide: Email, useValue: { send: vi.fn() } },
        { provide: I18nService, useValue: { t: vi.fn() } },
      ],
    }).compile();

    service = module.get<PwdResetRequestedHandler>(PwdResetRequestedHandler);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
