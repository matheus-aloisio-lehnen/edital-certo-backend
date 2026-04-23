import { CreatePriceProps } from "@billing/domain/price/props/create-price.props";

export type CreatePlanProps = {
    name: string;
    externalProductId?: string | null;
    prices: CreatePriceProps[];
};
