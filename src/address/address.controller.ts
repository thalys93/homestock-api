import { Controller, Get, Post, Body, Patch, Param, Delete, DefaultValuePipe, ParseIntPipe, Query } from '@nestjs/common';
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
  create(@Body() createAddressDto: CreateAddressDto) {
    return this.addressService.create(createAddressDto);
  }

  @Get(`${Methods.PAGINATE}`)
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
  findOne(@Param('id') id: string) {
    return this.addressService.findOne(id);
  }

  @Patch(`${Methods.UPDATE}/:id`)
  update(@Param('id') id: string, @Body() updateAddressDto: UpdateAddressDto) {
    return this.addressService.update(id, updateAddressDto);
  }

  @Delete(`${Methods.DELETE}/:id`)
  remove(@Param('id') id: string) {
    return this.addressService.remove(id);
  }
}
