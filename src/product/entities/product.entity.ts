import { Category } from "src/category/entities/category.entity";
import { UserAddress } from "src/user-address/entities/user-address.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column({ nullable: false })
    name: string

    @Column({ nullable: false })
    quantity: number

    @Column({ nullable: false })
    imageUrl: string

    @Column({ nullable: false })
    min_price: number

    @Column({ nullable: false })
    max_price: number

    @Column({ nullable: false })
    measure_unit: string

    @ManyToOne(() => Category, category => category.products, { nullable: true })
    @JoinColumn({name: "category_id"})
    category: Category   

    @ManyToOne(() => UserAddress, userAddress => userAddress.products, { nullable: false })
    @JoinColumn({name: "user_address_id"})
    userAddress: UserAddress
}
