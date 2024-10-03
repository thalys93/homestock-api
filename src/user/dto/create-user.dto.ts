import { messagesHelper } from 'src/helpers/messages.helper';
import { RegExHelper } from './../../helpers/regex.helper';
import { IsNotEmpty, IsOptional, Matches } from "class-validator";
import { CreateUserProfileDto } from 'src/user-profile/dto/create-user-profile.dto';

export class CreateUserDto {
    @IsNotEmpty()
    firstName: string;

    @IsNotEmpty()
    lastName: string;

    @IsNotEmpty()
    @Matches(RegExHelper.email, { message: messagesHelper.emailMessage })
    email: string;

    @IsNotEmpty()
    @Matches(RegExHelper.password, { message: messagesHelper.passwordMessages })
    password: string;

    recoverToken: string;

    @IsOptional()
    profile?: CreateUserProfileDto

    @IsNotEmpty()
    role: string
}
