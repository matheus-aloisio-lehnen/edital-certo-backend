import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    ManyToOne, OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { PlanModel } from "@persistence/database/postgres/typeorm/model/product/plan.model";
import { DiscountModel } from "@persistence/database/postgres/typeorm/model/product/discount.model";

@Entity("price")
@Index("pricePlanIdIndex", ["planId"])
@Index("pricePlanIdKeyIndex", ["planId", "key"])
@Index("pricePlanIdIsActiveIndex", ["planId", "isActive"])
@Index("priceUniqueActiveKey", ["planId", "key"], {
    unique: true,
    where: `"isActive" = true`,
})
export class PriceModel {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    planId!: number;

    @Column()
    key!: string;

    @Column()
    currency!: string;

    @Column()
    billingCycle!: string;

    @Column()
    value!: number;

    @Column({ default: true })
    isActive!: boolean;

    @Column({ nullable: true })
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