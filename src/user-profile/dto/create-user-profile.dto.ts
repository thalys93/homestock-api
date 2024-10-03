export class CreateUserProfileDto {
    avatarUrl: string;
    bio: string;
    phoneNumber: string;
    dateOfBirth: Date;
    userId?: string
}
