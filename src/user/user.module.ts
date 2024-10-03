import { Module } from '@nestjs/common';
import { UserControllerUnprotected, UserControllerProtected } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { RolesModule } from 'src/roles/roles.module';
import { UserService } from './user.service';
import { UserAddressModule } from 'src/user-address/user-address.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), RolesModule, UserAddressModule],
  controllers: [UserControllerUnprotected, UserControllerProtected],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
