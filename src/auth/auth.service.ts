import { HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compareSync } from "bcrypt";
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService { 
    constructor(
        private readonly userService: UsersService,
        private readonly jwtService: JwtService,
    ) {}

    async login(user: User) {
        if(!user.role) {
            throw new UnauthorizedException('Cargo do usuário não definido')
        }

        const payload = {
            sub: user.id,
            email: user.email,
            name: user.name,
            role: user.role.role_name,
        };

        return {
            token: this.jwtService.sign(payload),
            statusCode: 200,
            userData: {
                id: user.id,
                email: user.email,
                role: user.role.role_name
            },
        };
    }

    async validateUser(email: string, password: string) {
        let user: any;
        try {
            user = await this.userService.findByEmail(email);
        } catch (e) {
            return null;
        }

        const isPassWordValid = compareSync(password, user.password);
        if (!isPassWordValid) return null;


        return user;
    }

    async checkToken(token: string, email: string) {
        const user = await this.userService.findByEmail(email);
        if (user.recoverToken === token) {
            return { message: "Token válido", statusCode: 200 };
        } else {
            return new HttpException({ message: "Token inválido" }, 401);
        }
    }
}
