export type CreateGatewayProductDto = {
    active: boolean;
    name: string;
    tax_code?: string | null;
    statement_descriptor?: string | null;
    metadata?: Record<string, string>;
};
