import { User } from "src/users/entities/user.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity("Roles")
export class Role {
    @PrimaryGeneratedColumn('identity')
    id: number

    @Column({ nullable: false, type: "text" })
    role_name: string

    @OneToMany(() => User, user => user.role)
    Users: User[]
}
