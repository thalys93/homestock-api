import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
    imports: [
        ConfigModule.forRoot(),
        UserModule,
        PassportModule,
        JwtModule.register({
            privateKey: process.env.JWT_SECRET_KEY,
            signOptions: {
                expiresIn: "3d",
            },
        })
    ],
    controllers: [
        AuthController, AuthController],
    providers: [
        AuthService, AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
