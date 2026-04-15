import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { PlanModel } from "@persistence/database/postgres/typeorm/model/product/plan.model";

@Entity("feature")
@Index("featurePlanIdIndex", ["planId"])
@Index("featurePlanIdKeyIndex", ["planId", "key"])
@Index("featurePlanIdIsActiveIndex", ["planId", "isActive"])
@Index("featureUniqueActiveKey", ["planId", "key"], {
    unique: true,
    where: `"isActive" = true`,
})
export class FeatureModel {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    planId!: number;

    @Column()
    key!: string;

    @Column()
    name!: string;

    @Column({ default: true })
    hidden!: boolean;

    @Column({ default: false })
    isActive!: boolean;

    @Column({ default: false })
    hasQuota!: boolean;

    @Column({ default: 0 })
    quota!: number;

    @Column({ nullable: true })
    quotaRenewalCycle!: string | null;

    @CreateDateColumn({ type: "timestamptz" })
    createdAt!: Date;

    @UpdateDateColumn({ type: "timestamptz" })
    updatedAt!: Date;

    @ManyToOne(() => PlanModel, (plan) => plan.features)
    plan!: PlanModel;
}