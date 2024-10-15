import { HttpException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compareSync } from "bcrypt";
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { loginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    private logger = new Logger(AuthService.name);

    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) { }

    async login(user: User, Login: loginDto) {
        this.logger.log("Realizando Login...");
        if (!user.role) {
            this.logger.warn("Cargo do usuário não definido")
            throw new UnauthorizedException('Cargo do usuário não definido')
        }

        const payload = {
            sub: user.id,
            email: Login.email,
            name: user.firstName,
            role: user.role.name,
        };

        this.logger.log("Login realizado com sucesso!!");
        return {
            token: this.jwtService.sign(payload),
            userData: {
                id: user.id,
                email: Login.email,
                role: user.role.name
            },
        };
    }
    async validateUser(email: string, password: string) {
        let user: any;
        this.logger.log("Validando Usuário...")
        try {
            user = await this.userService.findByEmail(email);
        } catch (e) {
            return null;
        }

        const isPassWordValid = compareSync(password, user.password);
        if (!isPassWordValid) return null;

        this.logger.log("Login efetuado com sucesso!!");
        return user;
    }

    async checkToken(token: string, email: string) {
        const user = await this.userService.findByEmail(email);
        this.logger.log("Verificando Token...");
        if (user.recoverToken === token) {
            this.logger.log("Token Valido");
            return { message: "Token válido", statusCode: 200 };
        } else {
            this.logger.log("Token Inválido");
            return new HttpException({ message: "Token inválido" }, 401);
        }
    }
}
