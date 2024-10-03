import { User } from "src/user/entities/user.entity"
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class UserProfile {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({ nullable: true, type: "text" })
    avatarUrl: string

    @Column({ nullable: true, type: "text" })
    bio: string

    @Column({ nullable: true, type: "text" })
    phoneNumber: string

    @Column({ nullable: true, type: "date" })
    dateOfBirth: Date

    @OneToOne(() => User, user => user.profile, {onDelete: 'CASCADE'})    
    user: User        
}
