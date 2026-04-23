export const queuePort = Symbol('QUEUE_PORT');

export interface IQueue {
    publish(input: QueueInput): Promise<void>;
}

export type QueueInput = {
    name: string;
    payload: Record<string, any>;
};