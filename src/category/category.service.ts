import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) { }

  async paginate(options: IPaginationOptions, ) {
    const queryBuilder = this.categoryRepository.createQueryBuilder('cat');
    queryBuilder.orderBy('cat.category_name', "DESC");

    return paginate<Category>(queryBuilder, options);
  }

  async create(createCategoryDto: CreateCategoryDto) {
    const category = this.categoryRepository.create(createCategoryDto);
    await this.categoryRepository.save(category)

    return { message: "Categoria Criada com Sucesso! ", category }
  }
  
  async findOne(id: number) {
    const cat = await this.categoryRepository.findOne({ where: { id } })
    if (!cat) {
      throw new NotFoundException("Categoria não Encontrada")
    } else {
      return { found: cat }
    }
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const cat = await this.categoryRepository.findOne({ where: { id } });
    if (!cat) {
      throw new NotFoundException("Categoria não Encontrada")
    } else {
      Object.assign(cat, updateCategoryDto);
    }
    await this.categoryRepository.update(id, cat)
    return { message: "Categoria Atualizada com Sucesso!", cat }
  }

  async remove(id: number) {
    const cat = await this.categoryRepository.findOne({ where: { id } });
    if (!cat) {
      throw new NotFoundException("Categoria não Encontrada")
    } else {
      await this.categoryRepository.delete(id)
      return { message: `Categoria com o ID ${id} removida com Sucesso!` }
    }
  }
}
