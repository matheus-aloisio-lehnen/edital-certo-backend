import { Test, TestingModule } from '@nestjs/testing';
import { I18nService } from 'nestjs-i18n';
import { vi } from 'vitest';

import { WinbackConfirmedHandler } from './winback-confirmed.handler';
import { Email } from "@transport/email/email.service";

describe('WinbackConfirmedHandler', () => {
  let service: WinbackConfirmedHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WinbackConfirmedHandler,
        { provide: Email, useValue: { send: vi.fn() } },
        { provide: I18nService, useValue: { t: vi.fn() } },
      ],
    }).compile();

    service = module.get<WinbackConfirmedHandler>(WinbackConfirmedHandler);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
