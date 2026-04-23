import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    ManyToOne,
    JoinColumn,
    Index,
} from "typeorm";
import { discountDuration, discountType, type DiscountDuration, type DiscountType } from "@billing/domain/discount/constant/discount.constant";
import { PriceModel } from "@billing/infrastructure/persistence/database/postgres/typeorm/model/price.model";

@Entity("discount")
@Index("discountPriceIdIndex", ["priceId"])
export class DiscountModel {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    priceId!: number;

    @Column()
    name!: string;

    @Column({ type: "enum", enum: discountType })
    type!: DiscountType;

    @Column()
    value!: number;

    @Column({ type: "enum", enum: discountDuration })
    duration!: DiscountDuration;

    @Column({ type: "int", nullable: true })
    count!: number | null;

    @Column({ type: "timestamptz" })
    campaignStartsAt!: Date;

    @Column({ type: "timestamptz" })
    campaignEndsAt!: Date;

    @Column({ type: "varchar", nullable: true })
    externalDiscountId!: string | null;

    @CreateDateColumn({ type: "timestamptz" })
    createdAt!: Date;

    @UpdateDateColumn({ type: "timestamptz" })
    updatedAt!: Date | null;

    @DeleteDateColumn({ type: "timestamptz", nullable: true })
    deletedAt!: Date | null;

    @ManyToOne(() => PriceModel, (price) => price.discounts)
    @JoinColumn({ name: "priceId" })
    price!: PriceModel;
}
