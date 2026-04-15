export const eventBus = Symbol('EVENT_BUS');

export type EventInput = {
    name: string;
    payload: Record<string, unknown>;
}

export interface IEventBus {
    publish(input: EventInput): Promise<void>;
}