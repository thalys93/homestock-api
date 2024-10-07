import { Controller, Get, Post, Body, Patch, Param, Delete, DefaultValuePipe, ParseIntPipe, Query, UseGuards, HttpCode } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ApiTags } from '@nestjs/swagger';
import { Methods } from 'src/enums/Methods';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/security/roles.guard';
import { RolesDecorator } from 'src/security/roles.decorator';
import { Roles } from 'src/enums/Roles';
import { ADMIN_ROLES, USER_TESTER_ROLES } from 'src/enums/role-groups';

@ApiTags("User Roles Routes Protected")
@Controller('security/roles/admin')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class RolesControllerProtected {
  constructor(private readonly rolesService: RolesService) {}

  @RolesDecorator(...ADMIN_ROLES)
  @Post(`${Methods.CREATE}`)
  @HttpCode(201)
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }
  

  @RolesDecorator(...ADMIN_ROLES )
  @Patch(`${Methods.UPDATE}/:id`)
  @HttpCode(202)
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(+id, updateRoleDto);
  }

  @RolesDecorator(...ADMIN_ROLES)
  @Delete(`${Methods.DELETE}/:id`)
  @HttpCode(202)
  remove(@Param('id') id: string) {
    return this.rolesService.remove(+id);
  }
}

@ApiTags("User Roles Routes Unprotected")
@Controller('security/roles')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
export class RolesControllerUnprotected{
  constructor(private readonly rolesService: RolesService) { }

  @RolesDecorator(...USER_TESTER_ROLES)
  @Get(`${Methods.PAGINATE}`)
  @HttpCode(200)
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ) {
    limit = limit > 100 ? 100 : limit;
    return this.rolesService.paginate({
      page,
      limit,
      route: "/all"
    })
  }

  @RolesDecorator(...USER_TESTER_ROLES)
  @Get(`${Methods.FIND}/:id`)
  @HttpCode(200)
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(+id);
  }
}
