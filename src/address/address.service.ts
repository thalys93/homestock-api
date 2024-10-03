import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from './entities/address.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AddressService {
  private logger = new Logger(AddressService.name);

  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
  ) { }

  async create(createAddressDto: CreateAddressDto) {
    this.logger.warn("Iniciando Cadastro de Endereços..")        
    const address = await this.addressRepository.create(createAddressDto)
    await this.addressRepository.save(address)
    this.logger.log("Cadastro de Endereços Concluído")
    return { message: "Endereço Cadastrado com sucesso", address }
  }

  async paginate(options: IPaginationOptions) {
    this.logger.warn("Iniciando Paginação..")
    const queryBuilder = await this.addressRepository.createQueryBuilder('address')

    queryBuilder.leftJoinAndSelect('address.userAddress', 'userAddress')
    queryBuilder.orderBy('address.id', "DESC")
    this.logger.log("Paginação Concluida")
    return paginate<Address>(queryBuilder, options)
  }

  async findOne(id: string) {
    this.logger.warn("Iniciando Busca de Endereços..")
    const address = await this.addressRepository.findOne({ where: { id } })
    if (!address) {
      this.logger.error("Endereço Não Encontrado!")
      throw new NotFoundException("Endereço não encontrado")
    }
    this.logger.log("Busca de Endereços Concluída")
    return { found: address }
  }

  async update(id: string, updateAddressDto: UpdateAddressDto) {
    this.logger.warn("Iniciando Atualização de Endereços..")
    const address = await this.addressRepository.findOne({ where: { id } })
    if (!address) {
      this.logger.error("Endereço Não Encontrado!")
      throw new NotFoundException("Endereço não encontrado")
    }
    Object.assign(address, updateAddressDto)
    await this.addressRepository.save(address)
    this.logger.log("Atualização de Endereços Concluída")
    return { message: "Endereço Atualizado com sucesso", address }
  }

  async remove(id: string) {
    this.logger.warn("Iniciando Remoção de Endereços..")
    const address = await this.addressRepository.findOne({ where: { id } })
    if (!address) {
      this.logger.error("Endereço Não Encontrado!")
      throw new NotFoundException("Endereço não encontrado")
    }
    this.logger.log("Remoção de Endereços Concluída")
    await this.addressRepository.delete(id)
    return { message: "Endereço Removido com sucesso" }
  }
}
