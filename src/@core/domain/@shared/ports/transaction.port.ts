export type TransactionContext = {
    tx: unknown;
};

export interface ITransaction {
    begin(): Promise<TransactionContext>;
    commit(ctx: TransactionContext): Promise<void>;
    rollback(ctx: TransactionContext): Promise<void>;
}
