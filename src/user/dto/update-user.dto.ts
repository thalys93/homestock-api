import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { isNotEmpty, IsNotEmpty } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    firstName?: string;
    lastName?: string;        
    password?: string;
    recoverToken?: string;
    role?: string;
}
