import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  ValidationPipe,
} from '@nestjs/common';
import ProductService from './product.service';
import { ResponseData } from 'src/global/globalClass';
import { HttpMessage } from 'src/global/globalEnum';
import { HttpStatus } from 'src/global/globalEnum';
import { Product } from 'src/models/product.module';
import { ProductDto } from 'src/dto/product.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  getProducts(): ResponseData<Product[]> {
    try {
      return new ResponseData<Product[]>(
        this.productService.getProducts(),
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      console.log(error);
      return new ResponseData<Product[]>(
        [],
        HttpStatus.ERROR,
        HttpMessage.ERROR,
      );
    }
  }

  @Post()
  createProduct(
    @Body(new ValidationPipe()) productDto: ProductDto,
  ): ResponseData<Product[]> {
    try {
      return new ResponseData<Product[]>(
        this.productService.createProduct(productDto),
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      console.log(error);
      return new ResponseData<Product[]>(
        [],
        HttpStatus.ERROR,
        HttpMessage.ERROR,
      );
    }
  }

  @Get(':id')
  detailProduct(@Param('id') id: number): ResponseData<Product> {
    try {
      const product = this.productService.detailProduct(Number(id));
      return new ResponseData<Product>(
        product as Product, // Ép kiểu nếu bạn chắc chắn id tồn tại
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      console.log(error);
      return new ResponseData<Product>([], HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }

  @Put(':id')
  updateProduct(
    @Body() productDto: ProductDto,
    @Param('id') id: string,
  ): ResponseData<Product> {
    try {
      return new ResponseData<Product>(
        this.productService.updateProduct(productDto, Number(id)),
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      console.log(error);
      return new ResponseData<Product>([], HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }

  @Delete(':id')
  deleteProduct(@Param('id') id: string): ResponseData<boolean> {
    try {
      return new ResponseData<boolean>(
        this.productService.deleteProduct(id),
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      console.log(error);
      return new ResponseData<boolean>(
        false,
        HttpStatus.ERROR,
        HttpMessage.ERROR,
      );
    }
  }
}
export default ProductController;
//  tesst
