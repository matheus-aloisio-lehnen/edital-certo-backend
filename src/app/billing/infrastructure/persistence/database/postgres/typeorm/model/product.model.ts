import { Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { PriceModel } from "@billing/infrastructure/persistence/database/postgres/typeorm/model/price.model";

@Entity("product")
@Index("productIsActiveIndex", ["isActive"])
export class ProductModel {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column({ default: true })
    isActive!: boolean;

    @Column({ type: "varchar", nullable: true })
    externalProductId!: string | null;

    @CreateDateColumn({ type: "timestamptz" })
    createdAt!: Date;

    @UpdateDateColumn({ type: "timestamptz" })
    updatedAt!: Date;

    @OneToMany(() => PriceModel, (price) => price.product, { cascade: true, eager: true })
    prices!: PriceModel[];
}
