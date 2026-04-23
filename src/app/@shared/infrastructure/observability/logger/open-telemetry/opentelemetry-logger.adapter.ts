import { ConsoleLogger, Injectable, OnModuleDestroy } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { SeverityNumber } from "@opentelemetry/api-logs";
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http";
import { BatchLogRecordProcessor, LoggerProvider } from "@opentelemetry/sdk-logs";

import { AppConfig, appConfig } from "@root/app.config";
import { type ILogger, type LogInput } from "@shared/domain/port/logger.port";

@Injectable()
export class OpenTelemetryLogger extends ConsoleLogger implements ILogger, OnModuleDestroy {

    private readonly loggerProvider: LoggerProvider;
    private readonly otelLogger: any;

    constructor(
        private readonly configService: ConfigService,
    ) {
        super("Logger", { json: true });
        const exporter = new OTLPLogExporter();
        const processor = new BatchLogRecordProcessor(exporter);

        this.loggerProvider = new LoggerProvider({ processors: [ processor ], });
        this.otelLogger = this.loggerProvider.getLogger("backend");
    }

    write(input: LogInput): void {
        const { level, message, context } = input;
        if (!context)
            return this[level](message);
        this[level](message, context);
    }

    log(message: unknown, context?: string): void {
        if (!this.isEnabled())
            return;

        super.log(message, context);
        this.export("log", message, context);
    }

    warn(message: unknown, context?: string): void {
        if (!this.isEnabled())
            return;

        super.warn(message, context);
        this.export("warn", message, context);
    }

    debug(message: unknown, context?: string): void {
        if (!this.isEnabled())
            return;

        super.debug(message, context);
        this.export("debug", message, context);
    }

    verbose(message: unknown, context?: string): void {
        if (!this.isEnabled())
            return;

        super.verbose(message, context);
        this.export("verbose", message, context);
    }

    error(message: unknown, stackOrContext?: string, context?: string): void {
        if (!this.isEnabled())
            return;

        super.error(message, stackOrContext, context);
        this.export("error", message, this.getErrorContext(stackOrContext, context), this.getErrorStack(stackOrContext, context));
    }

    private isEnabled(): boolean {
        return this.configService.get<AppConfig>(appConfig.KEY)?.observability.logs === true;
    }

    private export(level: LogInput["level"], message: unknown, context?: string, stack?: string): void {
        const severity: Record<LogInput["level"], SeverityNumber> = {
            log: SeverityNumber.INFO,
            warn: SeverityNumber.WARN,
            error: SeverityNumber.ERROR,
            debug: SeverityNumber.DEBUG,
            verbose: SeverityNumber.TRACE,
        };

        this.otelLogger.emit({
            severityNumber: severity[level],
            severityText: level.toUpperCase(),
            body: this.toBody(message),
            attributes: this.toAttributes(context, stack),
        });
    }


    private toBody(message: unknown): any {
        if (typeof message === "string")
            return { msg: message };

        if (typeof message === "object" && message !== null)
            return message as any;

        return { value: String(message) };
    }

    private toAttributes(context?: string, stack?: string): any {
        const attributes: Record<string, string> = {};

        if (context)
            attributes.context = context;

        if (stack)
            attributes.stack = stack;

        if (Object.keys(attributes).isEmpty())
            return undefined;

        return attributes;
    }

    private getErrorContext(stackOrContext?: string, context?: string): string | undefined {
        if (context)
            return context;

        if (this.isStackTrace(stackOrContext))
            return undefined;

        return stackOrContext;
    }

    private getErrorStack(stackOrContext?: string, context?: string): string | undefined {
        if (context)
            return stackOrContext;

        if (this.isStackTrace(stackOrContext))
            return stackOrContext;

        return undefined;
    }

    private isStackTrace(value?: string): boolean {
        const stackTrace = /^\s*at\s/m;

        if (!value)
            return false;

        return stackTrace.test(value);
    }

    async onModuleDestroy(): Promise<void> {
        await this.loggerProvider.shutdown();
    }

}
