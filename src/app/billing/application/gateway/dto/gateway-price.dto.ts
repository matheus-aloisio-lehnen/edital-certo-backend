export type GatewayPrice = {
    id: string;
    active: boolean;
    product: string;        // product id
    unit_amount: number;    // em centavos
    recurring: {
        interval: "month" | "year"
    };
};
