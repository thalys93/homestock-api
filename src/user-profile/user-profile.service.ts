import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateUserProfileDto } from './dto/create-user-profile.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserProfile } from './entities/user-profile.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserProfileService {  
  private logger = new Logger(UserProfileService.name);

  constructor(
    @InjectRepository(UserProfile)
    private readonly userProfileRepository: Repository<UserProfile>
  ) { }
  

  async findOne(id: string) {
    this.logger.warn("Encontrando perfil de Usuário..")
    const userProfile = await this.userProfileRepository.findOne({ where: { id }});
    if (!userProfile) {
      this.logger.error("Perfil de Usuário nao encontrado!")
      throw new NotFoundException("Perfil de Usuário não encontrado");
    } else {
      this.logger.debug("Perfil de Usuário encontrado!")
      return { found: userProfile };
    }
  }

  async update(id: string, updateUserProfileDto: UpdateUserProfileDto) {
    this.logger.warn("Atualizando perfil de Usuário..")
    const userProfile = await this.userProfileRepository.findOne({ where: { id }});
    if (!userProfile) {
      this.logger.error("Perfil de Usuário não encontrado!")
      throw new NotFoundException("Perfil de Usuário não encontrado");
    } else {
      this.logger.debug("Perfil de Usuário encontrado!")
      Object.assign(userProfile, updateUserProfileDto);
      await this.userProfileRepository.update(id, userProfile);
      this.logger.debug("Perfil de Usuário Atualizado com sucesso!")
      return { message: "Perfil de Usuário Atualizado com sucesso", userProfile };
    }
  }
}
