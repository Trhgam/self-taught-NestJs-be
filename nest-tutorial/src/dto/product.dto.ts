import { MinLength, IsNotEmpty, IsNumber } from 'class-validator';

export class ProductDto {
  @IsNotEmpty({ message: 'Category ID is required' })
  categoryId?: number;

  @MinLength(5, { message: 'Product name must be at least 5 characters long' })
  productName?: string;

  @IsNumber({}, { message: 'Price must be a number' })
  price?: number;
}
