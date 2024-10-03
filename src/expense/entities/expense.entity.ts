import { UserAddress } from "src/user-address/entities/user-address.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Expense {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: false })
    name: string;

    @Column({ nullable: false })
    isPaid: boolean;

    @Column({ nullable: false })
    isLate: boolean;

    @Column({ nullable: false })
    amount: number;

    @Column({ nullable: false })
    dueDate: Date;

    @Column({ nullable: false })
    category: string;  // Tipo de despesa (luz, água, aluguel)

    @Column({ nullable: false })
    frequency: string;  // Periodicidade (mensal, semanal, diária)

    @ManyToOne(() => UserAddress, userAddress => userAddress.expenses, { nullable: true })
    userAddress: UserAddress;

    @Column({ nullable: false })
    reminder: boolean;

    @CreateDateColumn()
    createdAt: Date;
}
