import { CreatePriceProps } from "@billing/domain/price/props/create-price.props";

export type CreateProductProps = {
    name: string;
    kind: string;
    externalProductId?: string | null;
    prices: CreatePriceProps[];
};
