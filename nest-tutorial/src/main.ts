import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // 1. Phải lấy port từ biến môi trường (process.env.PORT)
  // Nếu không có .env, mặc định dùng 3001 để khớp với Docker mapping
  const port = process.env.PORT || 3001;

  // 2. Cực kỳ quan trọng: Phải listen trên '0.0.0.0'
  // Nếu để mặc định (localhost), Docker sẽ không cho phép truy cập từ bên ngoài
  await app.listen(port, '0.0.0.0');

  logger.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
