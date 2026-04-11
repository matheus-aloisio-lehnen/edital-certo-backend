import { Span } from "@opentelemetry/api";

export type TraceAttributes = Record<string, string | number | boolean>;

export interface ITracer {
    start(name: string, attributes?: TraceAttributes): Span;
}
