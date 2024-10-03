import { SeddingModule } from './seeding/sedding.module';
import { AuthModule } from './auth/auth.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RolesModule } from './roles/roles.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from './config/orm.config';
import { UserProfileModule } from './user-profile/user-profile.module';
import { UserAddressModule } from './user-address/user-address.module';
import { AddressModule } from './address/address.module';
import { ExpenseModule } from './expense/expense.module';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [
    UserAddressModule,
    AddressModule,
    SeddingModule,
    AuthModule,
    AuthModule,
    RolesModule,
    ProductModule,
    CategoryModule,
    TypeOrmModule.forRoot(config),
    ConfigModule.forRoot(),
    UserProfileModule,
    ExpenseModule,
    ProductModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
