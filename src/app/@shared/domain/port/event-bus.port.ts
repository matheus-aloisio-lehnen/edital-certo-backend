export const eventBusPort = Symbol("EVENT_BUS_PORT");

export type EventInput = {
    name: string;
    payload: Record<string, unknown>;
};

export interface IEventBus {
    publish(input: EventInput): Promise<void>;
}
