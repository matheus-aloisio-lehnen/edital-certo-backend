import { ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { I18nService } from "nestjs-i18n";
import { vi } from "vitest";

import { emailPort } from "@shared/domain/port/email.port";
import { loggerPort } from "@shared/domain/port/logger.port";
import { PwdResetConfirmedHandler } from "./pwd-reset-confirmed.handler";

describe('PwdResetConfirmedHandler', () => {
  let service: PwdResetConfirmedHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PwdResetConfirmedHandler,
        { provide: emailPort, useValue: { send: vi.fn() } },
        { provide: I18nService, useValue: { t: vi.fn() } },
        { provide: ConfigService, useValue: { get: vi.fn() } },
        { provide: loggerPort, useValue: { error: vi.fn() } },
      ],
    }).compile();

    service = module.get<PwdResetConfirmedHandler>(PwdResetConfirmedHandler);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
