import { Test, TestingModule } from '@nestjs/testing';
import { I18nService } from 'nestjs-i18n';
import { vi } from 'vitest';

import { WinbackRequestedHandler } from './winback-requested.handler';
import { Email } from "@transport/email/email.service";

describe('WinbackRequestedHandler', () => {
  let service: WinbackRequestedHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WinbackRequestedHandler,
        { provide: Email, useValue: { send: vi.fn() } },
        { provide: I18nService, useValue: { t: vi.fn() } },
      ],
    }).compile();

    service = module.get<WinbackRequestedHandler>(WinbackRequestedHandler);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
