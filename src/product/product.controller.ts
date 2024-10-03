import { Controller, Get, Post, Body, Patch, Param, Delete, Query, DefaultValuePipe, ParseIntPipe } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiTags } from '@nestjs/swagger';
import { Methods } from 'src/enums/Methods';

@ApiTags('Product Routes')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post(`${Methods.CREATE}`)
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get(`${Methods.PAGINATE}`)
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10
  ) {
    return this.productService.paginate({
      page,
      limit,
      route: "/product/paginate"
    });
  }

  @Get(`${Methods.FIND}/:id`)
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Patch(`${Methods.UPDATE}/:id`)
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(`${Methods.DELETE}/:id`)
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}
