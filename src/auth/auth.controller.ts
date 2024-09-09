import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { loginDto } from './dto/login.dto';

@ApiTags("Auth Module")
@Controller("/api/auth")
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @UseGuards(AuthGuard("local"))
    @Post("login")
    async login(@Body() doLogin: loginDto, @Req() req: any) {
        return await this.authService.login(req.user);
    }   

}
