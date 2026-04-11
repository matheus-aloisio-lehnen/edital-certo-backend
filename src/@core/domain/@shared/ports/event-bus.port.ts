export type EventInput = {
    name: string;
    payload: Record<string, unknown>;
}

export interface IEventBus {
    publish(input: EventInput): Promise<void>;
}