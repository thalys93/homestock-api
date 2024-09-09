import { Injectable, Logger } from '@nestjs/common';
import { Category } from 'src/category/entities/category.entity';
import { Categories } from 'src/enums/Categories';
import { Roles } from 'src/enums/Roles';
import { Product } from 'src/products/entities/product.entity';
import { Role } from 'src/roles/entities/role.entity';
import { User } from 'src/users/entities/user.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class SeddingService {
    private readonly logger = new Logger(SeddingService.name)

    constructor(
        private readonly dataSource: DataSource,
    ) { }

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

            // tabelas

            const users = await usersRepository.find();
            const products = await productsRepository.find();
            const categories = await categoryRepository.find();
            const roles = await rolesRepository.find();

            if (
                users.length > 0
                ||
                products.length > 0
                ||
                categories.length > 0
                ||
                roles.length > 0
            ) {
                await usersRepository.remove(users)
                await productsRepository.remove(products)
                await categoryRepository.remove(categories)
                await rolesRepository.remove(roles)
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
                const existingRole = await rolesRepository.findOneBy({ role_name: role });

                if (!existingRole) {
                    await rolesRepository.insert({ role_name: role });
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
            const categoriesRepository = queryRunner.manager.getRepository(Category)

            const categoriesToSeed = Object.values(Categories)

            for(const category of categoriesToSeed) {
                const existingCategory = await categoriesRepository.findOneBy({ category_name: category })

                if (!existingCategory) {
                    await categoriesRepository.insert({ category_name: category })
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

}
