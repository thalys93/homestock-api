import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, DefaultValuePipe, HttpCode } from '@nestjs/common';
import { UserAddressService } from './user-address.service';
import { CreateUserAddressDto } from './dto/create-user-address.dto';
import { UpdateUserAddressDto } from './dto/update-user-address.dto';
import { ApiTags } from '@nestjs/swagger';
import { Methods } from 'src/enums/Methods';

@ApiTags("User Address Routes")
@Controller('auth/user/address')
export class UserAddressController {
  constructor(private readonly userAddressService: UserAddressService) {}

  @Post(`${Methods.CREATE}`)
  create(@Body() createUserAddressDto: CreateUserAddressDto) {
    return this.userAddressService.create(createUserAddressDto);
  }

  @Get(`${Methods.PAGINATE}`)
  @HttpCode(200)
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10
  ) {
    return this.userAddressService.paginate({
      page,
      limit,
      route: "/auth/user/address/paginate"
    });
  }

  @Get(`${Methods.FIND}/:id`)
  @HttpCode(200)
  findOne(@Param('id') id: string) {
    return this.userAddressService.findOne(id);
  }

  @Patch(`${Methods.UPDATE}/:id`)
  @HttpCode(202)
  update(@Param('id') id: string, @Body() updateUserAddressDto: UpdateUserAddressDto) {
    return this.userAddressService.update(id, updateUserAddressDto);
  }

  @Delete(`${Methods.DELETE}/:id}`)
  @HttpCode(202)
  remove(@Param('id') id: string) {
    return this.userAddressService.remove(id);
  }
}
