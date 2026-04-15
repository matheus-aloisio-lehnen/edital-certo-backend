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
import { PriceModel } from "@persistence/database/postgres/typeorm/model/product/price.model";

@Entity("discount")
@Index("discountPriceIdIndex", ["priceId"])
@Index("discountUniqueActivePerPrice", ["priceId"], {
    unique: true,
    where: `"deletedAt" IS NULL`,
})
export class DiscountModel {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    @Index()
    priceId!: number;

    @Column({ unique: true })
    key!: string;

    @Column()
    name!: string;

    @Column()
    type!: string;

    @Column()
    value!: number;

    @Column()
    duration!: string;

    @Column({ nullable: true })
    count!: number | null;

    @Column({ type: "timestamptz" })
    campaignStartsAt!: Date;

    @Column({ type: "timestamptz" })
    campaignEndsAt!: Date;

    @Column({ nullable: true })
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







