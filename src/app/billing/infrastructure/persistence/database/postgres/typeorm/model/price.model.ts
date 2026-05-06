import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { ProductModel } from "@billing/infrastructure/persistence/database/postgres/typeorm/model/product.model";
import { billingCycle, type BillingCycle } from "@billing/domain/price/constant/billing-cycle.constant";
import { billingType, type BillingType } from "@billing/domain/price/constant/billing-type.constant";
import { DiscountModel } from "@billing/infrastructure/persistence/database/postgres/typeorm/model/discount.model";

@Entity("price")
@Index("priceProductIdIndex", ["productId"])
@Index("priceCycleIndex", ["cycle"])
@Index("priceIsActiveIndex", ["isActive"])
@Index("priceDeletedAtIndex", ["deletedAt"])
@Index("priceUniqueProductCycleVersion", ["productId", "cycle", "version"], {
    unique: true,
})
export class PriceModel {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    productId!: number;

    @Column({ type: "enum", enum: billingCycle })
    cycle!: BillingCycle;

    @Column({ type: "enum", enum: billingType })
    type!: BillingType;

    @Column()
    value!: number;

    @Column({ default: 1 })
    version!: number;

    @Column({ default: true })
    isActive!: boolean;

    @Column({ type: "varchar", nullable: true })
    externalPriceId!: string | null;

    @ManyToOne(() => ProductModel, (product) => product.prices)
    @JoinColumn({ name: "productId" })
    product!: ProductModel;

    @OneToMany(() => DiscountModel, (discount) => discount.price, { cascade: true, eager: true })
    discounts!: DiscountModel[];

    @CreateDateColumn({ type: "timestamptz" })
    createdAt!: Date;

    @UpdateDateColumn({ type: "timestamptz" })
    updatedAt!: Date;

    @Column({ type: "timestamptz", nullable: true })
    deletedAt!: Date | null;
}
