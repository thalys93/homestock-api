import { Controller, Get, Post, Body, Patch, Param, Delete, DefaultValuePipe, ParseIntPipe, Query, HttpCode } from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { ApiTags } from '@nestjs/swagger';
import { Methods } from 'src/enums/Methods';

@ApiTags('Expense Routes')
@Controller('expense')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Post(`${Methods.CREATE}`)
  @HttpCode(201)
  create(@Body() createExpenseDto: CreateExpenseDto) {
    return this.expenseService.create(createExpenseDto);
  }

  @Get(`${Methods.FIND}`)
  @HttpCode(200)
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10
  ) {
    return this.expenseService.paginate({
      page,
      limit,
      route: "/expense/paginate"
    });
  }

  @Get(`${Methods.FIND}/:id`)
  @HttpCode(200)
  findOne(@Param('id') id: string) {
    return this.expenseService.findOne(id);
  }

  @Patch(`${Methods.UPDATE}/:id`)
  @HttpCode(202)
  update(@Param('id') id: string, @Body() updateExpenseDto: UpdateExpenseDto) {
    return this.expenseService.update(id, updateExpenseDto);
  }

  @Delete(`${Methods.DELETE}/:id`)
  @HttpCode(202)
  remove(@Param('id') id: string) {
    return this.expenseService.remove(id);
  }
}
