import {
    BeforeInsert,
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    Unique,
    UpdateDateColumn,
} from "typeorm";
import { Exclude } from "class-transformer";
import { hashSync } from "bcrypt";
import { Role } from "src/roles/entities/role.entity";

@Entity("users")
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ nullable: false, type: "text" })
    name: string

    @Column({ nullable: false, type: "text" })
    lastname: string

    @Column({ nullable: false, type: "text" })
    @Unique(["email"])
    email: string

    @Column({ nullable: true, type: "text" })
    avatar: string

    @Column({ nullable: false, type: "text" })
    @Exclude()
    password: string

    @Column({ nullable: true, type: "text" })
    @Exclude()
    recoverToken: string;

    @ManyToOne(() => Role, role => role.Users, { nullable: false })
    role: Role

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;
    
    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;

    @BeforeInsert()
    hasPassword?() {
        this.password = hashSync(this.password, 10);
    }

    constructor(user?: Partial<User>) {
        this.id = user?.id
        this.name = user?.name
        this.lastname = user?.lastname
        this.email = user?.email
        this.avatar = user?.avatar
        this.password = user?.password
        this.recoverToken = user?.recoverToken
        this.role = user?.role
        this.createdAt = user?.createdAt
        this.updatedAt = user?.updatedAt
    }
}
