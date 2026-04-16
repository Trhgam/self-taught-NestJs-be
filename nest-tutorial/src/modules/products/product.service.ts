import { Injectable } from '@nestjs/common';
import { ProductDto } from 'src/dto/product.dto';
import { Product } from 'src/models/product.module';

@Injectable()
export class ProductService {
  private products: Product[] = [
    { id: 1, categoryId: 1, productName: 'Product 1', price: 100 },
    { id: 2, categoryId: 1, productName: 'Product 2', price: 200 },
    { id: 3, categoryId: 2, productName: 'Product 3', price: 300 },
    { id: 4, categoryId: 2, productName: 'Product 4', price: 400 },
    { id: 5, categoryId: 3, productName: 'Product 5', price: 500 },
    { id: 6, categoryId: 3, productName: 'Product 6', price: 600 },
  ];

  getProducts(): Product[] {
    return this.products;
  }

  createProduct(productDto: ProductDto): Product[] {
    const newProduct: Product = {
      id: this.products.length + 1,
      categoryId: productDto.categoryId,
      productName: productDto.productName,
      price: productDto.price,
    };
    this.products.push(newProduct);
    return this.products;
  }

  detailProduct(id: number): Product | undefined {
    return this.products.find((product) => product.id === id);
  }

  updateProduct(productDto: ProductDto, id: number): Product {
    const index = this.products.findIndex(
      (product) => product.id === Number(id),
    );
    this.products[index] = {
      ...this.products[index], // Giữ lại ID và các trường cũ
      ...productDto, // Ghi đè các trường mới từ DTO vào
    };

    return this.products[index];
  }

  deleteProduct(id: string): boolean {
    const index = this.products.findIndex(
      (product) => product.id === Number(id),
    );
    if (index !== -1) {
      this.products.splice(index, 1);
      return true;
    }
    return false;
  }
}

export default ProductService;
