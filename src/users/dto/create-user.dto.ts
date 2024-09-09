import { messagesHelper } from 'src/helpers/messages.helper';
import { RegExHelper } from './../../helpers/regex.helper';
import { IsEnum, IsNotEmpty, Matches } from "class-validator";
import { Roles } from 'src/enums/Roles';

export class CreateUserDto {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    lastname: string;

    @IsNotEmpty()
    @Matches(RegExHelper.email, { message: messagesHelper.emailMessage })
    email: string;

    avatar: string;

    @IsNotEmpty()
    @Matches(RegExHelper.password, { message: messagesHelper.passwordMessages })    
    password: string;

    recoverToken: string;
    
    // @IsEnum(Roles)
    role: string
}
