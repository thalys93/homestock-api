import { Product } from "src/products/entities/product.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity("categories")
export class Category {
    @PrimaryGeneratedColumn('identity')
    id: number

    @Column({nullable: false, type: "text"})
    category_name: string

    @OneToMany(() => Product, product => product.category)
    products: Product[]
}
