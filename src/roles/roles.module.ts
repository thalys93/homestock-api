import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesControllerProtected, RolesControllerUnprotected } from './roles.controller';
import { Role } from './entities/role.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Role])],
  controllers: [RolesControllerProtected, RolesControllerUnprotected],
  providers: [RolesService],
  exports: [RolesService, TypeOrmModule]
})
export class RolesModule {}
