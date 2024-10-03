import { User } from "src/user/entities/user.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity("roles")
export class Role {
    @PrimaryGeneratedColumn('identity')
    id: number

    @Column({ nullable: false, type: "text" })
    name: string

    @OneToMany(() => User, user => user.role)
    Users: User[]
}
