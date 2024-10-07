import { Controller, Get, Post, Body, Patch, Param, Delete, Query, DefaultValuePipe, ParseIntPipe, HttpCode } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiTags } from '@nestjs/swagger';
import { Methods } from 'src/enums/Methods';

@ApiTags('Category Routes')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post(`${Methods.CREATE}`)
  @HttpCode(201)
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get(`${Methods.PAGINATE}`)
  @HttpCode(200)
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10
  ) {
    return this.categoryService.paginate({
      page,
      limit,
      route: "/category/paginate"
    });
  }

  @Get(`${Methods.FIND}/:id`)
  @HttpCode(200)
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(+id);
  }

  @Patch(`${Methods.UPDATE}/:id`)
  @HttpCode(202)
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.update(+id, updateCategoryDto);
  }

  @Delete(`${Methods.DELETE}/:id`)
  @HttpCode(202)
  remove(@Param('id') id: string) {
    return this.categoryService.remove(+id);
  }
}
