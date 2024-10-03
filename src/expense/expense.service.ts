import { forwardRef, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Expense } from './entities/expense.entity';
import { Repository } from 'typeorm';
import { UserAddressService } from 'src/user-address/user-address.service';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';

@Injectable()
export class ExpenseService {
  private logger = new Logger(ExpenseService.name);

  constructor(
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,

    @Inject(forwardRef(() => UserAddressService))
    private readonly userAddressService: UserAddressService

  ) { }

  async create(createExpenseDto: CreateExpenseDto) {
    this.logger.warn("Iniciando Criação de Despesas..")
    const userAdressResult = await this.userAddressService.findOne(createExpenseDto.user_address_id)
    if (!userAdressResult) {
      this.logger.error("Endereço Não Encontrado!")
      throw new NotFoundException("Endereço não encontrado")
    }
    const expense = this.expenseRepository.create({
      ...createExpenseDto,
      userAddress: userAdressResult.found
    })
    this.logger.log("Criação de Despesas Concluída")
    return this.expenseRepository.save(expense)
  }

  async paginate(options: IPaginationOptions) {
    this.logger.warn("Iniciando Paginação..")
    const queryBuilder = await this.expenseRepository.createQueryBuilder('expense')
    queryBuilder.leftJoinAndSelect('expense.userAddress', 'userAddress')
    queryBuilder.orderBy('expense.id', "DESC")
    this.logger.log("Paginação Concluída")
    return paginate<Expense>(queryBuilder, options)
  }

  async findOne(id: string) {
    this.logger.warn("Iniciando Busca de Despesas..")
    const expense = await this.expenseRepository.findOne({ where: { id }, relations: ['userAddress'] })
    if (!expense) {
      this.logger.error("Despesa Não Encontrada!")
      throw new NotFoundException("Despesa não encontrada")
    }
    this.logger.log("Busca de Despesas Concluída")
    return { found: expense }
  }

  async update(id: string, updateExpenseDto: UpdateExpenseDto) {
    this.logger.warn("Iniciando Atualização de Despesas..")
    const expense = await this.expenseRepository.findOne({ where: { id } })
    if (!expense) {
      this.logger.error("Despesa Não Encontrada!")
      throw new NotFoundException("Despesa não encontrada")
    }
    this.logger.log("Atualização de Despesas Concluída")
    Object.assign(expense, updateExpenseDto)
    return {
      message: "Despesa Atualizada com sucesso",
      expense
    }
  }

  async remove(id: string) {
    this.logger.warn("Iniciando Remoção de Despesas..")
    const expense = await this.expenseRepository.findOne({ where: { id } })
    if (!expense) {
      this.logger.error("Despesa Não Encontrada!")
      throw new NotFoundException("Despesa não encontrada")
    }
    this.logger.log("Remoção de Despesas Concluida")
    return {
      message: "Despesa Removida com sucesso",
      expense
    }
  }
}
