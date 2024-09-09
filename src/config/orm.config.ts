import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const config: TypeOrmModuleOptions = {
    type: "postgres",
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || "root",
    port: parseInt(process.env.DB_PORT),
    host: process.env.DB_HOST || "localhost",
    database: process.env.DB_DATABASE,
    synchronize: true,
    entities: ["dist/**/*.entity{.ts,.js}"]
}