import { Role } from 'src/roles/entities/role.entity';
import { Roles } from 'src/enums/Roles';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';

@Injectable()
export class UsersService {
  private logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    @InjectRepository(Role)
    private readonly rolesRepository: Repository<Role>
  ) { }

  async paginate(options: IPaginationOptions,) {
    const queryBuilder = this.usersRepository.createQueryBuilder('user');
    
    queryBuilder.leftJoinAndSelect('user.role', 'role')
    queryBuilder.orderBy('user.role', "DESC");

    return paginate<User>(queryBuilder, options);
  }

  async create(createUserDto: CreateUserDto) {
    let role: Role | null = null;
    if (createUserDto.role) {
      role = await this.rolesRepository.findOne({ where: { role_name: createUserDto.role } });
    }

    if (!role) {
      this.logger.warn("Cargo não encontrado ou não fornecido, atribuindo role padrão.")
      const defaultRole = await this.rolesRepository.findOne({ where: { role_name: Roles.User } });

      if (!defaultRole) {        
        this.logger.error("Role padrão 'User' não encontrado no banco de dados.");
        throw new Error("Role padrão 'User' não encontrado.");
      }

      // Cria o usuário com o role padrão
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
      select: ["id", "name", "email", "avatar", "role"]
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
      return { message: "Usuário não encontrado" };
    } else {
      return { found: user };
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
      return { message: "Usuário não encontrado" };
    } else {
      Object.assign(user, updateUserDto);
    }
    await this.usersRepository.update(id, user);
    return { message: "Usuário Atualizado com sucesso", user };
  }

  async updateToken(id: string, token: string) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      return { message: "Usuário não encontrado" };
    } else {
      user.recoverToken = token;
      await this.usersRepository.update(id, user);
      return { message: "Token atualizado com sucesso", user };
    }
  }

  async remove(id: string) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      return { message: "Usuário não encontrado" };
    } else {
      await this.usersRepository.delete(id);
      return { message: `Usuário foi deletado com sucesso!`, userID: id };
    }
  }
}
