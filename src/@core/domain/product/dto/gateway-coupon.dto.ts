// discount response from stripe
export type GatewayCoupon = {
    id: string;
    percent_off: number | null;
    amount_off: number | null;
    currency: "brl" | "usd" | "eur" | null;
};