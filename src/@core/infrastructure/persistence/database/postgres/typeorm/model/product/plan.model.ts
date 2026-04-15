import { Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { FeatureModel } from "@persistence/database/postgres/typeorm/model/product/feature.model";
import { PriceModel } from "@persistence/database/postgres/typeorm/model/product/price.model";

@Entity("plan")
@Index("planKeyIndex", ["key"])
@Index("planIsActiveIndex", ["isActive"])
@Index("planUniqueActiveKey", ["key"], { unique: true, where: `"isActive" = true` })
export class PlanModel {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    key!: string;

    @Column()
    name!: string;

    @Column({ default: true })
    isActive!: boolean;

    @Column({ nullable: true })
    externalPlanId!: string | null;

    @CreateDateColumn({ type: "timestamptz" })
    createdAt!: Date;

    @UpdateDateColumn({ type: "timestamptz" })
    updatedAt!: Date;

    @OneToMany(() => FeatureModel, (feature) => feature.plan, { cascade: true, eager: true })
    features!: FeatureModel[];

    @OneToMany(() => PriceModel, (price) => price.plan, { cascade: true, eager: true })
    prices!: PriceModel[];
}