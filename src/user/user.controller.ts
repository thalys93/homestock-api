import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, DefaultValuePipe, ParseIntPipe, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { Methods } from 'src/enums/Methods';
import { RolesGuard } from 'src/security/roles.guard';
import { RolesDecorator } from 'src/security/roles.decorator';
import { INFRA_ROLES, USER_TESTER_ROLES } from 'src/enums/role-groups';

@ApiTags("User Protected Routes")
@UseGuards(AuthGuard("jwt"), RolesGuard)
@Controller('/auth/user')
export class UserControllerProtected {
  constructor(private readonly usersService: UserService) {}
  
  @RolesDecorator(...INFRA_ROLES)
  @Get(`/${Methods.PAGINATE}`)
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ) {
    return this.usersService.paginate({
      page,
      limit,
      route: "/auth/user/paginate"      
    })
  }
  
  @RolesDecorator(...USER_TESTER_ROLES, ...INFRA_ROLES)
  @Get(`${Methods.FIND}/:id`)
  findOne(@Param('id') id: string) {
    return this.usersService.findOneAndGetAddress(id);
  } 

  @RolesDecorator(...INFRA_ROLES)
  @Patch(`${Methods.UPDATE}/:id`)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @RolesDecorator(...USER_TESTER_ROLES, ...INFRA_ROLES)
  @Patch(`${Methods.UPDATE}/me/:id`)
  updateMe(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @RolesDecorator(...INFRA_ROLES)
  @Delete(`${Methods.DELETE}/:id`)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @RolesDecorator(...USER_TESTER_ROLES, ...INFRA_ROLES)
  @Delete(`${Methods.DELETE}/me/:id`)
  removeMe(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}

@ApiTags("User Unprotected Routes")
@Controller('/user')
export class UserControllerUnprotected {
  constructor(private readonly usersService: UserService) { }

  @Post(`/${Methods.CREATE}`)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
}
