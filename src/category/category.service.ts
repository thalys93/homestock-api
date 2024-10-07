import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';

@Injectable()
export class CategoryService {
  private logger = new Logger(CategoryService.name)

  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) { }

  async create(createCategoryDto: CreateCategoryDto) {
    this.logger.warn("Iniciando Cadastro de Categorias..")
    const category = this.categoryRepository.create(createCategoryDto);
    await this.categoryRepository.save(category);
    this.logger.log("Cadastro de Categorias Concluido")
    return { message: "Categoria Cadastrada com sucesso", category };
  }

  async paginate(options: IPaginationOptions) {
    this.logger.warn("Iniciando Paginação..")
    const queryBuilder = this.categoryRepository.createQueryBuilder('category')    
    queryBuilder.orderBy('category.id', "DESC")
    this.logger.log("Paginação Concluida")
    return paginate<Category>(queryBuilder, options)
  }

  async findOne(id: number) {
    this.logger.warn("Iniciando Busca de Categorias..")
    const category = await this.categoryRepository.findOne({ where: { id } })
    if(!category) {
      this.logger.error("Categoria Não Encontrada!")
      throw new NotFoundException("Categoria não encontrada")
    }
    this.logger.log("Busca de Categorias Concluida")
    return { found: category }
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    this.logger.warn("Iniciando Atualização de Categorias..")
    const category = await this.categoryRepository.findOne({ where: { id } })
    if(!category) {
      this.logger.error("Categoria Não Encontrada!")
      throw new NotFoundException("Categoria não encontrada")
    }
    Object.assign(category, updateCategoryDto)
    await this.categoryRepository.save(category)
    this.logger.log("Atualização de Categorias Concluída")
    return { message: "Categoria Atualizada com sucesso", category }
  }

  async remove(id: number) {
    this.logger.warn("Iniciando Remoção de Categorias..")
    const category = await this.categoryRepository.findOne({ where: { id } })
    if(!category) {
      this.logger.error("Categoria Não Encontrada!")
      throw new NotFoundException("Categoria não encontrada")
    }
    await this.categoryRepository.delete(id)
    this.logger.log("Remoção de Categorias Concluida")
    return { message: "Categoria Removida com sucesso" }
  }
}
