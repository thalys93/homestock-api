import { Controller, Get, Post, Body, Patch, Param, Delete, DefaultValuePipe, ParseIntPipe, Query, HttpCode } from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { ApiTags } from '@nestjs/swagger';
import { Methods } from 'src/enums/Methods';

@ApiTags("Address Routes")
@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post(`${Methods.CREATE}`)
  @HttpCode(201)
  create(@Body() createAddressDto: CreateAddressDto) {
    return this.addressService.create(createAddressDto);
  }

  @Get(`${Methods.PAGINATE}`)
  @HttpCode(200)
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10
  ) {
    return this.addressService.paginate({
      page,
      limit,
      route: "/address/paginate"
    });
  }

  @Get(`${Methods.FIND}/:id`)
  @HttpCode(200)
  findOne(@Param('id') id: string) {
    return this.addressService.findOne(id);
  }

  @Patch(`${Methods.UPDATE}/:id`)
  @HttpCode(202)
  update(@Param('id') id: string, @Body() updateAddressDto: UpdateAddressDto) {
    return this.addressService.update(id, updateAddressDto);
  }

  @Delete(`${Methods.DELETE}/:id`)
  @HttpCode(202)
  remove(@Param('id') id: string) {
    return this.addressService.remove(id);
  }
}
