import { Module } from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { ExpenseController } from './expense.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Expense } from './entities/expense.entity';
import { UserAddressService } from 'src/user-address/user-address.service';
import { UserAddress } from 'src/user-address/entities/user-address.entity';
import { Address } from 'src/address/entities/address.entity';
import { User } from 'src/user/entities/user.entity';
import { Role } from 'src/roles/entities/role.entity';
import { AddressService } from 'src/address/address.service';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([Expense, UserAddress, Address, User, Role])],
  controllers: [ExpenseController],
  providers: [ExpenseService, UserAddressService, AddressService, UserService],
})
export class ExpenseModule {}
