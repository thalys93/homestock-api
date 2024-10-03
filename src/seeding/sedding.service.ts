import { faker, Faker } from '@faker-js/faker';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Category } from 'src/category/entities/category.entity';
import { Categories } from 'src/enums/Categories';
import { Roles } from 'src/enums/Roles';
import { Product } from 'src/product/entities/product.entity';
import { Role } from 'src/roles/entities/role.entity';
import { UserAddress } from 'src/user-address/entities/user-address.entity';
import { UserAddressService } from 'src/user-address/user-address.service';
import { CreateUserProfileDto } from 'src/user-profile/dto/create-user-profile.dto';
import { UserProfile } from 'src/user-profile/entities/user-profile.entity';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { User } from 'src/user/entities/user.entity';
import { Admin, DataSource } from 'typeorm';

@Injectable()
export class SeddingService implements OnModuleInit {
    private readonly logger = new Logger(SeddingService.name)

    constructor(
        private readonly dataSource: DataSource,
    ) { }

    async onModuleInit() {
        await this.createRoles();
        await this.createCategories();
        await this.createSystemAdmin();
    }

    async clearDB() {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // seeds
            const usersRepository = queryRunner.manager.getRepository(User);
            const productsRepository = queryRunner.manager.getRepository(Product);
            const categoryRepository = queryRunner.manager.getRepository(Category);
            const rolesRepository = queryRunner.manager.getRepository(Role)
            const UserAddressRepository = queryRunner.manager.getRepository(UserAddress);

            // tabelas

            const users = await usersRepository.find();
            const products = await productsRepository.find();
            const categories = await categoryRepository.find();
            const roles = await rolesRepository.find();
            const addresses = await UserAddressRepository.find()

            if (
                users.length > 0
                ||
                products.length > 0
                ||
                categories.length > 0
                ||
                roles.length > 0
                ||
                addresses.length > 0
            ) {
                await usersRepository.remove(users)
                await productsRepository.remove(products)
                await categoryRepository.remove(categories)
                await rolesRepository.remove(roles)
                await UserAddressRepository.remove(addresses)
                await queryRunner.commitTransaction();
                this.logger.debug("Banco de Dados Limpo com Sucesso")
                return "Banco de Dados Limpo com Sucesso!"
            } else {
                this.logger.warn("Banco de Dados já está vazio")
                return 'Banco de Dados já está vazio';
            }
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async createRoles() {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const rolesRepository = queryRunner.manager.getRepository(Role);

            const rolesToSeed = Object.values(Roles);

            for (const role of rolesToSeed) {
                const existingRole = await rolesRepository.findOneBy({ name: role });

                if (!existingRole) {
                    await rolesRepository.insert({ name: role });
                    this.logger.verbose(`Inserted role: ${role}`);
                } else {
                    this.logger.warn(`Role already exists: ${role}`);
                }
            }

            await queryRunner.commitTransaction();
            this.logger.log("Roles seeded successfully!")

        } catch (error) {
            await queryRunner.rollbackTransaction();
            this.logger.error('Failed to seed roles', error.stack);
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async createCategories() {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const categoryRepository = queryRunner.manager.getRepository(Category)

            const categoriesToSeed = Object.values(Categories)

            for (const category of categoriesToSeed) {
                const existingCategory = await categoryRepository.findOneBy({ name: category })

                if (!existingCategory) {
                    await categoryRepository.insert({ name: category })
                    this.logger.verbose(`Inserted Categories: ${category}`);
                } else {
                    this.logger.warn(`Category Already Exists: ${category}`)
                }
            }

            await queryRunner.commitTransaction();
            this.logger.log("Categories seeded successfully!")

        } catch (error) {
            await queryRunner.rollbackTransaction();
            this.logger.error('Failed to seed categories', error.stack);
        } finally {
            await queryRunner.release();
        }
    }

    async createSystemAdmin() {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        this.logger.warn('Attention, Started Admin Creation')
        try {
            const usersRepository = queryRunner.manager.getRepository(User)
            const userProfileRepository = queryRunner.manager.getRepository(UserProfile)
            const rolesRepository = queryRunner.manager.getRepository(Role)

            const AdminUser: CreateUserDto = {
                firstName: "Administrator",
                email: "admin@system.com",
                lastName: "Developer",
                password: "Admin@2024",
                role: Roles.Admin,
                recoverToken: null,
                profile: {
                    avatarUrl: "https://avatars.githubusercontent.com/u/102838847?s=400&u=52cc9956b1e83e5254fd6ea95269b5cdb241b1f6&v=4",
                    bio: faker.lorem.paragraph(3),
                    dateOfBirth: new Date("2000-01-01"),
                    phoneNumber: faker.phone.number({ style: 'human' }),
                }
            }


            let role = await rolesRepository.findOne({ where: { name: AdminUser.role } })

            if (!role) {
                this.logger.warn("Role não encontrado, atribuindo role padrão.")
                role = await rolesRepository.findOne({ where: { name: Roles.Admin } });
            }

            let existentUser = await usersRepository.findOne({ where: { email: AdminUser.email } });

            if (existentUser) {
                this.logger.log("Admin ja existente!")
                return existentUser
            } else {
                const newUser = usersRepository.create({ ...AdminUser, role });
                await usersRepository.save(newUser);
                await queryRunner.commitTransaction()
                this.logger.log('Admin created successfully');
            }

        } catch (error) {
            await queryRunner.rollbackTransaction();
            this.logger.error('Failed to Create Admin', error.stack)
        } finally {
            await queryRunner.release()
        }
    }
}
