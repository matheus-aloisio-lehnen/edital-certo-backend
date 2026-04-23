import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    ManyToOne, OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { PlanModel } from "@billing/infrastructure/persistence/database/postgres/typeorm/model/plan.model";
import { DiscountModel } from "@billing/infrastructure/persistence/database/postgres/typeorm/model/discount.model";
import { billingCycle, type BillingCycle } from "@billing/domain/price/constant/billing-cycle.constant";

@Entity("price")
@Index("pricePlanIdIndex", ["planId"])
@Index("priceBillingCycleIndex", ["billingCycle"])
@Index("pricePlanIdIsActiveIndex", ["planId", "isActive"])
@Index("priceUniqueActiveBillingCycle", ["planId", "billingCycle"], {
    unique: true,
    where: `"isActive" = true`,
})
export class PriceModel {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    planId!: number;

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

    @ManyToOne(() => PlanModel, (plan) => plan.prices)
    plan!: PlanModel;

    @OneToMany(() => DiscountModel, (discount) => discount.price, { cascade: true, eager: true, })
    discounts!: DiscountModel[];
}
