import { Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { PriceModel } from "@billing/infrastructure/persistence/database/postgres/typeorm/model/price.model";

@Entity("plan")
@Index("planIsActiveIndex", ["isActive"])
export class PlanModel {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column({ default: true })
    isActive!: boolean;

    @Column({ type: "varchar", nullable: true })
    externalPlanId!: string | null;

    @CreateDateColumn({ type: "timestamptz" })
    createdAt!: Date;

    @UpdateDateColumn({ type: "timestamptz" })
    updatedAt!: Date;

    @OneToMany(() => PriceModel, (price) => price.plan, { cascade: true, eager: true })
    prices!: PriceModel[];
}
