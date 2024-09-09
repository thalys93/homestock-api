import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { isNotEmpty, IsNotEmpty } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    lastname: string;
    avatar: string;

    @IsNotEmpty()
    password: string;

    recoverToken?: string;

    role?: string;
}
