import { CreateCategoryDto } from "src/category/dto/create-category.dto"

export class CreateProductDto {
    name: string
    quantity: number
    imageUrl?: string
    min_price: number
    max_price: number
    measure_unit: string
    user_address_id: string
    category?: CreateCategoryDto
    category_id?: number
}
