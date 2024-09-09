import { IsInt, IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateProductDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsInt()
    quantity: number;

    @IsNotEmpty()
    @IsString()
    image: string

    @IsNotEmpty()
    @IsInt()
    category: string;
}
