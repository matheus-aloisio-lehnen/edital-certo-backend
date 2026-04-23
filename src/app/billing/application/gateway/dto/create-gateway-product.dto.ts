export type CreateGatewayProductDto = {
    active: boolean;
    name: string;
    tax_code?: string;
    statement_descriptor?: string;
    metadata?: Record<string, string>;
};
