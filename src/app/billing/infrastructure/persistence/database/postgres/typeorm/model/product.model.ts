import { Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { PriceModel } from "@billing/infrastructure/persistence/database/postgres/typeorm/model/price.model";

@Entity("product")
@Index("productIsActiveIndex", ["isActive"])
@Index("productKindIndex", ["kind"], { unique: true })
@Index("productDeletedAtIndex", ["deletedAt"])
export class ProductModel {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column()
    kind!: string;

    @Column({ default: true })
    isActive!: boolean;

    @Column({ type: "varchar", nullable: true })
    externalProductId!: string | null;

    @CreateDateColumn({ type: "timestamptz" })
    createdAt!: Date;

    @UpdateDateColumn({ type: "timestamptz" })
    updatedAt!: Date;

    @Column({ type: "timestamptz", nullable: true })
    deletedAt!: Date | null;

    @OneToMany(() => PriceModel, (price) => price.product, { cascade: true, eager: true })
    prices!: PriceModel[];
}
