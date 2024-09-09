import { Category } from "src/category/entities/category.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("products")
export class Product {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({ nullable: false, type: "text" })
    name: string

    @Column({ nullable: false, type: "int" })
    quantity: number;

    @Column({ nullable: false, type: "text" })
    image: string;

    @ManyToOne(() => Category, category => category.products, { nullable: false })
    category: Category;
}
