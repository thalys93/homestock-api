import { Role } from 'src/roles/entities/role.entity';
import { Roles } from 'src/enums/Roles';
import { forwardRef, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { UserAddress } from 'src/user-address/entities/user-address.entity';
import { UserAddressService } from 'src/user-address/user-address.service';
import { log } from 'console';

@Injectable()
export class UserService {
  private logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly rolesRepository: Repository<Role>,

    @Inject(forwardRef(() => UserAddressService))
    private readonly userAddressService: UserAddressService
  ) { }

  async paginate(options: IPaginationOptions,) {
    const queryBuilder = this.usersRepository.createQueryBuilder('user');

    queryBuilder.leftJoinAndSelect('user.role', 'role')
    queryBuilder.leftJoinAndSelect('user.profile', 'profile')
    queryBuilder.orderBy('user.role', "DESC");
    return paginate<User>(queryBuilder, options);
  }

  async getUserAddresses(userId: string) {
    const userAddreses = await this.userAddressService.findUserID(userId);
    if (!userAddreses) {
      throw new Error(`Usuário não encontrado`);
    }
    return userAddreses.found;
  }

  async create(createUserDto: CreateUserDto) {
    let role: Role | null = null;
    if (createUserDto.role) {
      role = await this.rolesRepository.findOne({ where: { name: createUserDto.role } });
    }

    if (!role) {
      this.logger.warn("Cargo não encontrado ou não fornecido, atribuindo role padrão.")
      const defaultRole = await this.rolesRepository.findOne({ where: { name: Roles.User } });

      if (!defaultRole) {
        this.logger.error("Role padrão 'User' não encontrado no banco de dados.");
        throw new Error("Role padrão 'User' não encontrado.");
      }


      const defaultUser = this.usersRepository.create({ ...createUserDto, role: defaultRole });
      await this.usersRepository.save(defaultUser);

      return { message: "Usuário criado com role padrão!", defaultUser };
    }

    this.logger.debug("Usuário com Cargo Detectado, Criando..")
    const user = this.usersRepository.create({ ...createUserDto, role });
    await this.usersRepository.save(user)
    return { message: "Usuário Criado com Sucesso!", user }
  }

  async findAll() {
    const allUsers = await this.usersRepository.find({
      select: ["id", "firstName", "email", "role", "profile"]
    });
    if (allUsers.length === 0) {
      throw new NotFoundException("Nenhum Usuário Encontrado")
    } else {
      return { found: allUsers }
    }
  }

  async findOne(id: string) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      return new NotFoundException("Nenhum Usuário Encontrado")
    } else {
      return { found: user };
    }
  }

  async findOneAndGetAddress(id: string) {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['role', 'profile']
    });

    if (!user) {
      return new NotFoundException("Nenhum Usuário Encontrado")
    } else {
      const addresses = await this.getUserAddresses(id)

      return { found: user, addresses };
    }
  }

  async findByEmail(email: string) {
    try {
      return await this.usersRepository.findOneOrFail({ where: { email }, relations: ['role'] });
    } catch (e) {
      throw new NotFoundException("Email não encontrado");
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      return new NotFoundException("Usuário Não Encontrado")
    } else {
      Object.assign(user, updateUserDto);
    }
    await this.usersRepository.update(id, user);
    return { message: "Usuário Atualizado com sucesso", user };
  }

  async updateToken(id: string, token: string) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      return new NotFoundException("Usuário Não Encontrado")
    } else {
      user.recoverToken = token;
      await this.usersRepository.update(id, user);
      return { message: "Token atualizado com sucesso", user };
    }
  }

  async remove(id: string) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      return new NotFoundException("Usuário Não Encontrado")
    } else {
      await this.usersRepository.delete(id);
      return { message: `Usuário foi deletado com sucesso!`, userID: id };
    }
  }
}
