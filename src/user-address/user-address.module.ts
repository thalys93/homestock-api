import { Module } from '@nestjs/common';
import { UserAddressService } from './user-address.service';
import { UserAddressController } from './user-address.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAddress } from './entities/user-address.entity';
import { Address } from 'src/address/entities/address.entity';
import { AddressService } from 'src/address/address.service';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';
import { Role } from 'src/roles/entities/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserAddress, Address, User, Role])],
  controllers: [UserAddressController],
  providers: [UserAddressService, AddressService, UserService],
  exports: [UserAddressService],
})
export class UserAddressModule {}
