import { AuthGuard } from '@nestjs/passport';
import { Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { SeddingService } from './sedding.service';
import { ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/security/roles.guard';
import { RolesDecorator } from 'src/security/roles.decorator';
import { ADMIN_DEVELOPER_ROLES, ADMIN_ROLES } from 'src/enums/role-groups';

@ApiTags("Seeding Routes Protected")
@Controller('system/utils/sedding')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class SeddingControllerProtected {
    constructor(private readonly seddingService: SeddingService) { }

    @RolesDecorator(...ADMIN_ROLES)
    @Post('clear-database')
    @HttpCode(202)
    clearDatabase() {
        return this.seddingService.clearDB();
    }

    @RolesDecorator(...ADMIN_DEVELOPER_ROLES)
    @Post('create-roles')
    @HttpCode(201)
    createRoles() {
        return this.seddingService.createRoles();
    }

    @RolesDecorator(...ADMIN_DEVELOPER_ROLES)
    @Post("create-categories")
    @HttpCode(201)
    createCategories() {
        return this.seddingService.createCategories();
    }

}