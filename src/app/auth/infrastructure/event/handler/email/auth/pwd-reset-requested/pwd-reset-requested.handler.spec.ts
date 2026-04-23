import { ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { I18nService } from "nestjs-i18n";
import { vi } from "vitest";

import { emailPort } from "@shared/domain/port/email.port";
import { PwdResetRequestedHandler } from "./pwd-reset-requested.handler";

describe('PwdResetRequestedHandler', () => {
  let service: PwdResetRequestedHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PwdResetRequestedHandler,
        { provide: emailPort, useValue: { send: vi.fn() } },
        { provide: I18nService, useValue: { t: vi.fn() } },
        { provide: ConfigService, useValue: { get: vi.fn() } },
      ],
    }).compile();

    service = module.get<PwdResetRequestedHandler>(PwdResetRequestedHandler);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
