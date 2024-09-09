import { Controller, Get, Post, Body, Patch, Param, Delete, DefaultValuePipe, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Category } from 'src/category/entities/category.entity';
import { Methods } from 'src/enums/Methods';
import { Product } from './entities/product.entity';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { USER_TESTER_ROLES, ADMIN_DEVELOPER_ROLES } from 'src/enums/role-groups';
import { RolesDecorator } from 'src/security/roles.decorator';
import { RolesGuard } from 'src/security/roles.guard';

@ApiTags("Product Module")
@Controller('api/products')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@RolesDecorator(...USER_TESTER_ROLES, ...ADMIN_DEVELOPER_ROLES)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post(`/${Methods.NEW}`)
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }


  @Get(`/${Methods.ALL}`)
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ): Promise<Pagination<Product>> {
    limit = limit > 100 ? 100 : limit;
    return this.productsService.paginate({
      page,
      limit,
      route: "/all"
    })
  }

  @Get(`/${Methods.FIND}/:id`)
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(`/${Methods.UPDATE}/:id`)
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(`/${Methods.DELETE}/:id`)
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
