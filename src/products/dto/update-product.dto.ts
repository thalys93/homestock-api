import { PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {
    name?: string;
    quantity?: number;
    image?: string;
    category?: string;
}
