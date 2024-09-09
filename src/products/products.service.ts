import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { Category } from 'src/category/entities/category.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>
  ) { }

  async paginate(options: IPaginationOptions,) {
    const queryBuilder = this.productRepository.createQueryBuilder('prod');

    queryBuilder.leftJoinAndSelect('prod.category', 'category')
    queryBuilder.orderBy('prod', "DESC");

    return paginate<Product>(queryBuilder, options);
  }

  async create(createProductDto: CreateProductDto) {
    const categoryID = Number(createProductDto.category)
    const category = await this.categoryRepository.findOne({ where: { id: categoryID } });

    if (!category) {
      throw new NotFoundException('Categoria não encontrada')
    }

    const product = this.productRepository.create({ ...createProductDto, category });

    await this.productRepository.save(product)

    return { message: "Produto Criada com Sucesso! ", product: product }
  }


  async findOne(id: string) {
    const product = await this.productRepository.findOne({ where: { id }, relations: ['category'] })
    if (!product) {
      throw new NotFoundException("Produto não Encontrado")
    } else {
      return { found: product }
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.findOne({ where: { id }, relations: ['category'] });
    if (!product) {
      throw new NotFoundException("Produto não Encontrado")
    } else {
      Object.assign(product, updateProductDto);
    }
    await this.productRepository.update(id, product)
    return { message: "Produto Atualizado com Sucesso!", cat: product }
  }

  async remove(id: string) {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException("Produto não Encontrado")
    } else {
      await this.productRepository.delete(id)
      return { message: `Produto com o ID ${id} removido com Sucesso!` }
    }
  }
}
