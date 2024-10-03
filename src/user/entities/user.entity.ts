
import {
    BeforeInsert,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    Unique,
    UpdateDateColumn,
} from "typeorm";
import { Exclude } from "class-transformer";
import { hashSync } from "bcrypt";
import { Role } from "src/roles/entities/role.entity";
import { UserProfile } from "src/user-profile/entities/user-profile.entity";
import { UserAddress } from "src/user-address/entities/user-address.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ nullable: false, type: "text" })
    firstName: string

    @Column({ nullable: false, type: "text" })
    lastName: string

    @Column({ nullable: false, type: "text" })
    @Unique(["email"])
    email: string

    @Column({ nullable: false, type: "text" })
    @Exclude()
    password: string

    @Column({ nullable: true, type: "text" })
    @Exclude()
    recoverToken: string;

    // * Relações
    @ManyToOne(() => Role, role => role.Users, { nullable: false })
    role: Role

    @OneToOne(() => UserProfile, profile => profile.user, { nullable: true, cascade: true })
    @JoinColumn()
    profile: UserProfile

    @OneToMany(() => UserAddress, user_address => user_address.id, { cascade: true })
    addresses: UserAddress[];

    // * timestamps
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
        this.firstName = user?.firstName
        this.lastName = user?.lastName
        this.email = user?.email
        this.password = user?.password
        this.recoverToken = user?.recoverToken
        this.role = user?.role
        this.createdAt = user?.createdAt
        this.updatedAt = user?.updatedAt
    }
}
