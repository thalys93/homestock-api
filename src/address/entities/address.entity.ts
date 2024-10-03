import { UserAddress } from "src/user-address/entities/user-address.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Address {
    @PrimaryGeneratedColumn('uuid')
    id: string;    

    @Column({ nullable: false })
    zipCode: string;

    @Column({ nullable: false })
    number: string;

    @Column({ nullable: false })
    neighborhood: string;

    @Column({ nullable: false })
    street: string;

    @Column({ nullable: false })
    city: string;

    @Column({ nullable: false })
    state: string;

    @Column({ nullable: true })
    complement: string;
}
