import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    ManyToOne, OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { ProductModel } from "@billing/infrastructure/persistence/database/postgres/typeorm/model/product.model";
import { DiscountModel } from "@billing/infrastructure/persistence/database/postgres/typeorm/model/discount.model";
import { billingCycle, type BillingCycle } from "@billing/domain/price/constant/billing-cycle.constant";

@Entity("price")
@Index("priceProductIdIndex", ["productId"])
@Index("priceBillingCycleIndex", ["billingCycle"])
@Index("priceProductIdIsActiveIndex", ["productId", "isActive"])
@Index("priceUniqueActiveBillingCycle", ["productId", "billingCycle"], {
    unique: true,
    where: `"isActive" = true`,
})
export class PriceModel {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    productId!: number;

    @Column({ type: "enum", enum: billingCycle })
    billingCycle!: BillingCycle;

    @Column()
    value!: number;

    @Column({ default: true })
    isActive!: boolean;

    @Column({ type: "varchar", nullable: true })
    externalPriceId!: string | null;

    @CreateDateColumn({ type: "timestamptz" })
    createdAt!: Date;

    @UpdateDateColumn({ type: "timestamptz" })
    updatedAt!: Date;

    @ManyToOne(() => ProductModel, (product) => product.prices)
    product!: ProductModel;

    @OneToMany(() => DiscountModel, (discount) => discount.price, { cascade: true, eager: true, })
    discounts!: DiscountModel[];
}
