import { Test, TestingModule } from '@nestjs/testing';
import { I18nService } from 'nestjs-i18n';
import { vi } from 'vitest';

import { PwdResetConfirmedHandler } from './pwd-reset-confirmed.handler';
import { Logger } from '@observability/logger/logger.service';
import { Email } from "@transport/email/email.service";

describe('PwdResetConfirmedHandler', () => {
  let service: PwdResetConfirmedHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PwdResetConfirmedHandler,
        { provide: Email, useValue: { send: vi.fn() } },
        { provide: I18nService, useValue: { t: vi.fn() } },
        { provide: Logger, useValue: { error: vi.fn() } },
      ],
    }).compile();

    service = module.get<PwdResetConfirmedHandler>(PwdResetConfirmedHandler);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
