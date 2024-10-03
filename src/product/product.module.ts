import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { CategoryService } from 'src/category/category.service';
import { Category } from 'src/category/entities/category.entity';
import { UserAddressService } from 'src/user-address/user-address.service';
import { UserAddress } from 'src/user-address/entities/user-address.entity';
import { UserAddressModule } from 'src/user-address/user-address.module';
import { AddressService } from 'src/address/address.service';
import { Address } from 'src/address/entities/address.entity';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';
import { Role } from 'src/roles/entities/role.entity';

const EntitiesGroups = [
  Product,
  Category,
  UserAddress,
  Address,
  User,
  Role
]

@Module({
  imports: [TypeOrmModule.forFeature(EntitiesGroups)],
  controllers: [ProductController],
  providers: [ProductService, CategoryService, UserAddressService, AddressService, UserService],
})
export class ProductModule { }
