import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { loginDto } from './dto/login.dto';

@ApiTags("Auth Routes")
@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @UseGuards(AuthGuard("local"))
    @Post("login")
    async login(@Body() Login: loginDto, @Req() req: any) {
        return await this.authService.login(req.user, Login);
    }   

}
