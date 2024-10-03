import { Address } from "src/address/entities/address.entity";
import { Expense } from "src/expense/entities/expense.entity";
import { Product } from "src/product/entities/product.entity";
import { User } from "src/user/entities/user.entity";
import {
    Column,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn
} from "typeorm";

@Entity()
export class UserAddress {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ nullable: false })
    nickname: string

    // * relações
    @ManyToOne(() => User, user => user.addresses, { nullable: true })
    @JoinColumn({name: "user_id"})
    user: User

    @ManyToOne(() => Address, { nullable: false })
    @JoinColumn({name: "address_id"})    
    address: Address

    @OneToMany(() => Expense, expense => expense.userAddress)
    @JoinTable({name: "user_address_expense"})
    expenses: Expense[]

    @OneToMany(() => Product, product => product.userAddress)
    @JoinTable({name: "user_address_product"})
    products: Product[]
}
