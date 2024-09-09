import { Controller, Get, Post, Body, Patch, Param, Delete, Query, DefaultValuePipe, ParseIntPipe, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiTags } from '@nestjs/swagger';
import { Methods } from 'src/enums/Methods';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Category } from './entities/category.entity';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/security/roles.guard';
import { RolesDecorator } from 'src/security/roles.decorator';
import { ADMIN_DEVELOPER_ROLES, USER_TESTER_ROLES } from 'src/enums/role-groups';
import { Roles } from 'src/enums/Roles';

@ApiTags("Product Categories Module")
@Controller('api/products/category')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@RolesDecorator(...USER_TESTER_ROLES , ...ADMIN_DEVELOPER_ROLES)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}
  
  @Post(`/${Methods.NEW}`)
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get(`/${Methods.ALL}`)
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ): Promise<Pagination<Category>>{
    limit = limit > 100 ? 100 : limit;
    return this.categoryService.paginate({
      page,
      limit,
      route: "/all"
    })
  }

  @Get(`/${Methods.FIND}/:id`)
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(+id);
  }

  @Patch(`/${Methods.UPDATE}/:id`)
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.update(+id, updateCategoryDto);
  }

  @Delete(`/${Methods.DELETE}/:id`)
  remove(@Param('id') id: string) {
    return this.categoryService.remove(+id);
  }
}
