import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UserProfileService } from './user-profile.service';
import { CreateUserProfileDto } from './dto/create-user-profile.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/security/roles.guard';
import { Methods } from 'src/enums/Methods';

@ApiTags("User Profile Module")
@UseGuards(AuthGuard("jwt"), RolesGuard)
@Controller('auth/user/profile')
export class UserProfileController {
  constructor(private readonly userProfileService: UserProfileService) { }

  @Get(`/${Methods.FIND}/:id`)

  findOne(@Param('id') id: string) {
    return this.userProfileService.findOne(id);
  }

  @Patch(`/${Methods.UPDATE}/:id`)
  update(@Param('id') id: string, @Body() updateUserProfileDto: UpdateUserProfileDto) {
    return this.userProfileService.update(id, updateUserProfileDto);
  }

}
