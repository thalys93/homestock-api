import { Product } from "src/product/entities/product.entity";
import { PrimaryGeneratedColumn, Column, OneToMany, Entity } from "typeorm";

@Entity()
export class Category {
    @PrimaryGeneratedColumn('identity')
    id: number;

    @Column({ nullable: false })
    name: string;

    @OneToMany(() => Product, product => product.category)
    products: Product[];
}
