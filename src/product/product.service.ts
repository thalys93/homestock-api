import { BadRequestException, forwardRef, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { CategoryService } from 'src/category/category.service';
import { Category } from 'src/category/entities/category.entity';
import { UserAddressService } from 'src/user-address/user-address.service';

@Injectable()
export class ProductService {
  private logger = new Logger(ProductService.name);
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    
    @Inject(forwardRef(() => CategoryService))
    private readonly categoryService: CategoryService,

    @Inject(forwardRef(() => UserAddressService))
    private readonly userAdressService: UserAddressService
  ) { }

  async create(createProductDto: CreateProductDto) {
    this.logger.warn("Iniciando Cadastro de Produtos..")
    const product = await this.productRepository.create(createProductDto);
    if(!createProductDto.user_address_id) {
      this.logger.warn("Especifique o ID de endereço do usuário")
      throw new BadRequestException("Especifique o ID de endereço do usuário")
    }    
    if (createProductDto.category && !createProductDto.category_id) {
      this.logger.log("Cadastrando Categoria..")
      const category = await this.categoryService.create(createProductDto.category)
      const userAddressResult = await this.userAdressService.findOne(createProductDto.user_address_id)
      if (!userAddressResult) {
        throw new NotFoundException("Endereço não encontrado")
      }
      product.userAddress = userAddressResult.found
      product.category = category.category;
      await this.productRepository.save(product)      
      this.logger.log("Cadastro de Produtos Concluido")
      return {
        message: "Produto Cadastrado com sucesso!",
        info: `Produto com categoria: ${createProductDto.category.name}`
      };
    } else if (createProductDto.category_id) {
      this.logger.log("Verificando ID da Categoria")
      const category = await this.categoryService.findOne(createProductDto.category_id)
      this.logger.log("Categoria econtrada, prosseguindo")
      product.category = category.found
    }
      const userAddressResult = await this.userAdressService.findOne(createProductDto.user_address_id)
      if(!userAddressResult) {
        throw new NotFoundException("Endereço não encontrado")
      }      
      product.userAddress = userAddressResult.found
      await this.productRepository.save(product);
      this.logger.log("Cadastro de Produtos Concluido")
      return {
        message: "Produto Cadastrado com sucesso",
        info: "Sem categoria ou ID da categoria fornecido"
      };    
  }

  async paginate(options: IPaginationOptions) {
    this.logger.warn("Iniciando Paginação..")
    const queryBuilder = this.productRepository.createQueryBuilder('product');

    queryBuilder.leftJoinAndSelect('product.category', 'category');
    queryBuilder.orderBy('product.category', "DESC");

    this.logger.log("Paginação Concluida")
    return paginate<Product>(queryBuilder, options)
  }

  async findOne(id: string) {
    this.logger.warn("Iniciando Busca de Produtos..")
    const product = await this.productRepository.findOne({ where: { id }, relations: ['category'] });

    if (!product) {
      this.logger.error("Produto Não Encontrado!")
      throw new NotFoundException("Produto não encontrado")
    } else {
      this.logger.log("Busca de Produtos Concluida")
      return { found: product };
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    this.logger.warn("Iniciando Atualização de Produtos..");

    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      this.logger.error("Produto Não Encontrado!");      
      throw new NotFoundException("Produto não encontrado");
    }

    if (updateProductDto.category_id) {
      this.logger.log("Verificando Categoria..");
      const category = await this.categoryService.findOne(updateProductDto.category_id);
      if (!category) {
        this.logger.error("Categoria Não Encontrada!");
        return { message: "Categoria não encontrada" };
      }

      this.logger.log("Atualizando Categoria..");
      product.category = category.found;
    }

    Object.assign(product, updateProductDto);
    await this.productRepository.save(product);
    this.logger.log("Atualização de Produtos Concluída");
    return { message: "Produto Atualizado com sucesso", product };
  }

  async remove(id: string) {
    this.logger.warn("Iniciando Remoção de Produtos..")
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      this.logger.error("Produto Não Encontrado!")
      throw new NotFoundException("Produto não encontrado")
    } else {
      await this.productRepository.delete(id);
      this.logger.log("Remoção de Produtos Concluida")
      return { message: "Produto Removido com sucesso" };
    }
  }
}
