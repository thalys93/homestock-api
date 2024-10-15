import { BadRequestException, HttpException, Inject, Injectable, Logger, NotFoundException, Query, RequestMethod, forwardRef } from '@nestjs/common';
import { CreateUserAddressDto } from './dto/create-user-address.dto';
import { UpdateUserAddressDto } from './dto/update-user-address.dto';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserAddress } from './entities/user-address.entity';
import { AddressService } from 'src/address/address.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class UserAddressService {
  private logger = new Logger(UserAddressService.name);

  constructor(
    @InjectRepository(UserAddress)
    private readonly userAddressRepository: Repository<UserAddress>,

    @Inject(forwardRef(() => AddressService))
    private readonly addressService: AddressService,

    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService
  ) { }

  async create(createUserAddressDto: CreateUserAddressDto) {
    this.logger.warn("Iniciando Cadastro de Endereços..")
    if (!createUserAddressDto.user_id && !createUserAddressDto.address) {
      throw new BadRequestException("Especifique o ID do usuário e o Endereço")
    }
    const address = await this.addressService.create(createUserAddressDto.address)
    const user_result = await this.userService.findOne(createUserAddressDto.user_id)

    if (user_result instanceof NotFoundException) {
      throw new NotFoundException("Usuário não encontrado")
    }

    const user = user_result.found;
    if (address.message === "Endereço Cadastrado com sucesso") {
      const userAddress = await this.userAddressRepository.create(createUserAddressDto)

      userAddress.address = address.address
      userAddress.user = user

      await this.userAddressRepository.save(userAddress)
      this.logger.log("Cadastro de Endereços Concluído")
      return { message: "Endereço Cadastrado com sucesso", userAddress }
    } else {
      throw new HttpException(address.message, 400)
    }
  }

  async paginate(options: IPaginationOptions) {
    this.logger.warn("Iniciando Paginação..")
    const queryBuilder = await this.userAddressRepository.createQueryBuilder('userAddress')
    queryBuilder.leftJoinAndSelect('userAddress.address', 'address')
    queryBuilder.orderBy('userAddress.id', "DESC")
    this.logger.log("Paginação Concluida")
    return paginate<UserAddress>(queryBuilder, options)
  }

  async findOne(id: string) {
    this.logger.warn("Iniciando Busca de Endereços..")
    const userAddress = await this.userAddressRepository.findOne({ where: { id }, relations: ['address', 'products', 'expenses'] })
    if (!userAddress) {
      this.logger.error("Endereço Não Encontrado!")
      throw new NotFoundException("Endereço não encontrado")
    }
    this.logger.log("Busca de Endereços Concluída")
    return { found: userAddress }
  }

  async findUserID(id: string) {
    this.logger.warn("Iniciando Busca de Id de Usuários em Endereços...")
    const AllUsersAddress = await this.userAddressRepository.find({ select: ["user", "id", "nickname"], relations: ["user", "address"] })
    if (!AllUsersAddress) {
      this.logger.error("Endereço do Usuário Não Encontrado!")
      throw new NotFoundException("Endereço do Usuário Não Encontrado!")
    }
    this.logger.log("Busca de Id de Usuários em Endereços Concluída")
    this.logger.log(`Realizando Filtro do Usuário com o ID ${id}`)
    const user = AllUsersAddress.filter(user => user.user.id === id)
    if (!user) {
      this.logger.error("Endereço do Usuário Não Encontrado!")
      throw new NotFoundException("Endereço do Usuário Não Encontrado!")
    }
    const userAddresseFiltered = user.map(user => ({
      id: user.id,
      nickname: user.nickname,
      address: user.address
    }))
    return { found: userAddresseFiltered }
  }


  async update(id: string, updateUserAddressDto: UpdateUserAddressDto) {
    this.logger.warn("Iniciando Atualização de Endereços..")
    const userAddress = await this.userAddressRepository.findOne({ where: { id } })
    if (!userAddress) {
      this.logger.error("Endereço Não Encontrado!")
      throw new NotFoundException("Endereço não encontrado")
    }
    this.logger.log("Atualização de Endereços Concluída")
    Object.assign(userAddress, updateUserAddressDto)
    await this.userAddressRepository.save(userAddress)
    return { message: "Endereço Atualizado com sucesso", userAddress }
  }

  async remove(id: string) {
    this.logger.warn("Iniciando Remoção de Endereços..")
    const userAddress = await this.userAddressRepository.findOne({ where: { id } })
    if (!userAddress) {
      this.logger.error("Endereço Não Encontrado!")
      throw new NotFoundException("Endereço não encontrado")
    }
    this.logger.log("Remoção de Endereços Concluída")
    await this.userAddressRepository.delete(id)
    return { message: "Endereço Removido com sucesso" }
  }
}
